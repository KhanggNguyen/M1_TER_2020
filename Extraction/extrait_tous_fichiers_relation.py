import os



fichiers = []
f_relations = []
for file in os.listdir('Data') :
    f_relations.append(open('NewData/' + file, 'w'))
    fichiers.append(open('Data/' + file, encoding="latin1"))


for i in range (len(fichiers)) :
    f_mots = open('NewData/NEW_terme_by_domain.txt', 'r')
    lines = fichiers[i].readlines()
    mots = f_mots.readlines()
    for mot in mots :
        mot = mot.strip('\n')#eviter charactere 'saut de ligne' ou 'fin fichier'
        for line in lines :
            array_of_line = line.split(';')
            if (len(array_of_line) > 1) :
                if( ( (mot == array_of_line[0]) or (mot == array_of_line[1]) ) ): 
                    print("{}".format(line))
                    f_relations[i].write(line)
    f_mots.close()

for i in range(0, len(fichiers)) :
    f_relations[i].close()
    fichiers[i].close()