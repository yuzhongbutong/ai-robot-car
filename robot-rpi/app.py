# !/usr/bin/python
# coding:utf-8

from wsgiref.simple_server import make_server
from os import getenv
import subprocess
import crypt
from hmac import compare_digest as compare_hash
from datetime import timedelta
from flask import Flask, send_from_directory, render_template, request, session, redirect
from dotenv import load_dotenv
from src.config import settings

load_dotenv()
app = Flask(__name__)
app.secret_key = 'Joey'
app.config.from_object(settings)

@app.route('/lib/<path:filename>')
def get_lib(filename):
    return send_from_directory(app.root_path + settings.STATIC_LIB, filename)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/')
def index():
    if session.get('username'):
        return render_template('index.html', title='test-title')
    else:
        return redirect('/login')

@app.route('/auth', methods=['POST'])
def auth():
    username = request.form['username']
    cleartext = request.form['password']
    result = run_command('sudo cat /etc/shadow | grep -w ' + username)
    if result:
        cryptedpasswd = result.split(':')[1]
        is_correct = compare_hash(crypt.crypt(cleartext, cryptedpasswd), cryptedpasswd)
        if is_correct:
            session['username'] = username
            app.permanent_session_lifetime = timedelta(minutes=30)
            return redirect('/')
    return render_template('login.html', error={'status': 401, 'message': 'Authorization failure!'})

def run_command(command):
    chunk = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    error = str(chunk.stderr.read(), encoding='utf-8')
    if error:
        return None
    else:
        result = str(chunk.stdout.read(), encoding='utf-8')
        return result

if __name__ == '__main__':
    mode = getenv('ENV_MODE')
    if mode == 'watson':
        server = make_server('0.0.0.0', 5000, app)
        server.serve_forever()
    else:
        app.run(debug=settings.DEBUG)
