#!/usr/bin/env bash

# python packages
pip install --user --upgrade pip
pip install --user Flask
pip install --user -U flask-cors

# sqlite
sudo apt-get install sqlite3 libsqlite3-dev

# create db
sqlite3 chat.db < create.sql
chmod 664 chat.db
chmod 777 ../webservice
