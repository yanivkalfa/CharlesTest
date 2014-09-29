jQuery(function(){

    $('textarea').autoresize();

    $('.datepicker').datepicker({
        showWeek: false,
        dayNames: [],
        dateFormat: "dd/mm/yy",
        onSelect : function(date,object){
            var altField = $(this).siblings('.altField');
            var dateObject = $( this ).datepicker( "getDate" );
            altField.val(moment(dateObject).format("MM/DD/YYYY"));
        }
    });

    // $(".document_upload").dropzone({ url: "/upload/document" });
    // var myDropzone = new Dropzone("div#document_upload",


    $("#document_upload").dropzone({
        url: "/upload/document",
        paramName: "fileToUpload", // The name that will be used to transfer the file
        maxFilesize: 15, // MB
        init: function() {
            this.on("success", function(file, response) {
                // alert("Added file.");
                console.log(file);
                console.log(response);

                if ( response.url ) {
                    jQuery(".js_document_url").val( response.url);
                    alert("File Uploaded");
                }
            });

            this.on("error", function(file, response) {
                alert("There was a problem uploading the file. Please try again.");
            });
        }
    });


    if($('.dropZoneUploader').length > 0 ){
        var dropZoneContainer = $('.dropZoneUploader');
        var previewNode = document.querySelector("#template");
        previewNode.id = "";
        //var previewTemplate = previewNode.parentNode.innerHTML;
        //previewNode.parentNode.removeChild(previewNode);
        var previewTemplate = previewNode.outerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
            url: "/upload", // Set the url
            method : "post",
            paramName : function(n){
                return 'files[]';
            },
            thumbnailWidth: 80,
            thumbnailHeight: 80,
            parallelUploads: 15,
            maxFiles : 15,
            maxFilesize : 20,
            uploadMultiple : true,
            previewTemplate: previewTemplate,
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: "#previews", // Define the container to display the previews
            clickable: ".fileinput-button, .dropZone", // Define the element that should be used as click trigger to select files.
            //forceFallback : true,
            fallback : function(){
                var template = $('.fallbackUploadTemplate');
                var action = this.url || '';
                var method = this.method || 'post';
                var name = this.paramName || 'file';
                template.find('.fallbackUploadForm').attr({'action': action, 'method': method});
                template.find('.fileInput').attr({'name': name});
                template.removeClass('displayNone');
                template.prependTo(dropZoneContainer);
            },
            init: function() {
                var actionsTemplate = $('.actionsTemplate');
                actionsTemplate.removeClass('displayNone');
                actionsTemplate.prependTo(dropZoneContainer);

                this.on("addedfile", function(file) {
                    // Hookup the start button
                    file.previewElement.querySelector(".start").onclick = function() { myDropzone.enqueueFile(file); };
                });

                // Update the total progress bar
                this.on("totaluploadprogress", function(progress) {
                    document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
                });

                this.on("sending", function(file) {
                    // Show the total progress bar when upload starts
                    document.querySelector("#total-progress").style.opacity = "1";
                    // And disable the start button
                    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
                });

                // Hide the total progress bar when nothing's uploading anymore
                this.on("queuecomplete", function(progress) {
                    document.querySelector("#total-progress").style.opacity = "0";
                });

                this.on("successmultiple", function(a,insertedFiles) {
                    document.location.href = '/songs/edit?sne=true&id=' + insertedFiles[0].id;
                });
            }
        });

        // Setup the buttons for all transfers
        // The "add files" button doesn't need to be setup because the config
        // `clickable` has already been specified.
        document.querySelector("#actions .start").onclick = function() {
            myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
        };
        document.querySelector("#actions .cancel").onclick = function() {
            myDropzone.removeAllFiles(true);
        };
    }
});