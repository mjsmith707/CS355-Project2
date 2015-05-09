$(document).ready(function () {
    $('#btnDeleteCommentSelectForm').click( function(){
        var payload = {
            MatchID: $('#MatchID').val(),
        };
        console.log(payload);
        $.ajax({
            url: "/admin/deletecomment/list",
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