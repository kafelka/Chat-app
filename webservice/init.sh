#!/usr/bin/env bash

# python packages
pip install --upgrade pip
pip install Flask
pip install -U flask-cors

# sqlite
apt-get install sqlite3 libsqlite3-dev

# create db
rm chat.db
sqlite3 chat.db < create.sql
