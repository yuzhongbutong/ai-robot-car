# !/usr/bin/python
# coding:utf-8

from wsgiref.simple_server import make_server
from os import getenv
from datetime import timedelta
from flask import Flask, render_template, request, session, redirect, jsonify
from dotenv import load_dotenv
from flask_httpauth import HTTPTokenAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
import sqlite3
from contextlib import closing
from src.config import settings as config
from src.utils import message
from src.service.login_service import LoginService
from src.service.db_service import DatabaseService

load_dotenv()
app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='')
app.secret_key = config.SECRET_KEY
app.config.from_object(config)
auth = HTTPTokenAuth(scheme=config.TOKEN_SCHEME)


# @app.before_request
# def before_request():
#     app.db = connect_db()
 
 
# @app.teardown_request
# def after_request(response):
#     app.db.close()
#     return response
 
 
@app.before_first_request
def before_first_request():
    with closing(connect_db()) as db:
        cursor = db.cursor()
        db_service = DatabaseService()
        exist = db_service.is_exist_table(cursor)
        if not(exist):
            with app.open_resource(config.DB_INIT_SCRIPT) as file:
                cursor.executescript(file.read().decode())
            db.commit()
        cursor.close()


@auth.verify_token
def verify_token(token):
    serializer = Serializer(config.SECRET_KEY)
    try:
        serializer.loads(token)
    except (SignatureExpired, BadSignature):
        return False

    return True


@auth.error_handler
def error_handler(code):
    return jsonify({'status': 401, 'message': message.MSG_TOKEN_AUTH_FAILURE}), code


@app.route('/api/login', methods=['POST'])
def login():
    body = request.json
    username = body['username']
    cleartext = body['password']
    login_service = LoginService()
    is_correct = login_service.verify_auth(username, cleartext)
    if is_correct:
        token = login_service.generate_token(username)
        session['username'] = username
        app.permanent_session_lifetime = timedelta(minutes=30)
        return jsonify({'status': 200, 'message': message.MSG_LOGIN_SUCCESSFUL,
                        'data': {'user': username, 'token': token}})
    return jsonify({'status': 401, 'message': message.MSG_LOGIN_FAILURE}), 401


@app.route('/api/query-settings', methods=['POST'])
@auth.login_required
def read_settings():
    with closing(connect_db()) as db:
        db_service = DatabaseService()
        result = db_service.query_settings(db)
    return jsonify(result)


@app.route('/api/save-settings', methods=['POST'])
@auth.login_required
def write_settings():
    with closing(connect_db()) as db:
        db_service = DatabaseService()
        if db_service.write_config(db, request.json):
            return jsonify({'status': 200, 'message': message.MSG_SAVE_SETTINGS_SUCCESSFUL})
    return jsonify({'status': 500, 'message': message.MSG_SAVE_SETTINGS_FAILED}), 500


@app.route('/')
def index():
    if session.get('username'):
        return render_template('index.html')
    else:
        return redirect('/login')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html')


def connect_db():
    return sqlite3.connect(config.DB_NAME)


if __name__ == '__main__':
    mode = getenv('ENV_MODE')
    print('----------Run in main[' + mode + ']----------')
    if mode == 'watson':
        server = make_server('0.0.0.0', 5000, app)
        server.serve_forever()
    else:
        app.run(debug=config.DEBUG, host='0.0.0.0', port=5000)
