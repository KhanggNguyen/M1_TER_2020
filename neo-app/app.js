var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
const requestIp = require('request-ip');//to get client IP
const fs = require('fs');

var logStream = fs.createWriteStream('user_proposition.csv', {flags: 'a'});

var app = express();

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(requestIp.mw());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234567'));


app.get('/', function(req,res,next){
    query = 'MATCH (n) RETURN COUNT(n)';
    query = 'MATCH ()-[r]->() RETURN COUNT (r)';
    
    res.render('index', {page:'Home', menuId:'home', url: "home"});
});

app.get('/relations/:page', async function(req, res, next){
    var session = driver.session();
    const resPerPage = 100;
    const page = req.params.page || 1 ;
    const skipValue = (resPerPage * page) - resPerPage;
    var searchNodeA = null;
    var searchNodeB = null;
    var searchRel = null;
    var totalRelations = 0;
    var searchMotif = null;
    if(req.query.nodeA){
        searchMotif = "nodeA";
        searchVal = req.query.nodeA;
        searchNodeA = req.query.nodeA;
        query = 'MATCH p = (a)-[r]->(b) WHERE a.label = \'' + searchNodeA + '\' RETURN p SKIP ' + skipValue +  ' LIMIT ' + resPerPage;
        await session.run('MATCH p = ()-[]->() WHERE a.label = \'' + searchNodeA + '\' RETURN COUNT(p);')
        .then(function(result){
            totalRelations = result.records[0]._fields[0].low;
        })
        .catch(function(err){
            console.log(err);
        });
    }
    else if(req.query.nodeB){
        searchMotif = "nodeB";
        searchVal = req.query.nodeB;
        searchNodeB = req.query.nodeB;
        query = 'MATCH p = (a)-[r]->(b) WHERE b.label = \'' + searchNodeB + '\' RETURN p SKIP ' + skipValue +  ' LIMIT ' + resPerPage;
        await session.run('MATCH p = ()-[]->() WHERE b.label = \'' + searchNodeB + '\' RETURN COUNT(p);')
            .then(function(result){
                totalRelations = result.records[0]._fields[0].low;
            })
            .catch(function(err){
                console.log(err);
            });
    }
    else if(req.query.rel){
        searchMotif = "rel";
        searchVal = req.query.rel;
        searchRel = req.query.rel;
        query = 'MATCH p = (a)-[r]->(b) WHERE type(r) = \'' + searchRel + '\' RETURN p SKIP ' + skipValue +  ' LIMIT ' + resPerPage;
        await session.run('MATCH p = ()-[]->() WHERE type(r) = \'' + searchRel + '\' RETURN COUNT(p);')
            .then(function(result){
                totalRelations = result.records[0]._fields[0].low;
            })
            .catch(function(err){
                console.log(err);
            });
    }
    else{
        searchVal = ""
        query = 'MATCH p = (a)-[r]->(b) RETURN p ORDER BY type(r) SKIP ' + skipValue +  ' LIMIT ' + resPerPage;
        await session.run('MATCH p = ()-[]->() RETURN COUNT(p);')
            .then(function(result){
                totalRelations = result.records[0]._fields[0].low;
            })
            .catch(function(err){
                console.log(err);
            });
    }    
    
    await session.run(query)
            .then(function(result){
                var titre = "Relations";
                var resArray = [];
                var id = (resPerPage*page)-resPerPage+1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        relation1 : r1,
                    });
                    id++;
                });
                message="";
                if(resArray.length == 0){
                    message = 'Aucuns couples de relations ont été trouvé !'
                }
                res.render('index', {
                    url : "relations",
                    page:'Relations liste', menuId:'relations',
                    titre : titre,
                    message: message,
                    currentPage : page,
                    pages : Math.ceil(totalRelations / resPerPage),
                    myResArray : resArray,
                    searchMotif : searchMotif,
                    searchVal : searchVal,
                });
                console.log(result.records.length);
            })
            .catch(function(err){
                console.log(err);
            });
});


app.post('/graphe_explication', async function(req,res){
    var session = driver.session();
    var nodeA =  req.body.nodeA;
    var nodeC = req.body.nodeC;
    var relation3 = req.body.relation3;
    if(nodeA != "" || !typeof nodeA === undefined){
        nodeA = " AND a.label = \'" + nodeA + "\' ";
    }else{
        nodeA = "";
    }

    if(nodeC != "" || !typeof nodeC === undefined){
        nodeC = " AND c.label = \'" + nodeC + "\' ";
    }else{
        nodeC = "";
    }

    if(relation3 != "" || !typeof relation3 === undefined){
        relation3 = " AND type(r3) = \'" + relation3 + "\' ";
    }else{
        relation3 = "";
    }

    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE a.id <> b.id <> c.id AND r2.poids > 0 AND r1.poids > 0 ' + nodeA + nodeC + relation3 + ' return p  LIMIT 100 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe explications";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    var nodeE = record._fields[0].segments[2].start.properties.label;
                    var r3 = record._fields[0].segments[2].relationship.type;
                    var nodeF = record._fields[0].segments[2].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        nodeE : nodeE,
                        nodeF : nodeF,
                        relation1 : r1,
                        relation2 : r2, 
                        relation3 : r3,
                    });
                    //console.log(resArray);
                    id++;
                });
                message="";
                if(resArray.length == 0){
                    message = 'Aucuns couples de relations ont été trouvé !'
                }
                res.render('index', {
                    url : "transition",
                    page:'Explications', menuId:'explication',
                    titre : titre,
                    message: message,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });

});

