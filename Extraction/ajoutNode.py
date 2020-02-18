from py2neo import Database
from py2neo import Graph, NodeMatcher
from py2neo import Node, Relationship

#donnees admin
user = "neo4j"
password = "1234567"
uri = "bolt://localhost:7687"

mots = open("NewData/NEW_terme_by_domain.txt", encoding='latin1')

#se connecter sur le serveur bdd
graph = Graph(uri, auth=(user, password)) 
matcher = NodeMatcher(graph)

for mot in mots :
    myNode = Node("Terme", label = mot.strip("\n"))
    graph.create(myNode)
