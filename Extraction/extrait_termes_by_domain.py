import sys

if(len(sys.argv) != 2) : 
	exit()

f = open('Data/R_domain.txt', 'r')
new_f = open('Data/NEW_domain.txt', 'w')

line = f.readline()
count = 1
while line:
	array_of_line = line.split(";")
	if len(array_of_line) > 1 and array_of_line[1] == str(sys.argv[1]) :
		print("Line {}: {}".format(count, line))
		new_f.write(line) 
	line = f.readline()
	count += 1

f.close()
new_f.close()
