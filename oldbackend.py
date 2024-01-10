from flask import Flask, request, jsonify, g, session
from flask_pymongo import PyMongo
import numpy as np
from sklearn.metrics import mean_squared_error
import pandas_profiling
from autots import AutoTS
import pandas as pd
from flask_cors import CORS, cross_origin
import os
import json
from datetime import datetime
import base64
import io
import matplotlib.pyplot as plt
import matplotlib
import jwt
from datetime import datetime, timedelta
from functools import wraps
matplotlib.use('Agg')

@app.route("/oldforecast",methods=['GET', 'POST'])
@token_required
def oldforecast():
    print(type(request.data))
    input_data = request.data.decode()
    input_data = json.loads(input_data)
    ds = input_data['df']
    target_var = input_data['target']
    date_var = input_data['date']
    periodicity = input_data['periodicity']
    n = input_data["range"]
    n = n.strip()
    if n == '':
        n = '1'
    df = []
    for row in ds.split('\n'):
        subl = []
        for cell in row.split(','):
            subl.append(cell)
        df.append(subl)
    print(df[0])
    df = pd.DataFrame(df, columns=df[0])
    df.drop(index=0, inplace=True)
    df[date_var] = pd.to_datetime(df[date_var])
    df.set_index(date_var, inplace=True)
    print(df.dtypes, df.head())

    EDA = pandas_profiling.ProfileReport(df).to_html()

    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    print("df length before astype:", len(df))
    df[target_var] = df[target_var].astype('int64')
    print("df length after astype:", len(df))

    print(df.dtypes)

    forecast = 0
    if periodicity == 'Days':
        forecast = int(n) * 1
    elif periodicity == 'Weeks':
        forecast = int(n) * 7
    elif periodicity == 'Months':
        forecast = int(n) * 30
    elif periodicity == 'Years':
        forecast = int(n) * 365

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
    if len(df.columns) == 1:
        model = model.import_template('uni_var.csv', method='only')
        print('univar init')
    elif len(df.columns) > 1:
        model = model.import_template('multi_var.csv', method='only')
        print('multivar init')

    fitted_model = model.fit(df)
    best_mod = fitted_model.best_model_name
    best_par = fitted_model.best_model_params
    best_trans = fitted_model.best_model_transformation_params

    print(best_mod, best_par, best_trans)
    # print(fitted_model)
    error_rate = str(fitted_model.failure_rate)

    pred = fitted_model.predict(forecast_length=forecast)
    print(pred.forecast.head())
    predictions = pred.forecast
    print("pred length before astype:", len(predictions))
    predictions[target_var] = predictions[target_var].astype('int64')
    print("pred length after astype:", len(predictions))

    for col in predictions.columns:
        predictions.rename(columns={col: col+'_predicted'}, inplace=True)

    back_f = fitted_model.back_forecast(column=target_var).forecast
    print('back forecast:', len(back_f))
    back_f.rename(columns={target_var: target_var +
                           '_back_forecasted'}, inplace=True)
    back_forecast = pd.concat([df[target_var], back_f], axis=1)

    if len(df) == len(back_f):
        rmse = np.sqrt(mean_squared_error(df[target_var], back_f))
    elif len(df) < len(back_f):
        rmse = np.sqrt(mean_squared_error(df[target_var], back_f[:(len(df))]))
    else:
        rmse = np.sqrt(mean_squared_error(
            df[target_var][:(len(back_f))], back_f))

    # print("\n" ,predictions)

    full = pd.concat([df, predictions], axis=1)
    print(full.tail())

    path = 'C:\\Angular, Flask\\Angular\\digiverz\\Outputs'
    file_path = 'C:\\Users\\lKK97\\OneDrive\\Digiverz Outputs'
    dir = str(datetime.now())
    dir = dir.replace(':', '-')
    out_dir = path + '\\' + dir
    os.mkdir(out_dir)

    def plot(ds, name):
        ds.plot(figsize=(20, 5), legend=True)
        plt.savefig(out_dir+name)
    
    plot(full, '\\train&pred')
    plot(back_forecast, '\\back_forecast')
    target_df = pd.DataFrame(predictions[target_var+'_predicted'])
    plot(target_df, '\\predictions')

    img_data = {}

    with open(out_dir+'\\predictions.png', mode='rb') as file:
        pred_img = file.read()
        img_data['pred'] = base64.b64encode(pred_img).decode('utf-8')
    with open(out_dir+'\\train&pred.png', mode='rb') as file:
        full_img = file.read()
        img_data['full'] = base64.b64encode(full_img).decode('utf-8')
    with open(out_dir+'\\back_forecast.png', mode='rb') as file:
        bf_img = file.read()
        img_data['back_forecast'] = base64.b64encode(bf_img).decode('utf-8')

    # if img_data['pred'] == pred_img_mongo and img_data['full'] == full_img_mongo and img_data['back_forecast'] == backf_img_mongo:
    #     print("--------------------B64's match-------------")
    # else:
    #     print("-------------------B64's dont match------------------")

    predictions.index = predictions.index.map(str)
    full.index = full.index.map(str)
    predictions.reset_index(inplace=True)
    full.reset_index(inplace=True)
    full.rename(columns={'index': date_var}, inplace=True)
    predictions.rename(columns={'index': date_var}, inplace=True)
    predictions_json = predictions.to_json()
    full_json = full.to_json()

    pred_head = [i for i in predictions.columns]
    full_head = [i for i in full.columns]

    print(pred_head, full_head)

    forecast_data['pred_json'] = predictions_json
    forecast_data['full_json'] = full_json
    forecast_data['img_data'] = img_data
    forecast_data['best_mod'] = best_mod
    forecast_data['best_par'] = best_par
    forecast_data['best_trans'] = best_trans
    forecast_data['error_rate'] = error_rate
    forecast_data['EDA'] = EDA
    forecast_data['pred_head'] = pred_head
    forecast_data['full_head'] = full_head
    forecast_data['rmse'] = rmse
    forecast_data['message'] = 'token present'

    return jsonify(forecast_data), 200, {'Content-Type': 'application/json'}

if __name__ == "__main__":
    app.run(debug=True)