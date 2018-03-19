#!/usr/bin/env bash
pip install --upgrade pip
pip install Flask
pip install -U flask-cors

sudo apt-get install sqlite3 libsqlite3-dev
rm chat.db
sqlite3 chat.db < create.sql
