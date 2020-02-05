import os

f_relations = open('NewData/New_relations.txt', 'w')

f_mots = open('NewData/NEW_terme_by_domain.txt', 'r')

fichiers = []
for file in os.listdir('Data') :
    fichiers.append(open('Data/' + file, 'r'))


for f in fichiers :
    line = f.readline()
    mot = f_mots.readline().strip('\n')#eviter charactere 'saut de ligne' ou 'fin fichier'
    while mot :
        while line :  
            array_of_line = line.split(';')
            if (len(array_of_line) > 1) :
                if( ( (mot == array_of_line[0]) or (mot == array_of_line[1]) ) ): 
                    print("{}".format(line))
                    f_relations.write(line)
            line = f.readline()
        mot = f_mots.readline()

f_relations.close()
f_mots.close()
for i in range(1, len(fichiers)) :
    fichiers[i].close()