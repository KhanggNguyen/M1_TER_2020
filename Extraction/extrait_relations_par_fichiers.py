import os
import sys

if( len(sys.argv) != 2) :
    print("Veuillez ajouter le nom d'un fichier relation en argument")
    exit()

fichier = open('Data/' + sys.argv[1], 'r')
f_relation = open('NewData/' + sys.argv[1], 'w')
f_mots = open('NewData/NEW_terme_by_domain.txt', 'r')

lines = fichier.readlines()
mots = f_mots.readlines()
for mot in mots :
    mot = mot.strip('\n')#eviter charactere 'saut de ligne' ou 'fin fichier'
    for line in lines :
        array_of_line = line.split(';')
        if (len(array_of_line) > 1) :
            if( ( (mot == array_of_line[0]) or (mot == array_of_line[1]) ) ): 
                print("{}".format(line))
                f_relation.write(line)
    f_mots.close()

f_relation.close()
fichier.close()