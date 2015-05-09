$(document).ready(function() {
        $('.btn-warning').click(function() {
            if($(this).attr("value")) {
                var idx = $(this).attr("value");
                var payload = {
                MatchID: $('#MatchID').val(),
                Name: $('#Name'+idx).val(),
                Datetime: $('#Datetime'+idx).val()
            };
        
            $.ajax({
                url: "/admin/deletecomment/submit",
                type: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(payload),
                complete: function(data) {
                    console.log(data.responseText);
                    $('#'+idx).hide("slow");
                    $('#output2').html(data.responseText);
                    $('#output2').show();
                }
            });
        }
    });
});