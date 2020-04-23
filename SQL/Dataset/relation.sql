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

create table relation_2 like relation;
insert relation_2 select * from relation;

create table relation_3 like relation;
insert relation_3 select * from relation;


-- call createTable('temporary','relation_temp'); 

drop table relation_new;
-- drop table relation_2;

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

-- triangle query 2 relations
select a1.term_1, '->', a1.term_2, '<-', a2.term_1, 'donc', a1.term_1, '->', a2.term_1, a1.relation_type as relation_1, a2.relation_type as relation_2
	from relation as a1, relation_temp as a2 
    where a1.term_2 = a2.term_2 and a1.term_1 != a2.term_1 
    and a1.relation_type = 9
    and a2.relation_type = 13
    and a1.weight > 0 and a2.weight > 0
    order by rand()
    limit 1;

select a1.term_1, '->', a1.term_2, '<-', a2.term_1, 'donc', a1.term_1, '->', a2.term_1, a1.relation_type as relation_1, a2.relation_type as relation_2
	from relation as a1, relation_2 as a2 
    where a1.term_2 = a2.term_2 and a1.term_1 != a2.term_1 
    and a1.relation_type = 9
    and a2.relation_type = 41
    and a1.weight > 0 and a2.weight > 0
    order by rand()
    limit 1;
    
   select a1.term_1, a1.relation_type, a1.term_2, a2.relation_type, a2.term_2, a1.term_1, a1.relation_type, a2.term_2
   from relation as a1, relation_temp as a2 
where a2.term_1 = a1.term_2 and a1.relation_type = 6 and a2.relation_type = 17 and a1.weight > 0 and a2.weight > 0 order by rand() limit 1;


select a3.term_1 as nodeA, '->', a3.term_2 as nodeC, 'parce que', a1.term_1 as nodeA, '->', a1.term_2 as nodeB, '->', a2.term_2 as nodeC, a1.relation_type as rel1, a2.relation_type as rel2, a3.relation_type as rel3
	from relation as a1, relation_2 as a2, relation_3 as a3
    where a2.term_1 = a1.term_2 and a1.term_1 = a3.term_1 and a2.term_2 = a3.term_2
	and a3.term_1 = 'lumière' and a3.term_2 = 'chaleur'
    and a1.relation_type = 9 and a2.relation_type = 9
    and a1.weight > 0 and a2.weight > 0 and a3.weight > 0
    order by rand() 
		limit 10;

select relation_type from relation where term_1 = 'frigo' and term_2 = 'glace';