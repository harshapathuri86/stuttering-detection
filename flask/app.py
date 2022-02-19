from http import client
from msilib import schema
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS, cross_origin
import pymongo
import bcrypt
import email
import json
import smtplib

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = 'testing'


client = pymongo.MongoClient("mongodb://harsha:3492%40ubuntu@localhost:27017/")

db = client.dfs

print("Connected to MongoDB")

users = db.users

# 404


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/register', methods=['POST'])
def register():

    username = request.form['username']
    email = request.form['email']
    password_1 = request.form['password_1']
    password_2 = request.form['password_2']

    user_found = users.find_one({'username': username})
    if user_found:
        return jsonify({'message': 'Username already exists'})
    email_found = users.find_one({'email': request.form['email']})
    if email_found:
        return jsonify({'message': 'Email already exists'})
    if password_1 != password_2:
        return jsonify({'message': 'Passwords do not match'})
    if len(password_1) < 8:
        return jsonify({'message': 'Password must be atleast 8 characters long'})
    if len(username) < 3:
        return jsonify({'message': 'Username must be atleast 3 characters long'})
    # hash password
    hashed_password = bcrypt.hashpw(
        password_1.encode('utf-8'), bcrypt.gensalt())
    # insert user into database
    user_input = {'username': username,
                  'password': hashed_password, 'email': request.form['email']}
    users.insert_one(user_input)

    # send email
    # msg = email.message.EmailMessage()
    # msg['Subject'] = 'Welcome to DFS'
    # msg['From'] = ' '
    # msg['To'] = request.form['email']
    # msg.set_content('Welcome to DFS!' + '\n' +
    #                 'Your username is: ' + username)
    # with smtplib.SMTP('smtp.gmail.com', 587) as s:
    #     s.ehlo()
    #     s.starttls()
    #     s.ehlo()
    #     s.login(' ', ' ')  # replace with your email and password
    #     s.send_message(msg)

    return jsonify({'message': 'Success'})


@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    # check if user exists in database
    user = users.find_one({'username': username})

    if user:
        # check if password is correct
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # set session variable
            session['username'] = username
            return jsonify({'message': 'Success', 'username': username, 'email': user['email']})
        else:
            return jsonify({'message': 'Incorrect password'})
    else:
        return jsonify({'message': 'User not found'})


@app.route('/logout')
def logout():
    # remove session variable
    session.pop('username', None)
    session.pop('email', None)
    return jsonify({'message': 'Success'})


if __name__ == '__main__':
    app.run(debug=True)
