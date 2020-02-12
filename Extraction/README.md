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