$(document).ready(function () {
    $('#btnCreateCommentSubmit').click( function(){
        var payload = {
            MatchID: $('#MatchID').val(),
            Name: $('#Name').val(),
            Message: $('#Message').val(),
        };
        
        $.ajax({
            url: "/match/createcomment/submit",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function(data) {
                console.log(data.responseText);
                $('#btnCreateCommentSubmit').hide();
                $('#commentarea').html(data.responseText);
                $('#commentarea').show();
            }
        });
    });
});