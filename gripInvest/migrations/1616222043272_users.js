module.exports = {
    "up": "CREATE TABLE users (user_id int(11) unsigned NOT NULL AUTO_INCREMENT,name varchar(100) NOT NULL,email varchar(100) NOT NULL,wallet_balance decimal(12,2) NOT NULL,creation_date date NOT NULL,PRIMARY KEY (user_id)) ENGINE=MyISAM DEFAULT CHARSET=latin1",
    "down": "DROP TABLE users"
}