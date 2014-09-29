if(typeof playListsPage !== 'undefined' && playListsPage){
    $(document).ready(function(){
        (function(){
            var loginForm = $('#login-form');

            loginForm.submit(function(e){
                var listName = $('#listName');
                if(!listName.val() || listName.val() == ''){
                    alertUser.setAlert('Please enter list name','error');
                    e.preventDefault();
                }
            })
        })();

    });
}