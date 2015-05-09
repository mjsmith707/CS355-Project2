$(document).ready(function () {
    $('#btnClearDatabaseConfirm').click( function(){

        $.ajax({
            url: "/admin/cleardatabase/",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: "",
            complete: function(data) {
                console.log(data.responseText);
                $('#output').html(data.responseText);
                $('#output').show();
            }
        });
    });
});