Guideline to run successfully sql command: LOAD DATA INFILE in relation-create script 
1. set secure-file-priv="" in C:\ProgramData\MySQL\MySQL Server 8.0\my.ini file
2. restart server mysql and reconnect db (open windows Services/MySQL80)
3. copy r_xxx.txt to C:\ProgramData\MySQL\MySQL Server 8.0\Data\relation (name of the database)
4. run script/command