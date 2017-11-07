$(document).ready(() => {
    $('select.dropdown').dropdown();
    updateMenu();
})


function updateMenu() {
    $('#Adminmenu .item').removeClass("active");
    if (document.getElementById('Adminmenu').children[noOnglet].attributes['class'].value.indexOf('fixedSize') != -1) {
        if (document.getElementById('Adminmenu').children[noOnglet].attributes['class'].value.indexOf('dropdownContain') != -1) {
            document.getElementById('Adminmenu').children[noOnglet].setAttribute('class', 'active item fixedSize dropdownContain');
        } else {
            document.getElementById('Adminmenu').children[noOnglet].setAttribute('class', 'active item fixedSize');
        }
    } else {
        if (document.getElementById('Adminmenu').children[noOnglet].attributes['class'].value.indexOf('dropdownContain')  != -1) {
            document.getElementById('Adminmenu').children[noOnglet].setAttribute('class', 'active item dropdownContain');
        } else {
            document.getElementById('Adminmenu').children[noOnglet].setAttribute('class', 'active item');
        }

    }

}