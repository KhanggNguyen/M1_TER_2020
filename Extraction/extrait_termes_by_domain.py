import sys

if(len(sys.argv) != 2) : 
	print("Usage : <python script.py domaine_a_extraire> \n")
	exit()

f = open('NewData/r_domain.txt', 'r')
new_f = open('NewData/NEW_terme_by_domain.txt', 'w')

line = f.readline()
count = 1
while line:
	array_of_line = line.split(";")
	if len(array_of_line) > 1 and array_of_line[1] == str(sys.argv[1]) :
		print("Line {}: {}".format(count, line))
		#new_f.write(array_of_line[0])
		new_f.write(array_of_line[0] + '\n') 
	line = f.readline()
	count += 1

f.close()
new_f.close()
