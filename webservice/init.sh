#!/usr/bin/env bash
pip install Flask
pip install -U flask-cors
pip install sqlite3

sudo apt-get install sqlite3 libsqlite3-dev

python chat.py
