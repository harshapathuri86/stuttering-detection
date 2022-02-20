from datetime import date
from functools import wraps
from http import client
from os import stat
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS, cross_origin
import pymongo
import bcrypt
import email
import json
import smtplib
import jwt

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = "\x81\x05\xdc\xf0\xe7{Ba\xb8!\x85\x08\xa5\x1b\xe9\xf3\x0c\xf2)\x82\xdd\xd0\xa5A"

client = pymongo.MongoClient("mongodb://harsha:3492%40ubuntu@localhost:27017/")

db = client.dfs

print("Connected to MongoDB")

users = db.users


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@staticmethod
def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        return payload, 200
    except jwt.ExpiredSignatureError:
        return "Signature expired. Please log in again.", 401
    except jwt.InvalidTokenError or jwt.InvalidSignatureError or jwt.DecodeError:
        return "Invalid token. Please log in again.", 401


@staticmethod
def encode_jwt_token(user_id):
    import datetime
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=15),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(payload, app.secret_key, algorithm='HS256'), 200
    except jwt.ExpiredSignatureError:
        return "Signature expired. Please log in again.", 401
    except (jwt.InvalidTokenError or jwt.InvalidSignatureError or jwt.DecodeError) as e:
        return "Invalid token. Please log in again.", 401


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'status': 'fail', 'message': 'Token is missing!'}), 401
        try:
            payload = decode_jwt_token(token)
            if payload[1] == 200:
                return f(*args, **kwargs)
            return jsonify({'status': 'fail', 'message': payload[0]}), 401
        except Exception as e:
            return jsonify({'status': 'fail', 'message': 'Token is invalid!'}), 401
    return decorated


@app.route('/users/signup', methods=['POST'])
def register():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    user_found = users.find_one({'username': username})
    if user_found:
        return jsonify({'status': 'fail', 'message': 'Username already exists'}), 409
    email_found = users.find_one({'email': request.form['email']})
    if email_found:
        return jsonify({'status': 'fail', 'message': 'Email already exists'}), 401
    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'), bcrypt.gensalt())
    # insert user into database
    try:
        user_input = {'username': username,
                      'password': hashed_password, 'email': request.form['email']}
        users.insert_one(user_input)
        # get user id
        user_id = users.find_one({'username': username})['_id']
        # encode token
        token = encode_jwt_token(user_id)
        if token[1] == 200:
            return jsonify({'status': 'success', 'message': 'User registered successfully', 'token': token[0].decode('utf-8')}), 200
        return jsonify({'status': 'fail', 'message': token}), 401
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/users/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    # check if user exists in database
    try:
        user = users.find_one({'username': username})

        if user:
            # check if password is correct
            if bcrypt.checkpw(password.encode('utf-8'), user['password']):
                auth_token = encode_jwt_token(user['_id'])
                if auth_token[1] == 200:
                    return jsonify({'status': 'success', 'message': 'User logged in successfully', 'token': auth_token[0].decode('utf-8')}), 200
                return jsonify({'status': 'fail', 'message': auth_token}), 401
            else:
                return jsonify({'status': 'fail', 'message': 'Incorrect password'}), 401
        else:
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/dummy', methods=['GET'])
@token_required
def dummy():
    return jsonify({'status': 'success', 'message': 'hi! token verification is successful'}), 200


@app.route('/logout')
def logout():
    # remove session variable
    session.pop('username', None)
    session.pop('email', None)
    return jsonify({'message': 'Success'})


if __name__ == '__main__':
    app.run(debug=True)
