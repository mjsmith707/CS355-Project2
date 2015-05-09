$(document).ready(function () {
    $('#btnCreateComment').click( function(){
        var payload = {
            MatchID: $('#MatchID').val(),
        };
        console.log(payload);
        $.ajax({
            url: "/match/createcomment",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function(data) {
                console.log(data.responseText);
                $('#btnCreateComment').hide();
                $('#commentarea').html(data.responseText);
                $('#commentarea').show("slow");
                window.scrollTo(0,document.body.scrollHeight);
            }
        });
    });
});