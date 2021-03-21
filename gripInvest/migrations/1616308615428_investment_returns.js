module.exports = {
    "up": "CREATE TABLE investment_returns (id int(11) unsigned NOT NULL AUTO_INCREMENT,fk_user_id int(11) unsigned NOT NULL,amount decimal(12,2) NOT NULL,rate decimal(12,2) NOT NULL,time decimal(12,2) NOT NULL,interest decimal(12,2) NOT NULL,creation_date date NOT NULL,PRIMARY KEY (id)) ENGINE=MyISAM DEFAULT CHARSET=latin1",
    "down": "DROP TABLE investment_returns"
}