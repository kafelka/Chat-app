CREATE TABLE channels(
  channel VARCHAR(80) PRIMARY KEY
);

INSERT INTO channels (channel) VALUES ('General');
INSERT INTO channels (channel) VALUES ('JavaScript');
INSERT INTO channels (channel) VALUES ('London');
INSERT INTO channels (channel) VALUES ('Music');
INSERT INTO channels (channel) VALUES ('Cinema');

CREATE TABLE users (
  user_login varchar(40) PRIMARY KEY
);

INSERT INTO users (user_login) VALUES ('Mark');
INSERT INTO users (user_login) VALUES ('Susan');
INSERT INTO users (user_login) VALUES ('Tom');
INSERT INTO users (user_login) VALUES ('Ann');
INSERT INTO users (user_login) VALUES ('Jack');

CREATE TABLE channel_user_rel (
  channel VARCHAR(80),
  user_login VARCHAR(40),
  PRIMARY KEY(channel, user_login)
);

INSERT INTO channel_user_rel (channel, user_login) VALUES ('General', 'Mark');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('General', 'Susan');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('General', 'Tom');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('General', 'Ann');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('JavaScript', 'Jack');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('JavaScript', 'Susan');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('JavaScript', 'Ann');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('London', 'Ann');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('London', 'Tom');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('London', 'Jack');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('Music', 'Jack');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('Music', 'Susan');
INSERT INTO channel_user_rel (channel, user_login) VALUES ('Cinema', 'Mark');


CREATE TABLE messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel VARCHAR(80),
  user_login VARCHAR(40),
  ts INT,
  message VARCHAR(512)
);

INSERT INTO messages (channel, user_login, ts, message)
 VALUES ('General', 'Mark', 1521555063, 'Hi all');
INSERT INTO messages (channel, user_login, ts, message)
 VALUES ('General', 'Susan', 1521555066, 'Hello');
INSERT INTO messages (channel, user_login, ts, message)
 VALUES ('General', 'Tom', 1521555096, 'How are you Mark?');

INSERT INTO messages (channel, user_login, ts, message)
 VALUES ('JavaScript', 'Jack', 1521555196, 'Can anyone help me with my project?');

INSERT INTO messages (channel, user_login, ts, message)
 VALUES ('London', 'Ann', 1521555191, 'What are the best things to see when visiting London for a weekend?');
INSERT INTO messages (channel, user_login, ts, message)
 VALUES ('London', 'Jack', 1521555263, 'Oh no, this question again...');
