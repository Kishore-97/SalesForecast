import base64
from datetime import datetime
import json
import os
from flask import Flask,request,jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from autots import AutoTS
import pandas_profiling

app = Flask(__name__)

CORS(app)

user_list = ['ned','jon','arya','bran']
pass_list = ['head','snow','stark','wolf']




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
        try:
            df[col]=pd.to_numeric(df[col])
        except:
            pass
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
    model = AutoTS(forecast_length=forecast,max_generations=0,num_validations=0,validation_method="backwards",ensemble='None',frequency='infer')
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
    fit_mod_str = str(fitted_model)

    pred = fitted_model.predict(forecast_length=forecast)
    print(pred.forecast.head())
    predictions = pred.forecast

    for col in predictions.columns:
        predictions.rename(columns={col: col+'_predicted'}, inplace=True)

    full = pd.concat([df,predictions],axis=1)

    path = 'C:\\Angular, Flask\\Angular\\digiverz\\Outputs'
    dir = str(datetime.now())
    dir = dir.replace(':','-')
    out_dir = path + '\\' + dir
    os.mkdir(out_dir)

    pred_plot = predictions.plot()
    plt.savefig(out_dir+'\\predictions')
    full_plot=full.plot()
    plt.savefig(out_dir+'\\full')

    img_data = {}
    
    with open(out_dir+'\\predictions.png', mode='rb') as file:
        pred_img = file.read()
        img_data['pred'] = base64.encodebytes(pred_img).decode('utf-8')
    with open(out_dir+'\\full.png', mode='rb') as file:
        full_img = file.read()
        img_data['full'] = base64.encodebytes(full_img).decode('utf-8')

    


    predictions.index = predictions.index.map(str)
    full.index = full.index.map(str) 
    predictions_json=predictions.to_json()
    full_json = full.to_json()



    return jsonify(predictions_json, full_json, img_data, 
                    best_mod, best_par, best_trans, 
                    fit_mod_str,EDA)

if __name__ == "main":
    app.run(debug=True)