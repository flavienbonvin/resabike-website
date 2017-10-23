$(document).ready(() => {
    $('select.dropdown').dropdown();
    updateMenu();
})


function updateMenu(){
    $('#Adminmenu .item').removeClass("active item");
    
    document.getElementById('Adminmenu').children[noOnglet].setAttribute('class', 'active item');
}