app.get('/graphe_transition',async function(req,res){
    var session = driver.session();
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE a.id < 150000 AND a <> b <> c AND r2.poids > 0 AND r1.poids > 0 AND r3.poids > 0 RETURN p SKIP ' + Math.floor(Math.random() * 10000) + ' LIMIT 1';
    query2 = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE a.id > 150000 AND a <> b <> c AND r2.poids > 0 AND r1.poids > 0 AND r3.poids > 0 RETURN p SKIP ' + Math.floor(Math.random() * 5000) + ' LIMIT 1';
    var queryArray = [query, query2];

    await session.run(queryArray[Math.floor(Math.random()*queryArray.length)])
            .then(function(result){
                var titre = "Graphe transition";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    var nodeE = record._fields[0].segments[2].start.properties.label;
                    var r3 = record._fields[0].segments[2].relationship.type;
                    var nodeF = record._fields[0].segments[2].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        nodeE : nodeE,
                        nodeF : nodeF,
                        relation1 : r1,
                        relation2 : r2, 
                        relation3 : r3,
                        
                    });
                    //console.log(resArray);
                    id++;
                });
                res.render('index', {
                    url : "transition",
                    page:'Transition', menuId:'transition',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.post('/transition_avec_param', async function(req, res){
    var session = driver.session();
    var nodeA =  req.body.nodeA;
    var nodeB = req.body.nodeB;
    var nodeC = req.body.nodeC;
    var relation1 = req.body.relation1;
    var relation2 = req.body.relation2;
    var relation3 = req.body.relation3;
    if(nodeA != "" || !typeof nodeA === undefined){
        nodeA = " AND a.label = \'" + nodeA + "\' ";
    }else{
        nodeA = "";
    }
    if(nodeB != "" || !typeof nodeB === undefined){
        nodeB = " AND b.label = \'" + nodeB + "\' ";
    }else{
        nodeB = "";
    }
    if(nodeC != "" || !typeof nodeC === undefined){
        nodeC = " AND c.label = \'" + nodeC + "\' ";
    }else{
        nodeC = "";
    }
    if(relation1 != "" || !typeof relation1 === undefined){
        relation1 = " AND type(r1) =\'" + relation1 + "\' ";
    }
    else{
        relation1 = "AND type(r1) <> \'0\'";
    }
    if(relation2 != "" || !typeof relation2 === undefined){
        relation2 = " AND type(r2) = \'" + relation2 + "\' ";
    }else{
        relation2 = "AND type(r2) <> \'0\'";
    }
    if(relation3 != "" || !typeof relation3 === undefined){
        relation3 = " AND type(r3) = \'" + relation3 + "\' ";
    }else{
        relation3 = "";
    }
    
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE a.id <> b.id <> c.id AND r2.poids > 0 AND r1.poids > 0 ' + nodeA + nodeB + nodeC + relation1 + relation2 + relation3 + 'return p SKIP ' +  Math.floor(Math.random() * 50) + ' LIMIT 1 ;';
    //console.log(query);
    await session.run(query)
            .then(function(result){
                var titre = "Graphe transition";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    var nodeE = record._fields[0].segments[2].start.properties.label;
                    var r3 = record._fields[0].segments[2].relationship.type;
                    var nodeF = record._fields[0].segments[2].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        nodeE : nodeE,
                        nodeF : nodeF,
                        relation1 : r1,
                        relation2 : r2, 
                        relation3 : r3,
                    });
                    //console.log(resArray);
                    id++;
                });
                message="";
                if(resArray.length == 0){
                    message = 'Aucuns couples de relations ont été trouvé !'
                }
                res.render('index', {
                    url : "transition",
                    page:'Transition', menuId:'transition',
                    titre : titre,
                    message: message,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_deduction',async function(req,res){
    var session = driver.session();

    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c) WHERE r2.poids > 0 AND r1.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\'  return p SKIP '+ Math.floor(Math.random() * 500000) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe Abduction";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        relation1 : r1,
                        relation2 : r2, 
                    });
                    id++;
                });
                res.render('index', {
                    url : "deduction",
                    page:'Deduction', menuId:'deduction',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_abduction',async function(req,res){
    var session = driver.session();
    query = 'MATCH p=(a)-[r1]->(b)<-[r2]-(c) WHERE r2.poids > 0 AND r1.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\'  return p SKIP '+ Math.floor(Math.random() * 500000) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe Abduction";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        relation1 : r1,
                        relation2 : r2, 
                    });
                    id++;
                });
                res.render('index', {
                    url : "abduction",
                    page:'Abduction', menuId:'abduction',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_induction',async function(req,res){
    var session = driver.session();
    query = 'MATCH p=(a)<-[r1]-(b)-[r2]->(c) WHERE r2.poids > 0 AND r1.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\' return p SKIP '+ Math.floor(Math.random() * 500000) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe Induction";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        relation1 : r1,
                        relation2 : r2, 
                    });
                    id++;
                });
                res.render('index', {
                    url : "induction",
                    page:'Induction', menuId:'induction',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/up', function(req, res, next){

});

app.get('/down', function(req, res, next){
    
});

app.post('/user_input', function(req, res, next){
    console.log(req.body);
    var ip = req.clientIp;//on reçoit le ::1 car on est sur localhost + ipv6
    var node1 = req.body.nodeA;
    var node2 = req.body.nodeD;
    var relation = req.body.relation;
    var page = req.body.page;

    logStream.write(node1 + "," + node2 + "," + relation + "," + ip + "\n");
    
    res.redirect('/graphe_'+ page);
});

app.listen(3000);

console.log('Server started on Port 3000');

module.exports = app;