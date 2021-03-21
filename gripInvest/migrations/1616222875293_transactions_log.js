module.exports = {
    "up": "CREATE TABLE transactions_log (id int(11) unsigned NOT NULL AUTO_INCREMENT,fk_user_id int(11) unsigned NOT NULL,amount decimal(12,2) NOT NULL, transaction_type smallint(5) unsigned NOT NULL COMMENT '1=> amount withdrawal, 2=> amount invested, 3=> returns to wallet',transaction_date date NOT NULL,PRIMARY KEY (id)) ENGINE=MyISAM DEFAULT CHARSET=latin1",
    "down": "DROP TABLE transactions_log"
}