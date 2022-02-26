from datetime import date
import email
from functools import wraps
from http import client
from flask import Flask, request, session, jsonify
from flask_cors import CORS
from importlib_metadata import method_cache
import pymongo
import bcrypt
import jwt
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='*')
# add cors headers

ROLES = [
    'ADMIN',
    'DOCTOR',
    'PATIENT',
]

app.secret_key = "\x81\x05\xdc\xf0\xe7{Ba\xb8!\x85\x08\xa5\x1b\xe9\xf3\x0c\xf2)\x82\xdd\xd0\xa5A"

client = pymongo.MongoClient("mongodb://harsha:3492%40ubuntu@localhost:27017/")

# client = pymongo.MongoClient( "mongodb+srv://harsha:harsha@cluster0.pb6ox.mongodb.net/dfs?retryWrites=true&w=majority")

# client = pymongo.MongoClient("mongodb://dfs:dfs@mongodb:27017/")

# use MONGODB_CONNSTRING
# client = pymongo.MongoClient(os.environ['MONGODB_CONNSTRING'])

try:
    db = client.dfs
except:
    print("Error: Could not connect to MongoDB")

print("Connected to MongoDB")

users = db.users


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'status': 'fail', 'message': 'no such resource'}), 404


def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        return payload, 200
    except jwt.ExpiredSignatureError:
        return "Signature expired. Please log in again.", 401
    except jwt.InvalidTokenError or jwt.InvalidSignatureError or jwt.DecodeError:
        return "Invalid token. Please log in again.", 401


def encode_jwt_token(user_id):
    import datetime
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=15),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id,
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


@app.route('/', methods=['GET', 'POST'])
def ret():
    # return provided data
    if request.method == 'POST':
        return {'status': 'success', 'message': 'hi!', 'data': request.form}, 200
    return jsonify({'status': 'success', 'message': 'hi!'}), 200


@app.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    print("data: ", data)
    username = data['username']
    password = data['password']
    try:
        user = users.find_one({'username': username})

        if user:
            # check if password is correct
            if bcrypt.checkpw(password.encode('utf-8'), user['password']):
                auth_token = encode_jwt_token(str(user['_id']))
                if auth_token[1] == 200:
                    return {'status': 'success', 'message': 'Welcome {}!'.format(user['username']), 'token': str(auth_token[0].decode('utf-8')), 'user': {'username': user['username'], 'role': user['role']}}, 200
                return {'status': 'fail', 'message': auth_token}, 401
            else:
                return {'status': 'fail', 'message': 'Incorrect password'}, 401
        else:
            return {'message': 'User not found'}, 404
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500


@app.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    print("data: ", data)
    username = data['username']
    password = data['password']
    email = data['email']
    role = data['role']
    # check role
    #

    # check if user already exists
    user = users.find_one({'username': username})
    if user:
        return {'status': 'fail', 'message': 'User already exists'}, 409
    email_user = users.find_one({'email': email})
    if email_user:
        return {'status': 'fail', 'message': 'Email already exists'}, 409
    if role not in ROLES:
        return {'status': 'fail', 'message': 'Invalid role'}, 409
    hashed_passwd = bcrypt.hashpw(
        password.encode('utf-8'), bcrypt.gensalt())
    try:
        user_input = {
            'username': username,
            'password': hashed_passwd,
            'email': email,
            'role': role,
        }
        users.insert_one(user_input)
        if users.find_one({'username': username}):
            return {'status': 'success', 'message': 'User registered successfully'}, 200
        return {'status': 'fail', 'message': 'User not registered'}, 500
    except:
        return {'status': 'fail', 'message': 'User not registered'}, 500
    return {'status': 'fail', 'message': 'User not registered'}, 500


@app.route('/logout')
def logout():
    # remove session variable
    # session.pop('username', None)
    # session.pop('email', None)
    return jsonify({'message': 'Success'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)
