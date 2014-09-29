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
});