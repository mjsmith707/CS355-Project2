$(document).ready(function () {
    $('#btnDeleteMatchSelectForm').click( function(){
        var payload = {
            MatchID: $('#MatchID').val(),
        };

        $.ajax({
            url: "/admin/deletematch/submit",
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