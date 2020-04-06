Avant de commencer : 
Il est nécessaire que 
- Le python est installé (pref version 3.7)
- Py2neo doit être aussi installé (pref version 4.3)
- Neo4j installé et mise en marche


Pour récuperer les mots liés à la domaine : 

- Télécharger le fichier à partir du lien suivant : [FichierDomaine](http://www.jeuxdemots.org/JDM-LEXICALNET-FR/01212020-LEXICALNET-JEUXDEMOTS-R3.txt)

- Ensuite, modifier le nom du fichier à "r_domain.txt" et mettre dans le dossier "NewData"

- Exécuter la commande suivant dans le terminal "python extrait_Mots_by_domain.py domaine_voulou" 

- Le resultat sera enregistré dans le fichier "NewData/NEW_Mot_by_domain.txt"

Pour récuperer les relations liés aux mots : 

- Télécharger les fichiers de relations (sauf r_domaine)

- Mettre les dans le dossier Data 

- Exécuter la commande suivant dans le terminal "python append_relation.py". Le processus pourrait prendre quelques minutes. Cela dépend de nombre et de taille des fichiers de données. 

- Pour récupérer un seul fichier de texte de relation : python extract_to_txt.py r_agent

- Pour récupérer un seul fichier de csv de relation : python extract_to_txt.py r_agent 

- Le resultat sera enregistré dans le fichier "NewData/nom_relations.txt" ou "CSVData/nom_relation.csv"

- Pour ajouter dans neo4j : python add_to_db.txt (attention il faut changer le paramètre de serveur)

Pour créer les triangles, on utilise le script "make_triangle.py" + id de la relation voulu comme indique ci-dessous : 

Liste ID des relations 

0 = associated (last to 361865) //On pourrait lui s'en servir pour les explications
6 = isA (done) (~29702 lignes)
9 = has_part (done)
13 = agent (done)
14 = patient (done) (~140 lignes)
15 = lieu 1 (done)
17 = caracteristique (done)
41 = conseq (done)
42 = causatif (done)

Requete Cypher :

Compter relation spécifique :
MATCH ()-[r:`17`]->() return COUNT(r)


//Attention : il faut éviter de faire des return sans limit pour les requêtes via navigateur. Utilisez le shell pour éviter les memory exception

récuperer les triangles :
MATCH p=(a:Mot)-[r1:`13`]->(b:Mot)-[r2:`13`]->(c:Mot)<-[r3:`13`]-(a:Mot) WITH a,b,c WHERE r2.poids > 0 AND r1.poids > 0 AND r3.poids > 0  return a, b, c LIMIT 300;
//on limite à 300 car sinon ça prend beaucoup de temps

Récuperer les triangles avec les relations aléatoires :
MATCH (a:Mot)-[r1]->(b:Mot)-[r2]->(c:Mot)<-[r3]-(a:Mot) WHERE r1.poids > 0 AND r2.poids > 0  AND r3.poids > 0 return a, b, c LIMIT 1;

Vérifier un relation induction : 
MATCH p=(n:Mot)<-[r:`___`]-(n1:Mot)-[r2:`___`]->(n2:Mot) WHERE r.poids > 0 AND r2.poids > 0 AND n.label = '___' AND n1.label = '___' AND n2.label = '___' return p LIMIT 1;

Vérifier un relation abduction : 
MATCH p=(n:Mot)-[r:`___`]->(n1:Mot)<-[r2:`___`]-(n2:Mot) WHERE r.poids > 0 AND r2.poids > 0 AND n.label = '___' AND n1.label = '___' AND n2.label = '___' return p LIMIT 1;

Vérifier un relation deduction : 
MATCH p=(n:Mot) -[r:`___`]-> (n1:Mot)-[r2:`___`]->(n2:Mot) WHERE r.poids > 0 AND r2.poids > 0 AND n.label = '___' AND n1.label = '___' AND n2.label = '___' return p LIMIT 1;

