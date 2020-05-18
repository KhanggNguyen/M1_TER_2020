import os
import sys
import random
from py2neo import Graph, NodeMatcher
from py2neo.data import Node, Relationship

#donnees admin
user = "neo4j"
password = "1234567"
uri = "bolt://localhost:7687"

#se connecter sur le serveur bdd
graph = Graph(uri, auth=(user, password)) 

#ouvrir un fichier res pour écrire
f = open('Res/' + sys.argv[1] + ".txt", "w", encoding="utf-8")

req = "MATCH (a:Mot)-[r1]->(b:Mot)-[r2]->(c:Mot)<-[r3]-(a:Mot) WHERE r1.poids > 0 AND r2.poids > 0  AND r3.poids > 0 return a, b, c LIMIT 20;"
#req = "MATCH p=(a:Mot)-[:isA]->(b:Mot)-[:isA]->(c:Mot)<-[:isA]-(a:Mot)  return a, b, c SKIP " + str(random.randint(1,100)) + " LIMIT 300;"
#req = "MATCH p=(a:Mot)-[:isA]->(b:Mot)-[:isA]->(c:Mot)<-[:isA]-(a:Mot) return a, b, c SKIP 100 LIMIT 1;"
results = graph.run(req).data()

myRes = ""
for i in range (0, len(results)) :
    myRes = ""
    #affectation la valeur du resultat dans le variable 
    myRes = str(results[i]['a']['label']) + " -[" + relation + "]-> " + str(results[i]['b']['label']) + " -[" + relation + "]-> " + str(results[i]['c']['label'])
    print("\n")
    print(myRes)

    #afficher le resultat du requete dans le terminal
    print("Donc : ")
    print(str(results[i]['a']['label']) + " -[" + relation + "]-> " + str(results[i]['c']['label']))
    f.write(myRes+"\n")#ecrire dans le fichier
    


