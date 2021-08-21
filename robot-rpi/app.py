# !/usr/bin/python
# coding:utf-8

from wsgiref.simple_server import make_server
from os import getenv
from datetime import timedelta
from flask import Flask, render_template, request, session, redirect, jsonify, send_from_directory
from dotenv import load_dotenv
from flask_httpauth import HTTPTokenAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from src.config import settings
from src.utils.utils import read_config, write_config
from src.utils import message, constant
from src.service.login_service import LoginService

load_dotenv()
app = Flask(__name__, template_folder='templates', static_folder='templates/static')
app.secret_key = settings.SECRET_KEY
app.config.from_object(settings)
auth = HTTPTokenAuth(scheme=settings.TOKEN_SCHEME)


@auth.verify_token
def verify_token(token):
    serializer = Serializer(settings.SECRET_KEY)
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
    mqtt_local = read_config(constant.CONFIG_MQTT_LOCAL)
    mqtt_watson = read_config(constant.CONFIG_MQTT_WATSON)
    return jsonify({'data': {'mqtt_local': mqtt_local, 'mqtt_watson': mqtt_watson}})


@app.route('/api/save-settings', methods=['POST'])
@auth.login_required
def write_settings():
    if write_config(request.json):
        return jsonify({'status': 200, 'message': message.MSG_SAVE_SETTINGS_SUCCESSFUL})
    return jsonify({'status': 500, 'message': message.MSG_SAVE_SETTINGS_FAILED}), 500


###########################
@app.route('/lib/<path:filename>')
def get_lib(filename):
    return send_from_directory(app.root_path + '/node_modules', filename)


@app.route('/login')
def login2():
    return render_template('login.html')


@app.route('/')
def index():
    if session.get('username'):
        return render_template('index.html', title='test-title')
    else:
        return redirect('/login')


@app.route('/auth', methods=['POST'])
def auth2():
    username = request.form['username']
    cleartext = request.form['password']
    # result = run_command('sudo cat /etc/shadow | grep -w ' + username)
    # if result:
    #     cryptedpasswd = result.split(':')[1]
    #     is_correct = compare_hash(crypt.crypt(
    #         cleartext, cryptedpasswd), cryptedpasswd)
    #     if is_correct:
    session['username'] = username
    app.permanent_session_lifetime = timedelta(minutes=30)
    return redirect('/')
    # return render_template('login.html', error={'status': 401, 'message': 'Authorization failure!'})


if __name__ == '__main__':
    mode = getenv('ENV_MODE')
    if mode == 'watson':
        server = make_server('0.0.0.0', 5000, app)
        server.serve_forever()
    else:
        app.run(debug=settings.DEBUG, host='0.0.0.0', port=5000)
