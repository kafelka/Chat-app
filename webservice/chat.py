from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def validate_user(user, pwd):
    return jsonify({'valid': True})


@app.route('/login', methods=['POST'])
def login():
    return validate_user(request.form['username'], request.form['password'])


@app.route('/channels')
def get_channels():
    return jsonify({'channels': ['General', 'Javascript', 'London', 'Music']})


@app.route('/channels/<user>')
def get_channel_list(user):
    return jsonify({'channels': ['General', 'Cinema']})


@app.route('/users/<channel>',  methods=['GET', 'PUT', 'DELETE'])
def get_users(channel):
    if request.method == 'GET':
        return jsonify({'users': ['admin' + channel,  'User1', 'User2', 'User3']})
    pass


@app.route('/messages/<channel>')
def get_last_10_messages(channel):
    return jsonify([
        {'user': 'User2', 'timestamp': 1520981353, 'message': 'Siemanko'},
        {'user': 'User3', 'timestamp': 1520981364, 'message': 'No czesc!'},
        {'user': 'Henryk', 'timestamp': 1520981365, 'message': 'Witam, witam.'}
    ])


@app.route('/messages/<channel>/<int:timestamp>')
def get_messages_since(channel, timestamp):
    return jsonify([
        {'user': 'User2', 'timestamp': 1520981353, 'message': 'Siemanko'},
        {'user': 'User3', 'timestamp': 1520981364, 'message': 'No czesc!!!'},
        {'user': 'Henryk', 'timestamp': 1520981365, 'message': 'Witam, witam :)'}
    ])


@app.route('/send/<channel>', methods=['POST'])
def send_message(channel):
    pass


if __name__ == "__main__":
    app.run(host='127.0.0.1')
