create database if not exists relation;
use relation;

-- STORED PROCEDURE
-- Create table procedure
delimiter $$
drop procedure if exists createTable $$
create procedure createTable(
	in stt varchar(10), 
	in tableName varchar(20)
)
begin
	set @tb = concat('create ', stt, ' table ', tableName, '(
    term_1 varchar(200), term_2 varchar(200), weight integer, relation_type varchar(3),
    id integer not null auto_increment primary key);');
    prepare tb from @tb;
    execute tb;
    deallocate prepare tb;
end; $$
delimiter ;

-- Get Triangle procedure type 1
delimiter $$
drop procedure if exists getTriangleType1 $$
create procedure getTriangleType1(
	in table1 varchar(20), 
	in table2 varchar(20), 
	in r_type1 varchar(3), 
	in r_type2 varchar(3), 
    in lim int
)
begin 
	set @qr = concat("select a1.term_1, '->', a1.term_2, '->', a2.term_2, ", "'donc',", " a1.term_1, '->', a2.term_2, a1.relation_type as relation
	from ", table1, " as a1, ", table2, " as a2 where a2.term_1 = a1.term_2 
		and a1.relation_type = ", r_type1, " and a2.relation_type = ", r_type2, " and a1.weight > 0 and a2.weight > 0
		limit ", lim, ";");
    prepare qr from @qr;
    execute qr;
    deallocate prepare qr;
end; $$
delimiter ;

-- END OF STORED PROCEDURE

call createTable('','relation'); 

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

create temporary table relation_temp like relation;
insert relation_temp select * from relation;

-- call createTable('temporary','relation_temp'); 

-- drop table relation;
-- drop table relation_temp;

-- 0 = associated 
-- 6 = isA 
-- 9 = has_part 
-- 13 = agent 
-- 14 = appartient 
-- 15 = lieu 1 
-- 17 = caracteristique 
-- 41 = conseq 
-- 42 = causatif

-- triangle query 1 relation
call getTriangleType1('relation', 'relation_temp', '0', '0', 300);
call getTriangleType1('relation', 'relation_temp', '6', '6', 310000);
call getTriangleType1('relation', 'relation_temp', '9', '9', 500000);
call getTriangleType1('relation', 'relation_temp', '13', '13', 500000);
call getTriangleType1('relation', 'relation_temp', '14', '14', 500000);
call getTriangleType1('relation', 'relation_temp', '15', '15', 500000);
call getTriangleType1('relation', 'relation_temp', '17', '17', 1500000);
call getTriangleType1('relation', 'relation_temp', '41', '41', 500000);
call getTriangleType1('relation', 'relation_temp', '42', '42', 500000);

-- type 2
select a1.term_1, '->', a1.term_2, '<-', a2.term_1, 'donc', a1.term_1, '->', a2.term_1, a1.relation_type as relation
	from relation as a1, relation_temp as a2 
    where a1.term_2 = a2.term_2 and a1.term_1 != a2.term_1 
    and a1.relation_type = 9 and a2.relation_type = 9 and a1.weight > 0 and a2.weight > 0;
-- type 3
select a1.term_2, '<-', a1.term_1, '->', a2.term_2, 'donc', a1.term_2, '->', a2.term_2, a1.relation_type as relation
	from relation as a1, relation_temp as a2 
    where a1.term_2 != a2.term_2 and a1.term_1 = a2.term_1 
    and a1.relation_type = 9 and a2.relation_type = 9 and a1.weight > 0 and a2.weight > 0;
-- end of triangle query 1 relation

select a1.term_1, '->', a1.term_2, '<-', a2.term_1, 'donc', a1.term_1, '->', a2.term_1, a1.relation_type as relation_1, a2.relation_type as relation_2
	from relation as a1, relation_temp as a2 
    where a1.term_2 = a2.term_2 and a1.term_1 != a2.term_1 
    and a1.relation_type = (select elt((rand()*8)+1, 0, 6, 9, 13, 14, 15, 17, 41, 42))
    and a2.relation_type = (select elt((rand()*8)+1, 0, 6, 9, 13, 14, 15, 17, 41, 42))
    and a1.weight > 0 and a2.weight > 0
    limit 10;