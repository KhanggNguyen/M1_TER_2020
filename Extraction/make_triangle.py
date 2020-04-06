import os
import sys
import random
from py2neo import Graph, NodeMatcher
from py2neo.data import Node, Relationship
from datetime import datetime

liste_id_relation = {'0' : 'associated', '6' : 'isA', '9' : 'has_part', '13' : 'agent', '14' : 'appartient', '15' : 'lieu', '17' : 'caracteristique',  '41' : 'a pour cause', '42' : 'a pour conséquence'}
if(len(sys.argv) > 1) : 
    relation = sys.argv[1]
    print(liste_id_relation)
    relation_string = liste_id_relation[relation]

#donnees admin
user = "neo4j"
password = "1234567"
uri = "bolt://localhost:7687"

#se connecter sur le serveur bdd
graph = Graph(uri, auth=(user, password)) 



#ouvrir un fichier res pour écrire
if(len(sys.argv) > 1) : 
    f = open('Res/' + sys.argv[1] + ".txt", "w", encoding="utf-8")
else :
    f = open('Res/res.txt', "w", encoding="utf-8")

#gestion du temps
time_start = datetime.now().strftime("%H:%M:%S")

if(len(sys.argv) > 1) : 
    req = "MATCH (a:Mot)-[r1:`" + relation + "`]->(b:Mot)-[r2:`" + relation + "`]->(c:Mot)<-[r3:`" + relation + "`]-(a:Mot) WHERE r1.poids > 0 AND r2.poids > 0  AND r3.poids > 0 AND type(r1) > 0 AND type(r2) > 0 AND type(r3) > 0 return a, b, c LIMIT 300;"
else :
    req = "MATCH p=(a:Mot)-[r1]->(b:Mot)-[r2]->(c:Mot)<-[r3]-(a:Mot) WHERE  r1.poids > 0 AND r2.poids > 0  AND r3.poids > 0 AND type(r1) <> '0' AND type(r2) <> '0' AND type(r3) <> '0' return p, a, b, c, type(r1), type(r2), type(r3)  LIMIT 1000;"
#req = "MATCH p=(a:Mot)-[:isA]->(b:Mot)-[:isA]->(c:Mot)<-[:isA]-(a:Mot)  return a, b, c SKIP " + str(random.randint(1,100)) + " LIMIT 300;"
#req = "MATCH p=(a:Mot)-[:isA]->(b:Mot)-[:isA]->(c:Mot)<-[:isA]-(a:Mot) return a, b, c SKIP 100 LIMIT 1;"
results = graph.run(req).data()

myRes = ""
for i in range (0, len(results)) :
    #print(results[i])
    myRes = ""

    #affectation la valeur du resultat dans le variable 
    if(len(sys.argv) > 1) : 
        myRes = str(results[i]['a']['label']) + " -[" + relation + "]-> " + str(results[i]['b']['label']) + " -[" + relation + "]-> " + str(results[i]['c']['label'])
    else :
        myRes = str(results[i]['a']['label']) + " -[" + results[i]['type(r1)'] + "]-> " + str(results[i]['b']['label']) + " -[" + results[i]['type(r2)'] + "]-> " + str(results[i]['c']['label'])
        print("\n")
    print(myRes)

    #afficher le resultat du requete dans le terminal
    print("Donc par déduction : ")
    print(str(results[i]['a']['label']) + " -[" + results[i]['type(r3)'] + "]-> " + str(results[i]['c']['label']))
    f.write(myRes+"\n")#ecrire dans le fichier
    
#gestion du temps
time_end = datetime.now().strftime("%H:%M:%S")

print("Début : " + time_start)
print("Fin : " + time_end)