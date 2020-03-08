Avant de commencer : 
Il est nécessaire que 
- Le python est installé (pref version 3.7)
- Py2neo doit être aussi installé (pref version 4.3)
- Neo4j installé et mise en marche


Pour récuperer les mots liés à la domaine : 

- Télécharger le fichier à partir du lien suivant : [FichierDomaine](http://www.jeuxdemots.org/JDM-LEXICALNET-FR/01212020-LEXICALNET-JEUXDEMOTS-R3.txt)

- Ensuite, modifier le nom du fichier à "r_domain.txt" et mettre dans le dossier "NewData"

- Exécuter la commande suivant dans le terminal "python extrait_termes_by_domain.py domaine_voulou" 

- Le resultat sera enregistré dans le fichier "NewData/NEW_terme_by_domain.txt"

Pour récuperer les relations liés aux mots : 

- Télécharger les fichiers de relations (sauf r_domaine)

- Mettre les dans le dossier Data 

- Exécuter la commande suivant dans le terminal "python append_relation.py". Le processus pourrait prendre quelques minutes. Cela dépend de nombre et de taille des fichiers de données. 

- Pour récupérer un seul fichier de relation : python extrait_relations_par_fichiers.py "r_agent.txt" 

- Le resultat sera enregistré dans le fichier "NewData/New_relations.txt"

Pour créer les triangles, on utilise le script "make_triangle.py" + id de la relation voulu comme indique ci-dessous : 

Liste ID des relations 

15 = lieu 1 (done)
17 = caracteristique (adding to neo4j)
9 = has_part (done)
6 = isA (done)
13 = agent (done)
42 = causatif (done)
41 = conseq (done)
14 = appartient (done)