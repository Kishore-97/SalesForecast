import json
from flask import Flask,request,render_template,jsonify
from flask_cors import CORS
import pandas as pd

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
    trial_data = request.data
    trial_data = json.loads(trial_data)
    df = pd.DataFrame(trial_data)
    print(df.head())
    if len(trial_data)==2:
        return jsonify("empty")
    else :
        return jsonify(trial_data)

if __name__ == "main":
    app.run(debug=True)