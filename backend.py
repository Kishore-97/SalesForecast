from flask import Flask, request, jsonify, g
from flask_pymongo import PyMongo
import numpy as np
from sklearn.metrics import mean_squared_error
import pandas_profiling
from autots import AutoTS
import pandas as pd
from flask_cors import CORS
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

app = Flask(__name__)

CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/SalesForecast"
app.secret_key = "f5734a02a045495cb47483f3a88594f2"
db = PyMongo(app).db

# predictions_json, full_json, img_data, best_mod, best_par, best_trans, error_rate, EDA, pred_head, full_head, rmse

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):

        # if request.method == 'OPTIONS':
        #     # Respond to the preflight request
        #     return '', 200

        token = request.headers.get('Authorization')
        g.normaltoken = token
        print("-----------from wrapper before trying jwt.decode:", token)
        if not token:
            return jsonify('token is missing')
        else:
            try:
                decoded_token = jwt.decode(
                    token, app.secret_key, algorithms=['HS256'])

                g.token = decoded_token

            except jwt.InvalidSignatureError as e:
                print("------------"+str(e)+"--------------")
                return jsonify({"message": "Invalid signature"}), 400, {'Content-Type': 'application/json'}

            except jwt.InvalidAlgorithmError as e:
                print("------------"+str(e)+"--------------")
                return jsonify({"message": "Invalid algorithm"}), 200, {'Content-Type': 'application/json'}

            # except jwt.InvalidTokenError as e:
            #     print("------------"+str(e)+"--------------")
            #     return jsonify({"message": "Invalid token"}), 200, {'Content-Type': 'application/json'}

            except jwt.ExpiredSignatureError as e:
                print("------------"+str(e)+"--------------")
                return jsonify({"message": "Token expired"}), 200, {'Content-Type': 'application/json'}

            except jwt.DecodeError as e:
                print("------------"+str(e)+"--------------")
                return jsonify({"message": "Error decoding token"}), 200, {'Content-Type': 'application/json'}

        return func(*args, **kwargs)
    return decorated

@app.route("/forecast", methods=['GET', 'POST'])
@token_required
def forecast():
    # print(g.normaltoken)
    # return jsonify("predict works")

    email = g.token['email']
    print(email)

    forecast_data = {
        'message': '',
        'pred_json': {},
        'full_json': {},
        'img_data': {},
        'best_mod': '',
        'best_par': '',
        'best_trans': '',
        'error_rate': '',
        'EDA': '',
        'pred_head': [],
        'full_head': [],
        'rmse': ''
    }

    # print(type(request.data))
    input_data = request.data.decode()
    input_data = json.loads(input_data)
    filename = input_data['filename']
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
    
    best_mod,best_par,best_trans,error_rate,predictions,back_forecast,rmse,full = predict(df,forecast,target_var)

    full_img_mongo = plot_for_mongo(full)
    backf_img_mongo = plot_for_mongo(back_forecast)
    target_df = pd.DataFrame(predictions[target_var+'_predicted'])
    pred_img_mongo = plot_for_mongo(target_df)

    mongo_img_data = {
        'pred': pred_img_mongo,
        'full': full_img_mongo,
        'back_forecast': backf_img_mongo
    }

    predictions.index = predictions.index.map(lambda x: x.strftime("%Y-%m-%d"))
    full.index = full.index.map(lambda x: x.strftime("%Y-%m-%d"))
    predictions.reset_index(inplace=True)
    full.reset_index(inplace=True)
    full.rename(columns={'index': date_var}, inplace=True)
    predictions.rename(columns={'index': date_var}, inplace=True)
    predictions_json = predictions.to_json()
    full_json = full.to_json()

    pred_head = [i for i in predictions.columns]
    full_head = [i for i in full.columns]

    print(pred_head, full_head)

    now = datetime.now()
    formatted_now = now.strftime("%Y-%m-%d %H:%M")
    prediction_length = n + " " + periodicity

    db.Forecasts.insert_one({'user': email, 'date and time': formatted_now, 'pred_img': pred_img_mongo, 'full_img': full_img_mongo,
                             'backf_img': backf_img_mongo, 'pred_json': predictions_json, 'full_json': full_json, 'eda': EDA,
                             'best_mod': best_mod, 'best_par': best_par, 'best_trans': best_trans, 'error_rate': error_rate,
                             'rmse': rmse, 'pred_head': pred_head, 'full_head': full_head, 'filename': filename,
                             'prediction_length': prediction_length, 'target': target_var})

    forecast_data['pred_json'] = predictions_json
    forecast_data['full_json'] = full_json
    forecast_data['img_data'] = mongo_img_data
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

