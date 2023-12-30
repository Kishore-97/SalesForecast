from flask import Flask, render_template
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/SalesForecast"
db = PyMongo(app).db

@app.route("/")
def home_page():
    test = db.Users.find_one({"username":"kishore1"})
    print(test)
    return "<p> Hello world </p>"

@app.route("/add")
def add():
    db.Users.insert_one({"username":"kishore1","password":"1234","email":"abcd@gmail.com"})
    return "<p> user added </p>"

@app.route("/find")
def find():
    test = db.Users.find({})
    print (test)

if __name__ == "__main__":
    app.run(debug=True)