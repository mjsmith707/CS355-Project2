$(document).ready(function () {
    $('#btnEditPlayerForm').click( function(){
        var payload = {
            PlayerID: $('#PlayerID').val(),
            Name: $('#Name').val(),
            FirstSeen: $('#FirstSeen').val(),
            LastSeen: $('#LastSeen').val()
        };
        console.log("pid: ", PlayerID);
        console.log("name: ", Name);
        console.log("firstseen: ", FirstSeen);
        console.log("lastseen: ", LastSeen);

        $.ajax({
            url: "/admin/editplayer/submit",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
});