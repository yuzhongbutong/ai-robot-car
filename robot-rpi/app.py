# !/usr/bin/python
# coding:utf-8

from wsgiref.simple_server import make_server
from os import getenv
import crypt
from hmac import compare_digest as compare_hash
from datetime import timedelta
from flask import Flask, render_template, request, session, redirect, jsonify
from dotenv import load_dotenv
from flask_httpauth import HTTPTokenAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from src.config import settings
from src.utils.utils import run_command
from src.utils import message

load_dotenv()
app = Flask(__name__)
app.secret_key = settings.SECRET_KEY
app.config.from_object(settings)
auth = HTTPTokenAuth(scheme=settings.TOKEN_SCHEME)


def generate_token(user_id):
    serializer = Serializer(settings.SECRET_KEY,
                            expires_in=settings.TOKEN_EXPIRE)
    token = serializer.dumps({'id': user_id}).decode('ascii')
    return settings.TOKEN_SCHEME + ' ' + token


def verify_auth(username, cleartext):
    result = run_command('sudo cat /etc/shadow | grep -w ' + username)
    if result:
        cryptedpasswd = result.split(':')[1]
        is_correct = compare_hash(crypt.crypt(
            cleartext, cryptedpasswd), cryptedpasswd)
        if is_correct:
            return True

    return False


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
    is_correct = verify_auth(username, cleartext)
    if is_correct:
        token = generate_token(username)
        session['username'] = username
        app.permanent_session_lifetime = timedelta(minutes=30)
        return jsonify({'status': 200, 'message': message.MSG_LOGIN_SUCCESSFUL,
                        'data': {'user': username, 'token': token}})
    return jsonify({'status': 401, 'message': message.MSG_LOGIN_FAILURE}), 401


# @app.route('/lib/<path:filename>')
# def get_lib(filename):
#     return send_from_directory(app.root_path + settings.STATIC_LIB, filename)


@app.route('/login2')
@auth.login_required
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
    result = run_command('sudo cat /etc/shadow | grep -w ' + username)
    if result:
        cryptedpasswd = result.split(':')[1]
        is_correct = compare_hash(crypt.crypt(
            cleartext, cryptedpasswd), cryptedpasswd)
        if is_correct:
            session['username'] = username
            app.permanent_session_lifetime = timedelta(minutes=30)
            return redirect('/')
    return render_template('login.html', error={'status': 401, 'message': 'Authorization failure!'})


if __name__ == '__main__':
    mode = getenv('ENV_MODE')
    if mode == 'watson':
        server = make_server('0.0.0.0', 5000, app)
        server.serve_forever()
    else:
        app.run(debug=settings.DEBUG, host='0.0.0.0', port=5000)
