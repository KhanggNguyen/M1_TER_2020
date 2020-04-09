function up()
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        document.getElementById('yourmodal').innerHTML=xmlhttp.responseText;
        }
    }
 xmlhttp.open("GET","/showmodalroute",true);
 xmlhttp.send();
} 

function down()
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            document.getElementById('yourmodal').innerHTML=xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET","/showmodalroute",true);
    xmlhttp.send();
} 

function changer()
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", "localhost:3000/graphe_transition", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            console.log(xmlhttp.responseText);
        }
        
    }
}