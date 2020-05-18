import os
import sys
from datetime import datetime
from py2neo import Graph, NodeMatcher
from py2neo.data import Node, Relationship

if (len(sys.argv) != 3 ) :
    print("Usage : <script.py fichier_relation.txt nom_relation>")

#donnees admin
user = "neo4j"
password = "1234567"
uri = "bolt://localhost:7687"

#se connecter sur le serveur bdd
graph = Graph(uri, auth=(user, password)) 
matcher = NodeMatcher(graph)
transaction = graph.begin()

#id counter
req = """MATCH (n) RETURN COUNT(n)"""
results = graph.run(req).data()
id_counter = int(results[0]['COUNT(n)'])

#to start at line n
counter = 1

#gestion du temps
time_start = datetime.now().strftime("%A %d. %B %Y %H:%M:%S")

fichier_relation = open("NewData/" + sys.argv[1], encoding="utf-8")
lines = fichier_relation.readlines()
#lines = fichier_relation.readlines()[250579:]#to skip certain first lines implemented
#for relation in reversed(lines) : #run in reversed
for relation in lines:
    counter = counter + 1
    print("line " + str(counter) + " : " + relation)
    array_of_line = relation.split(';')#tokenize la ligne de type ['motA','motB','poids','\n']
    
    if len(matcher.match('Mot').where('_.label="' + array_of_line[0] + '"')) == 0:
        myNodeA = Node("Mot", label = array_of_line[0], id=id_counter)
        id_counter = id_counter + 1
        graph.create(myNodeA)
    else : 
        myNodeA = matcher.match('Mot').where('_.label="' + array_of_line[0] + '"').first()

    if len(matcher.match('Mot').where('_.label="' + array_of_line[1]  + '"')) == 0:
        myNodeB = Node("Mot", label = array_of_line[1], id=id_counter)
        id_counter = id_counter + 1
        graph.create(myNodeB)
    else :
        myNodeB = matcher.match('Mot').where('_.label="' + array_of_line[1]  + '"').first()
    
    relation = Relationship.type(int(sys.argv[2]))
    
    graph.merge(relation(myNodeA, myNodeB, typeR = int(sys.argv[2]), poids = int(array_of_line[2])), "Mot", "label")

#gestion du temps
time_end = datetime.now().strftime("%A %d. %B %Y %H:%M:%S")

print("Début : " + time_start)
print("Fin : " + time_end)

