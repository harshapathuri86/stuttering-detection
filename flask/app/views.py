from flask import Flask, request, jsonify
from app import app
from flask_cors import CORS
import bcrypt
import pymongo
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_current_user, current_user, get_jwt, create_refresh_token
from pymongo import MongoClient
from datetime import datetime, timedelta, timezone
from flask_mail import Mail, Message
from threading import Thread
from bson import json_util
import os

CORS(app, supports_credentials=True, origins='*')
# app.config["MONGO_URI"] = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + \
# os.environ['MONGODB_PASSWORD'] + '@' + \
# os.environ['MONGODB_HOSTNAME'] + ':27017' + \
# '/'+os.environ['MONGODB_DATABASE']

app.config["MONGO_URI"] = 'mongodb://flaskuser:flaskpassword@mongodb:27017'
# app.config["MONGO_URI"] = 'mongodb://flaskuser:flaskpassword@localhost:27017'


app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config['JWT_SECRET_KEY'] = b'u\xefB@2\xc3\xdbU\xa2S T\xbe\xdc\xe2\xa9'
# allow query string jwt token
app.config['JWT_TOKEN_LOCATION'] = ['query_string', 'headers']
jwt = JWTManager(app)

client = pymongo.MongoClient(app.config["MONGO_URI"])

# db = client.get_default_database()
db = client['flaskdb']
users = db.users

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'icecream.app.dev@gmail.com',
    "MAIL_PASSWORD": 'app.dev@gmail',
    # default sender
    "MAIL_DEFAULT_SENDER": 'Dev App <icecream.app.dev@gmail.com>'
}


mail = Mail(app)

SIGNALS = {
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'METHOD_NOT_ALLOWED': 405,
    'NOT_ACCEPTABLE': 406,
    'REQUEST_TIMEOUT': 408,
    'CONFLICT': 409,
    'GONE': 410,
    'OK': 200,
}

USER_TYPES = {
    'SUPER_ADMIN': 0,
    'ADMIN': 1,
    'DOCTOR': 2,
    'PATIENT': 3,
}

# helper functions :-----------------------------------------------------


def send_async_email(app, msg):
    with app.app_context():
        try:
            mail.send(msg)
        except Exception as e:
            print(e)


def send_reset_email(user):
    # create a reset token
    reset_token = create_access_token(
        identity=user, expires_delta=timedelta(minutes=30), fresh=True)
    msg = Message('Password Reset', recipients=[
                  user], body="You can reset your password using this link: http://localhost:3000/resetpassword?jwt=" + reset_token)
    Thread(target=send_async_email, args=(app, msg)).start()
    pass


def send_password_update_email(user):
    msg = Message('Password Update', recipients=[user], body="Your password has been updated",
                  )
    Thread(target=send_async_email, args=(app, msg)).start()
    pass


# routes :---------------------------------------------------------------------------------------------------------

# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format


@jwt.user_identity_loader
def user_identity_lookup(user):
    print("user", user)
    return user

# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    email = jwt_data['sub']
    return db.users.find_one({"email": email})


# ---------------------------------------------------------------------------------------------------------------------

# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@ app.route("/dashboard", methods=['GET'])
@ jwt_required()
def dashboard():
    return jsonify({"message": "Welcome to the dashboard", "user": current_user.get('username')}), SIGNALS['OK']


@ app.route("/register", methods=['POST'])
def register():
    print("register")
    if request.method == 'POST':
        if request.is_json:
            email = request.json['email']
        else:
            email = request.form['email']

    user_exists = db.users.find_one({"email": email})
    print("user_exists", user_exists)
    if user_exists:
        return jsonify({"message": "User already exists"}), SIGNALS['CONFLICT']
    else:
        if request.is_json:
            username = request.json['username']
            password = request.json['password']
            usertype = request.json['usertype']
        else:
            username = request.form['username']
            password = request.form['password']
            usertype = request.form['usertype']
        # encrypt password

        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())
        user_data = {"email": email, "username": username,
                     "password": hashed_password, "usertype": usertype}
        try:
            db.users.insert_one(user_data)
            return jsonify({"message": "User created successfully"}), SIGNALS['OK']
        except Exception as e:
            print("Exception registering new user {}:{}").format(user_data, e)
            return jsonify({"message": "Error creating user"}), SIGNALS['CONFLICT']


@ app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        if request.is_json:
            email = request.json['email']
            password = request.json['password']
        else:
            email = request.form['email']
            password = request.form['password']

    user_exists = db.users.find_one({"email": email})
    if user_exists:
        if bcrypt.checkpw(password.encode('utf-8'), user_exists['password']):
            access_token = create_access_token(
                identity=email, )
            refresh_token = create_refresh_token(
                identity=email)
            response = jsonify({"message": "Login successful",
                                "user": json_util.dumps(user_exists), "access_token": access_token, "refresh_token": refresh_token}), SIGNALS['OK']
            # add user info to the response
            return response
        else:
            return jsonify({"message": "Incorrect password"}), SIGNALS['UNAUTHORIZED']
    else:
        return jsonify({"message": "User does not exist"}), SIGNALS['NOT_FOUND']


@ app.route("/forgotpassword", methods=['POST'])
def forgot_password():
    if request.method == 'POST':
        if request.is_json:
            email = request.json['email']
        else:
            email = request.form['email']
    user_exists = db.users.find_one({"email": email})
    if user_exists:
        send_reset_email(user_exists['email'])
    return jsonify({"message": "Password reset link sent to your email"}), SIGNALS['OK']


@ app.route("/resetpassword", methods=['POST'])
@jwt_required(fresh=True, locations=['query_string'])
def reset_password():
    # get token from query params
    password = request.args.get('password')
    # verify token
    try:
        # email = jwt.decode(token, app.config['SECRET_KEY'])
        # get identity from token using flask_jwt_extended
        email = get_jwt_identity()
    except:
        return jsonify({"message": "Invalid or expired token"}), SIGNALS['UNAUTHORIZED']
    # get user from db
    user_exists = db.users.find_one({"email": email})
    if user_exists:
        # update user password
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())
        # check if previous password matches
        if bcrypt.checkpw(password.encode('utf-8'), user_exists['password']):
            return jsonify({"message": "You cannot use your previous password"}), SIGNALS['CONFLICT']
        db.users.update_one({"email": email}, {
                            "$set": {"password": hashed_password}})
        send_password_update_email(user_exists['email'])
        return jsonify({"message": "Password reset successful"}), SIGNALS['OK']
    else:
        return jsonify({"message": "User does not exist"}), SIGNALS['NOT_FOUND']


@app.route("/logout", methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    return response, SIGNALS['OK']


@app.route("/")
def index():
    return {"message": "Welcome to the Dockerized Flask MongoDB API!"}, SIGNALS['OK']


# if __name__ == "__main__":
#     ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
#     ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
#     app.run(host='0.0.0.0', port=ENVIRONMENT_PORT, debug=ENVIRONMENT_DEBUG)
