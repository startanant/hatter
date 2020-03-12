DROP DATABASE IF EXISTS hatter;
CREATE DATABASE hatter;
USE hatter;

CREATE TABLE `hatter`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(70) NOT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  `picture_path` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE KEY(email);
  
INSERT INTO users (name,email,password) values ('przemek','przemek@przemek','przemek'),('anant','anant@anant','anant'),('james','james@james','james'),('serop','serop@serop','serop');


CREATE TABLE `hatter`.`hatts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `attachement` VARCHAR(255) NULL DEFAULT NULL,
  `tweet_time` DATETIME NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`));
  
  INSERT INTO hatts (user_id,text) VALUES (1,'helo world!'),(1,'welcome to hatter app!'),(2,'JavaScript is trending up in developers world!'),(3,'Cold warning for Toronto!'),
(4,'Bite me!'),(3,'World hates me! What to do???'),(2,'I need my schema names right!!! ;)');

CREATE TABLE `followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `follower` int(11) NOT NULL,
  `time` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

  
INSERT INTO `hatter` .`followers` (user,follower) values (1,2),(1,3),(1,4),(2,1),(1,1),(2,3),(3,1),(3,2),(3,4),(4,2),(4,3);

CREATE TABLE `hatter`.`comments` (
`id` INT NOT NULL AUTO_INCREMENT,
`hatt_id` INT NOT NULL,
`user_id` INT NOT NULL,
`comment` VARCHAR(255) NOT NULL,
`comment_time` DATETIME NULL DEFAULT current_timestamp(),
PRIMARY KEY(id));

INSERT INTO comments (hatt_id,user_id,comment) values (1,2,'Hello to you too!'),(1,3,'I dont care!'),(6,1,'You can sign a song!'),(3,3,'I am a pro at JS!');

-- ### queries ####
-- QUERIES FOR LEFT SECTION
---select user_id, count(*) as numOfHatts from hatts where user_id=3;
---select user, count(*) as numOfFollowers from followers where user=3;
---select follower, count(*) as numFollowing from followers where follower=3;

-- SELECT users.id,users.name, hatts.text from users LEFT JOIN hatts ON users.id = hatts.user_id; 

-- ### display user's hatts (user_id)
-- select text from hatts where user_id=1;

-- ### display who follows who
-- select u.name as user, f.name as follower from followers LEFT JOIN users as u on (u.id = followers.user) LEFT JOIN users as f on (f.id = followers.follower);

-- ### show followers name for given user
-- select users.name from followers LEFT JOIN users on (followers.follower = users.id) where followers.user = 1;

-- ### show followers count for user
-- select count(*) as num from followers where followers.user = 1;

-- ### show top3 users with highest number of followers
-- select user,count(*) as num from followers group by user order by num desc limit 3;

-- ### show top3 users with highest number of tweets
-- select user_id,count(*) as num from hatts group by user_id order by num desc limit 3;


-- ###select u.name as follower from followers LEFT JOIN users as u on (followers.follower = u.id) where followers.user = 1;

-- select users.name from followers LEFT JOIN users on (followers.follower = users.id) where followers.user = 1;
  
