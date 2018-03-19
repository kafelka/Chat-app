CREATE TABLE channels(
  channel VARCHAR(80) PRIMARY KEY
);

CREATE TABLE users (
  user_login varchar(40) PRIMARY KEY
);

CREATE TABLE channel_user_rel (
  channel VARCHAR(80),
  user_login VARCHAR(40),
  PRIMARY KEY(channel, user_login)
);


CREATE TABLE messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel VARCHAR(80),
  user_login VARCHAR(40),
  timestamp INT
)