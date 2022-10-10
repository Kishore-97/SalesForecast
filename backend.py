from cProfile import label
from distutils.log import error
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from datetime import datetime
import json
import os
from flask import Flask,request,jsonify
from flask_cors import CORS
import pandas as pd
from autots import AutoTS
import pandas_profiling
from sklearn.metrics import mean_squared_error
import numpy as np

app = Flask(__name__)

CORS(app)

user_list = ['ned','jon','arya','bran']
pass_list = ['head','snow','stark','wolf']

# pred_file =''




@app.route("/",methods=['GET','POST'])
def login():
    data = request.data.decode()
    data = json.loads(data)
    username = data['username']
    password = data['password']
    print(username,password)


    for i in range(len(user_list)):
        if(username == user_list[i]):
            if(password == pass_list[i]):
                return jsonify("authenticated")
            else:
                return jsonify("incorrect password")
    return jsonify("user not found")

@app.route("/predict",methods=['GET','POST'])
def predict():

    input_data = request.data.decode()
    input_data = json.loads(input_data)
    ds = input_data[0]
    target_var = input_data[1]
    date_var = input_data[2]
    periodicity = input_data[3]
    n = input_data[4]
    n=n.strip()
    if n == '':
        n='1'
    df =[]
    for row in ds.split('\n'):
        subl=[]
        for cell in row.split(','):
            subl.append(cell)
        df.append(subl)
    print(df[0])
    df = pd.DataFrame(df,columns=df[0])
    df.drop(index=0,inplace=True)
    df[date_var]= pd.to_datetime(df[date_var])
    df.set_index(date_var,inplace=True)
    print(df.dtypes,df.head())

    EDA = pandas_profiling.ProfileReport(df).to_html()

    for col in df.columns:
        df[col]=pd.to_numeric(df[col],errors='coerce')
    
    print("df length before astype:", len(df))
    df[target_var]=df[target_var].astype('int64')
    print("df length after astype:", len(df))

    print(df.dtypes)

    forecast = 0
    if periodicity=='Days':
        forecast = int(n) * 1
    elif periodicity=='Weeks':
        forecast = int(n) * 7
    elif periodicity=='Months':
        forecast = int(n) *30
    elif periodicity == 'Years':
        forecast = int(n) *365

    # print(forecast)
    model = AutoTS(forecast_length=forecast,
    frequency='infer',
    prediction_interval=1,
    ensemble=None,
    model_list="fast",  
    transformer_list="fast",
    drop_most_recent=1,
    max_generations=0,
    num_validations=0,
    validation_method="backwards")
    if len(df.columns)==1:
        model = model.import_template('uni_var.csv',method='only')
        print('univar init')
    elif len(df.columns)>1:
        model = model.import_template('multi_var.csv',method='only')
        print('multivar init')

    fitted_model = model.fit(df)
    best_mod = fitted_model.best_model_name
    best_par = fitted_model.best_model_params
    best_trans = fitted_model.best_model_transformation_params

    print(best_mod,best_par,best_trans)
    # print(fitted_model)
    error_rate = str(fitted_model.failure_rate)

    pred = fitted_model.predict(forecast_length=forecast)
    print(pred.forecast.head())
    predictions = pred.forecast
    print("pred length before astype:", len(predictions))
    predictions[target_var]=predictions[target_var].astype('int64')
    print("pred length after astype:", len(predictions))
    
    for col in predictions.columns:
        predictions.rename(columns={col: col+'_predicted'}, inplace=True)

    back_f = fitted_model.back_forecast(column=target_var).forecast
    print('back forecast:',len(back_f))
    back_f.rename(columns={target_var: target_var+'_back_forecasted'}, inplace=True)
    back_forecast = pd.concat([df[target_var],back_f],axis=1)

    if len(df)==len(back_f):
        rmse = np.sqrt(mean_squared_error(df[target_var],back_f))
    elif len(df)<len(back_f):
        rmse = np.sqrt(mean_squared_error(df[target_var],back_f[:(len(df))]))
    else:
        rmse = np.sqrt(mean_squared_error(df[target_var][:(len(back_f))],back_f))
    
    # print("\n" ,predictions)

    full = pd.concat([df,predictions],axis=1)
    print(full.tail())

    path = 'C:\\Angular, Flask\\Angular\\digiverz\\Outputs'
    file_path = 'C:\\Users\\lKK97\\OneDrive\\Digiverz Outputs'
    dir = str(datetime.now())
    dir = dir.replace(':','-')
    out_dir = path + '\\' + dir
    os.mkdir(out_dir)

    def plot(ds,name):
        ds.plot(figsize=(20,5),legend=True)
        plt.savefig(out_dir+name)

    plot(full,'\\train&pred')
    plot(back_forecast,'\\back_forecast')
    target_df=pd.DataFrame(predictions[target_var+'_predicted'])
    plot(target_df,'\\predictions')

    predictions.to_csv(file_path+'\\predictions.csv')
    full.to_csv(file_path+"\\train & pred.csv")
    back_forecast.to_csv(file_path+"\\train & back_forecast.csv")

    # pred_file = full.copy()

    img_data = {}
    
    with open(out_dir+'\\predictions.png', mode='rb') as file:
        pred_img = file.read()
        img_data['pred'] = base64.encodebytes(pred_img).decode('utf-8')
    with open(out_dir+'\\train&pred.png', mode='rb') as file:
        full_img = file.read()
        img_data['full'] = base64.encodebytes(full_img).decode('utf-8')
    with open(out_dir+'\\back_forecast.png', mode='rb') as file:
        bf_img = file.read()
        img_data['back_forecast'] = base64.encodebytes(bf_img).decode('utf-8')

    


    predictions.index = predictions.index.map(str)
    full.index = full.index.map(str) 
    predictions.reset_index(inplace=True)
    full.reset_index(inplace=True)
    predictions_json=predictions.to_json()
    full_json = full.to_json()

    pred_head = [i for i in predictions.columns]
    full_head = [i for i in full.columns]

    print(pred_head,full_head)

    return jsonify(predictions_json, full_json, img_data, 
                    best_mod, best_par, best_trans,error_rate,EDA,pred_head,full_head,rmse)

if __name__ == "main":
    app.run(debug=True)

# @app.route("/dashboard",methods=['GET','POST'])
# def dashboard():
#     return (pred_file.to_csv())