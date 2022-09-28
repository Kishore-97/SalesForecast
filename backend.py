import json
from flask import Flask,request,render_template,jsonify
from flask_cors import CORS
app = Flask(__name__)

CORS(app)

user_list = ['ned']
pass_list = ['head']


@app.route("/",methods=['GET','POST'])
def hello_world():
    data = request.data.decode()
    data = json.loads(data)
    username = data['username']
    password = data['password']
    print(username,password)
    n = 0

    for i in range(len(user_list)):
        if(username == user_list[i]):
            if(password == pass_list[i]):
                return jsonify("authenticated")
            else:
                return jsonify("incorrect password")
    return jsonify("user not found")

if __name__ == "main":
    app.run(debug=True)