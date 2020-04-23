create database if not exists relation;
use relation;

create table relation (
	term_1 varchar(200), 
	term_2 varchar(200), 
	weight integer, relation_type varchar(3),
    id integer not null auto_increment primary key
);

-- insert data from file into main table
LOAD DATA INFILE 'r_isa.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' (term_1, term_2, weight, relation_type);  
LOAD DATA INFILE 'r_conseq.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_lieu.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_agent.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_appartient.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_causatif.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_has_part.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_associated.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
LOAD DATA INFILE 'r_caracteristique.txt' INTO TABLE relation FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\n' (term_1, term_2, weight, relation_type); 
-- end of insert

create table relation_2 like relation;
insert relation_2 select * from relation;

create table relation_3 like relation;
insert relation_3 select * from relation;

-- drop table relation;
-- drop table relation_2;
-- drop table relation_3;

