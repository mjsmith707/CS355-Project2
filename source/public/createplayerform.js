$(document).ready(function () {
    $('#btnCreatePlayerForm').click( function(){
        var payload = {
            Name: $('#Name').val(),
        };

        $.ajax({
            url: "/admin/createplayer/submit",
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