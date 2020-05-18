import os
import sys
import re

if( len(sys.argv) != 2) :
    print("Veuillez ajouter le nom d'un fichier relation en argument")
    exit()

fichier = open('Data/' + sys.argv[1] + ".txt", encoding="latin1")
f_relation = open('NewData/' + sys.argv[1] + ".txt", "w", encoding="UTF-8")
f_mots = open('NewData/NEW_terme_by_domain.txt', encoding="latin1")

#on ne prend pas les relations qui contiennent un sous-relation. par ex : manger>123456
def hasNumbers(string):
    return bool(re.match('(?=.*[0-9]$)', string))

lines = fichier.readlines()
mots = f_mots.readlines()

for mot in mots :
    mot = mot.strip('\n')#eviter charactere 'saut de ligne' ou 'fin fichier'
    for line in lines :
        array_of_line = line.split(';')
        if (len(array_of_line) > 1 ) :
            if (not (hasNumbers(array_of_line[0]) or hasNumbers(array_of_line[1]) ) ) :
                if( ( (mot == array_of_line[0]) or (mot == array_of_line[1]) ) ): 
                    print("{}".format(line))
                    f_relation.write(line)
    f_mots.close()

f_relation.close()
fichier.close()