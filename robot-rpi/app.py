# !/usr/bin/python
# coding:utf-8
# @Author : Joey

import logging
import sys
from flask_socketio import SocketIO
from wsgiref.simple_server import make_server
from os import getenv
from datetime import timedelta
from flask import Flask, current_app, render_template, request, session, redirect, jsonify
from dotenv import load_dotenv
from flask_httpauth import HTTPTokenAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
import sqlite3
from contextlib import closing
from src.config import settings as config
from src.utils import message
from src.service.login_service import LoginService
from src.service.settings_service import DatabaseService


logging.basicConfig(stream=sys.stdout, level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__, template_folder='templates',
            static_folder='static', static_url_path='')
app.secret_key = config.SECRET_KEY
app.config.from_object(config)
auth = HTTPTokenAuth(scheme=config.TOKEN_SCHEME)
socketio = SocketIO(app)

with app.app_context():
    current_app.extensions['socketio'] = socketio


@app.before_first_request
def before_first_request():
    with closing(connect_db()) as db:
        cursor = db.cursor()
        settings_service = DatabaseService()
        exist = settings_service.is_exist_table(cursor)
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
        settings_service = DatabaseService()
        result = settings_service.query_settings(db)
    return jsonify(result)


@app.route('/api/save-settings', methods=['POST'])
@auth.login_required
def write_settings():
    with closing(connect_db()) as db:
        settings_service = DatabaseService()
        if settings_service.write_settings(db, request.json):
            return jsonify({'status': 200, 'message': message.MSG_SAVE_SETTINGS_SUCCESSFUL})
        else:
            return jsonify({'status': 500, 'message': message.MSG_SAVE_SETTINGS_FAILED})


@app.route('/api/connect-settings', methods=['POST'])
@auth.login_required
def connect_settings():
    settings_service = DatabaseService()
    client_type = settings_service.connect_settings(request.json)
    if client_type is None:
        return jsonify({'status': 500, 'message': message.MSG_TEST_SETTINGS_FAILED})
    else:
        return jsonify({'status': 200, 'client_type': client_type, 'message': message.MSG_TEST_SETTINGS_SUCCESSFUL})


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


@socketio.on('connect', namespace=config.SOCKET_NAMESPACE)
def event_connect():
    token = request.args.get('token')
    if token and token.startswith(config.TOKEN_SCHEME + ' '):
        token = token.split(config.TOKEN_SCHEME + ' ')[1]
    if not verify_token(token):
        return False


if __name__ == '__main__':
    load_dotenv()
    env = getenv('FLASK_ENV', 'production')
    logging.debug('----------Run in main[' + env + ']----------')
    if env == 'production':
        server = make_server('0.0.0.0', 5000, app)
        server.serve_forever()
    else:
        app.run(host='0.0.0.0', port=5000)
