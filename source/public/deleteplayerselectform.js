$(document).ready(function () {
    $('#btnDeletePlayerSelectForm').click( function(){
        var payload = {
            PlayerID: $('#PlayerID').val(),
        };

        $.ajax({
            url: "/admin/deleteplayer",
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