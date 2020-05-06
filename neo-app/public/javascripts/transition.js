$(document).ready(function(){
    $('#down').submit(function(event){
        event.preventDefault();
        var data = {nodeA : $('#UpNodeA').val(), nodeC : $('#DownNodeC').val(), nodeE : $('#DownNodeE').val(), relation1 : $('#DownRelation1').val(), relation2 : $('#DownRelation2').val(), relation3 : $('#DownRelation3').val()};
    
        $.post('/down',data, function(resp){
            console.log('down')
        });
    });

    $('#up').submit(function(event){
        event.preventDefault();
        var data = {nodeA : $('#UpNodeA').val(), nodeC : $('#UpNodeC').val(), nodeE : $('#UpNodeE').val(), relation1 : $('#UpRelation1').val(), relation2 : $('#UpRelation2').val(), relation3 : $('#UpRelation3').val()};
        $.post('/up',data, function(resp){
            console.log('up')
        });
    });
});