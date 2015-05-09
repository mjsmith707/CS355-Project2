$('#upload').submit(function(event) {
    // None of this works
    //event.preventDefault();
    
    $('#btnUploadMatch').innerHTML = "Uploading...";
    console.log($('#upload'));
    console.log($('#uploadfiles'));
    var files = $('#uploadfiles').files;
    
    var formdata = new FormData();
    
    for (var i=0; i<files.length; i++) {
        var file = files[i];
        
        if (!file.type.match('*.xml')) {
            continue;
        }
        
        formdata.append('matchdata', file, file.name);
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/uploadmatch/submit', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            $('#btnUploadMatch').innerHTML = "Upload Files";
        }
        else {
            $('#output').html("Failed to upload files.");
            $('#output').show();
        }
    }
    
    xhr.send(formdata);
});