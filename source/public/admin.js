$(document).ready(function () {
    $('#btnCreateMatch').click( function() {
        $.ajax({
            url: "/admin/creatematch/form",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
    
    $('#btnEditMatch').click( function() {
        $.ajax({
            url: "/admin/editmatch/select",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
    
    $('#btnDeleteMatch').click( function() {
        $.ajax({
            url: "/admin/deletematch",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
    
    $('#btnCreatePlayer').click( function() {
        $.ajax({
            url: "/admin/createplayer",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });

    $('#btnEditPlayer').click( function() {
        $.ajax({
            url: "/admin/editplayer/select",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });

    $('#btnDeletePlayer').click( function() {
        $.ajax({
            url: "/admin/deleteplayer/select",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
    
    $('#btnUploadMatch').click( function() {
        $.ajax({
            url: "/admin/uploadmatch",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
    
    $('#btnClearDatabase').click( function() {
        $.ajax({
            url: "/admin/cleardatabase/confirm",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
    
    $('#btnDeleteComment').click( function() {
        $.ajax({
            url: "/admin/deletecomment/select",
            type: "POST",
            contentType: "application/json",
            processData: false,
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
});