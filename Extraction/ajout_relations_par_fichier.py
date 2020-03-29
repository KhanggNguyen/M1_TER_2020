import os
import sys
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

counter = 412930

fichier_relation = open("NewData/" + sys.argv[1], encoding="utf-8")
lines = fichier_relation.readlines()
#lines = fichier_relation.readlines()[250579:]#to skip certain first lines implemented
for relation in reversed(lines) : #run in reversed
#for relation in lines:
    counter = counter - 1
    print("line " + str(counter) + " : " + relation)
    array_of_line = relation.split(';')
    
    myNodeA = Node("Terme", label = array_of_line[0])
    myNodeB = Node("Terme", label = array_of_line[1])
    
    if len(matcher.match('Terme').where('_.label="' + array_of_line[0] + '"')) == 0:
        graph.create(myNodeA)

    if len(matcher.match('Terme').where('_.label="' + array_of_line[1]  + '"')) == 0:
        graph.create(myNodeB)
    
    relation = Relationship.type(int(sys.argv[2]))
    
    graph.merge(relation(myNodeA, myNodeB, typeR = int(sys.argv[2]), poids = int(array_of_line[2])), "Terme", "label")

    