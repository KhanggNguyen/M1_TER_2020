from neo4j import GraphDatabase

user = "neo4j"
password = "1234567"
uri = "http://localhost:7474/"

mots = open("NewData/NEW_terme_by_domain.txt", "r")

_driver = GraphDatabase.driver(uri, auth=(user, password))

for mot in mots :
    _driver.session().write_transaction().run("CREATE (" + mot ")")
    


_driver.close()
