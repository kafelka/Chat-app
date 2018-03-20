from flask import Flask, request, jsonify
from flask_cors import CORS
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
    channels = [row[0] for row in c.execute('SELECT channel FROM channels ')]

    return jsonify({'channels': channels})


@app.route('/channels/<user>')
def get_channel_list(user):
    c = conn.cursor()
    channels = [row[0] for row in c.execute('SELECT channel FROM channel_user_rel WHERE user=? ', (user, ))]

    return jsonify({'channels': channels})


@app.route('/users/<channel>',  methods=['GET', 'PUT', 'DELETE'])
def get_users(channel):
    if request.method == 'GET':
        c = conn.cursor()
        users = [row[0] for row in c.execute('SELECT user FROM channel_user_rel WHERE channel=? ', (channel, ))]

        return jsonify({'users': users})
    pass


@app.route('/messages/<channel>')
def get_last_10_messages(channel):
    c = conn.cursor()
    msg = [
        {'user': row[0], 'timestamp': row[1], 'message': row[2]} for row in c.execute(
            'SELECT user, timestamp, message FROM messages WHERE channel=? ORDER BY timestamp DESC limit 10 ',
            (channel, ))]

    return jsonify(msg.reverse())


@app.route('/messages/<channel>/<int:timestamp>')
def get_messages_since(channel, timestamp):
    c = conn.cursor()
    msg = [
        {'user': row[0], 'timestamp': row[1], 'message': row[2]} for row in c.execute(
            'SELECT user, timestamp, message FROM messages WHERE channel=? AND timestamp >= ? ORDER BY timestamp',
            (channel, timestamp))]

    return jsonify(msg)


@app.route('/send/<channel>', methods=['POST'])
def send_message(channel):
    content = request.get_json(silent=True)
    print content
    return ''


if __name__ == "__main__":
    app.run(host='127.0.0.1')
