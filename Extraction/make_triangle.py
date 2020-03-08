import os
import sys
import random
from py2neo import Graph, NodeMatcher
from py2neo.data import Node, Relationship

liste_id_relation = {6 : "isA", 9 : "has_part", 13 : "agent", 14 : "appartient", 15 : 'lieu', 17 : 'caracteristique',  41 : 'a pour cause', 42 : 'a pour conséquence'}
relation = sys.argv[1]

relation_string = liste_id_relation[relation]

#donnees admin
user = "neo4j"
password = "1234567"
uri = "bolt://localhost:7687"

#se connecter sur le serveur bdd
graph = Graph(uri, auth=(user, password)) 

#ouvrir un fichier res pour écrire
f = open('Res/' + sys.argv[1] + ".txt", "w", encoding="utf-8")

req = "MATCH (a:Terme)-[r1:`" + relation + "`]->(b:Terme)-[r2:`" + relation + "`]->(c:Terme)<-[r3:`" + relation + "`]-(a:Terme) WHERE r1.poids > 0 AND r2.poids > 0 AND r3.poids > 0 return a, b, c;"
#req = "MATCH p=(a:Terme)-[:isA]->(b:Terme)-[:isA]->(c:Terme)<-[:isA]-(a:Terme)  return a, b, c SKIP " + str(random.randint(1,100)) + " LIMIT 300;"
#req = "MATCH p=(a:Terme)-[:isA]->(b:Terme)-[:isA]->(c:Terme)<-[:isA]-(a:Terme) return a, b, c SKIP 100 LIMIT 1;"
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
    print(str(results[i]['a']['label']) + " -[" + relation_string + "]-> " + str(results[i]['c']['label']))
    f.write(myRes+"\n")#ecrire dans le fichier
    


