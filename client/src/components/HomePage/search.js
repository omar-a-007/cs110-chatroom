search.addEventListener("input", event => {
    if ((search.value != "" && !x_icon.classList.contains("show")) ||
        (search.value == "" && x_icon.classList.contains("show"))) {
        x_icon.classList.toggle("show");
    }
    
    var query = $.trim(search.value).toLowerCase();

    $('div.status').each(function(){
        var $this = $(this);

        if($this.find('.msg').text().toLowerCase().trim().indexOf(query) === -1)
            $this.fadeOut();
       else $this.fadeIn();
    });

    //console.log(query);
});