    $('a').click(function(){
        $('a').removeClass("active item");
        $('a').addClass("item");
        $(this).addClass("active item");
    })