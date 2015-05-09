$(document).ready(function () {
    $('#btnEditPlayerSelectForm').click( function(){
        var payload = {
            PlayerID: $('#PlayerID').val(),
        };

        $.ajax({
            url: "/admin/editplayer",
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