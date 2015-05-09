$(document).ready(function () {
    $('#btnEditMatchSelectForm').click( function(){
        var payload = {
            MatchID: $('#MatchID').val(),
        };

        $.ajax({
            url: "/admin/editmatch",
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