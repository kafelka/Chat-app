from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect('chat.db')


def validate_user(user, pwd):
    return jsonify({'valid': True})


@app.route('/login', methods=['POST'])
def login():
    return validate_user(request.form['username'], request.form['password'])


@app.route('/channels')
def get_channels():
    c = conn.cursor()
    channels = [row[0] for row in c.execute('SELECT channel FROM channels')]

    return jsonify({'channels': channels})


@app.route('/channels/<user>')
def get_channel_list(user):
    c = conn.cursor()
    channels = [row[0] for row in c.execute('SELECT channel FROM channel_user_rel WHERE user_login=? ', (user, ))]
    if not channels:
        channels = ['General']

    return jsonify({'channels': channels})


@app.route('/users/<channel>',  methods=['GET', 'PUT', 'DELETE'])
def get_users(channel):
    if request.method == 'GET':
        c = conn.cursor()
        users = [row[0] for row in c.execute('SELECT user_login FROM channel_user_rel WHERE channel=? ', (channel, ))]

        return jsonify({'users': users})
    pass


@app.route('/messages/<channel>')
def get_last_10_messages(channel):
    c = conn.cursor()
    msg = [
        {'user': row[0], 'timestamp': row[1], 'message': row[2]} for row in c.execute(
            'SELECT user_login, ts, message FROM messages WHERE channel=? ORDER BY ts DESC limit 10 ',
            (channel, ))]

    msg.reverse()
    return jsonify(msg)


@app.route('/messages/<channel>/<int:timestamp>')
def get_messages_since(channel, timestamp):
    c = conn.cursor()
    msg = [
        {'user': row[0], 'timestamp': row[1], 'message': row[2]} for row in c.execute(
            'SELECT user_login, ts, message FROM messages WHERE channel=? AND ts >= ? ORDER BY ts',
            (channel, timestamp, ))]

    return jsonify(msg)


@app.route('/send/<channel>', methods=['POST'])
def send_message(channel):
    content = request.get_json(silent=True)
    c = conn.cursor()
    c.execute(
        'INSERT INTO messages (channel, user_login, ts, message) VALUES (?, ?, ?, ?)',
        (channel, content['user'], int(datetime.utcnow().timestamp()), content['message'])
    )
    return ''


if __name__ == "__main__":
    app.run(host='127.0.0.1')
