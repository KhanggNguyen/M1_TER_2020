
f = open('Data/R_domain.txt', 'r')
new_f = open('Data/NEW_domain.txt', '+w')

line = f.readline()
   count = 1
   while line:
       print("Line {}: {}".format(count, line.strip()))
       line = f.readline()
       count += 1


f.close()
new_f.close()