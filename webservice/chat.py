from flask import Flask, request, jsonify

app = Flask(__name__)


def validate_user(user, pwd):
    return {'valid': True}


@app.route('/login', methods=['POST'])
def login():
    return validate_user(request.form['username'], request.form['password'])


@app.route('/channels')
def get_channel_list():
    return {'channels': ['Channel1', 'Channel2', 'Channel3', 'Channel4']}


@app.route('/users/<channel>',  methods=['GET', 'PUT', 'DELETE'])
def get_channel_users(channel):
    if request.method == 'GET':
        return {'users': ['User1', 'User2', 'User3']}
    pass


@app.route('/messages/<channel>')
def get_last_10_messages(channel):
    pass


@app.route('/messages/<channel>/<int:timestamp>')
def get_messages_since(channel):
    pass


@app.route('/send/<channel>', methods=['POST'])
def send_message(channel):
    pass