def predict(df,forecast,target_var):
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
    # print("pred length before astype:", len(predictions))
    predictions[target_var] = predictions[target_var].astype('int64')
    # print("pred length after astype:", len(predictions))

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
    return (best_mod,best_par,best_trans,error_rate,predictions,back_forecast,rmse,full)

def plot_for_mongo(ds):
    ds.plot(figsize=(20, 5), legend=True)
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    res = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()
    return res

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    data = request.data.decode()
    data = json.loads(data)
    username = data['username']
    password = data['password']
    email = data['email']

    if (db.Users.find_one({"email": email}) is not None):
        return jsonify("User Already exists")

    else:
        db.Users.insert_one(
            {"username": username, "password": password, "email": email})
        return jsonify("User Successfully registered")


@app.route("/login", methods=['GET', 'POST'])
def login():
    data = request.data.decode()
    print("-------------------"+str(data))
    data = json.loads(data)
    email = data['email']
    password = data['password']
    print(email, password)

    user = db.Users.find_one({"email": email})

    if (user is not None):
        if (user['password'] == password):

            token = jwt.encode({
                'email': email,
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, app.secret_key, algorithm="HS256")
            username = user['username']
            return jsonify({"message": "authenticated", "Authorization": token,'username':username})

        else:
            return jsonify("incorrect password")
    else:
        return jsonify("User not found")

@app.route("/decode", methods=['GET', 'POST'])
@token_required
def decode():
    print("---------From decode : g----:", g.normaltoken)
    return jsonify({"message":"token valid"})

@app.route("/history", methods=['GET'])
@token_required
def history():
    email = g.token['email']
    records = db.Forecasts.find({'user': email}, {
                                '_id': False, 'date and time': True, 'target': True, 'filename': True, 'prediction_length': True})
    records_json_str = json.dumps(list(records), default=str)
    records_json = json.loads(records_json_str)

    return jsonify({"message": "token present", "records": records_json})


@app.route("/record", methods=['POST'])
@token_required
def getrecord():
    input_data = request.data.decode()
    input_data = json.loads(input_data)
    date_and_time = input_data['date and time']
    email = g.token['email']
    record = db.Forecasts.find_one(
        {'user': email, 'date and time': date_and_time}, 
        {'_id': False, 'user': False, 'date and time': False, 
         'filename': False, 'target': False,'prediction_length':False})
    record_json_str = json.dumps(record, default=str)
    record_json = json.loads(record_json_str)
    img_data = {
        'pred': record_json['pred_img'],
        'full': record_json['full_img'],
        'back_forecast': record_json['backf_img']
    }
    record_json['img_data'] = img_data
    record_json['message'] = 'token present'
    record_json['EDA'] = record_json['eda']
    record_json.pop('pred_img')
    record_json.pop('full_img')
    record_json.pop('backf_img')
    record_json.pop('eda')
    return jsonify(record_json)

@app.route("/profile",methods = ['GET','POST'])
@token_required
def profile():
    email = g.token['email']
    if request.method == 'GET':
        profile = db.Users.find_one({'email':email},{'_id':False})
        profile_json_str = json.dumps(profile, default=str)
        profile_json = json.loads(profile_json_str)
        return jsonify({"message": "token present", "profile": profile_json})
    
    elif request.method == 'POST':
        data = request.data.decode()
        data = json.loads(data)
        db.Users.update_one({"email":email},{ "$set" : {"username":data['username'],"password":data['password']}})
        return jsonify({'message':'profile updated successfully'})

if __name__ == "__main__":
    app.run(debug=True)
