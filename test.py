from flask import Flask, jsonify, g, request, make_response, session
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/SalesForecast"
app.secret_key= 'f5734a02a045495cb47483f3a88594f2'
db = PyMongo(app).db

def token_required(func):
    # decorator factory which invoks update_wrapper() method and passes decorated function as an argument
    @wraps(func)
    def decorated(*args, **kwargs):
        token = getattr(g, 'token')
        print(token)
        if not token:
            return jsonify({'Alert!': 'Token is missing!'}), 401

        try:

            data = jwt.decode(token, app.secret_key)
        # You can use the JWT errors in exception
        # except jwt.InvalidTokenError:
        #     return 'Invalid token. Please log in again.'
        except:
            return jsonify({'Message': 'Invalid token'}), 403
        return func(*args, **kwargs)
    return decorated


@app.route('/')
def home():
    if not session.get('logged_in'):
        return '''<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
</head>

<body>
  <form action="/login" method="POST">
    <input type="username" name="username" placeholder="Username"> <br><br>
    <input type="password" name="password" placeholder="Password"> <br><br>
    <input type="submit" value="Login">
  </form>
</body>

</html>'''
    else:
        return 'logged in currently'

# Just to show you that a public route is available for everyone


@app.route('/public')
def public():
    return 'For Public'

# auth only if you copy your token and paste it after /auth?query=XXXXXYour TokenXXXXX
# Hit enter and you will get the message below.


@app.route('/auth')
def auth():
    return jsonify(jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiTm90QW5OcGM2OSIsImV4cGlyYXRpb24iOiIyMDI0LTAxLTAzIDE1OjMxOjM3LjYzOTc2NCJ9.xbVJ5zIzJ3mKkPKzNeVACJixnptMeCnFzogOmIUcbNY"
                              ,app.secret_key,algorithms=['HS256']))

# Login page


@app.route('/login', methods=['POST'])
def login():
    if request.form['username'] and request.form['password'] == '123':
        session['logged_in'] = True

        token = jwt.encode({
            'user': request.form['username'],
            # don't foget to wrap it in str function, otherwise it won't work [ i struggled with this one! ]
            'expiration': str(datetime.utcnow() + timedelta(seconds=60))
        },
            app.secret_key, algorithm="HS256")
        
        return jsonify({'token': token})
    else:
        return make_response('Unable to verify', 403, {'WWW-Authenticate': 'Basic realm: "Authentication Failed "'})


# Homework: You can try to create a logout page


@app.route("/home")
def home_page():
    test = db.Users.find_one({"username":"kishore1"})
    print(test)
    return f"<p> {test} </p>"

@app.route("/add")
def add():
    db.Users.insert_one({"username":"kishore1","password":"1234","email":"abcd@gmail.com"})
    return "<p> user added </p>"

@app.route("/find")
def find():
    test = db.Users.find({})
    print (test)

@app.route("/logout")
def logout():
    session['logged_in'] = False
    return jsonify('logged out!')

if __name__ == "__main__":
    app.run(debug=True)