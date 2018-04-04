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
        c.execute(
            'INSERT INTO channel_user_rel (channel, user_login) VALUES (?, ?)',
            (channels[0], user,)
        )

    return jsonify({'channels': channels})


@app.route('/users/<channel>',  methods=['GET', 'PUT', 'DELETE'])
def get_users(channel):
    c = conn.cursor()
    if request.method == 'GET':
        users = [row[0] for row in c.execute('SELECT user_login FROM channel_user_rel WHERE channel=? ', (channel, ))]

        return jsonify({'users': users})
    elif request.method == 'PUT':
        content = request.get_json(silent=True)
        c.execute(
            'INSERT INTO channel_user_rel (channel, user_login) VALUES (?, ?)',
            (channel, content['user'])
        )
        conn.commit()
        return ''
    elif request.method == 'DELETE':
        content = request.get_json(silent=True)
        c.execute(
            'DELETE FROM channel_user_rel WHERE channel=? AND user_login=?',
            (channel, content['user'])
        )
        conn.commit()
        return ''


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
        (channel, content['user'], int(datetime.utcnow().timestamp()) + 3600, content['message'])
    )
    conn.commit()
    return ''


if __name__ == "__main__":
    app.run(host='127.0.0.1')