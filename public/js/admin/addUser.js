$(document).ready(() => {
    $('select.dropdown').dropdown();
    getAllZone();
    setRole();
})
function getAllZone() {
    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        success: (res) => {
            var txt = '<option value="">Zone</option>';
            console.log(res)
            for (var i in res) {
                txt += '<option value="' + res[i].id + '">' + res[i].name + '</option>';
            }
            document.getElementById("zoneDropdown").innerHTML = txt;
            $('select.dropdown').dropdown();
            if (userInfoEditZone != "") {
                document.getElementById('zoneDropdown').value = Number(userInfoEditZone)
            }
        }
    })
}

function controlForm(e) {
    var validate = true;
    if (document.getElementById('role').value == "") {
        document.getElementById('role').parentNode.style.borderColor = 'red';
        validate = false;
    }
    if (document.getElementById('username').value.length < 6) {
        document.getElementById('username').style.borderColor = 'red';
        validate = false;
    }
    if (document.getElementById('idUser').value == "") {
        if (document.getElementById('password').value.length < 6) {
            document.getElementById('password').style.borderColor = 'red';
            validate = false;
        }
        if (document.getElementById('password').value != document.getElementById('passwordConfirmation').value) {
            document.getElementById('passwordConfirmation').style.borderColor = 'red';
            validate = false;
        }
    }
    if (document.getElementById('email').value.length > 1) {
        if (document.getElementById('email').value.indexOf('@') == -1 || document.getElementById('email').value.indexOf('.') == -1) {
            document.getElementById('email').style.borderColor = 'red';
            validate = false;
        }
    }
    if (document.getElementById('zoneDropdown').value == "" && document.getElementById('role').value != '3') {
        document.getElementById('zoneDropdown').parentNode.style.borderColor = 'red';
        validate = false;
    }
    if (!validate) {
        e.preventDefault();
    }
}
function updateInput(t) {
    t.style.borderColor = 'rgba(34, 36, 38, 0.15)';
}
function updateSelect(t) {
    if (t.id == 'role') {
        if (t.value == "3") {
            $("#zoneContent").hide();
        } else {
            $("#zoneContent").show();
        }
    }
    t.parentNode.style.borderColor = 'rgba(34, 36, 38, 0.15)';
}
function checkChangePass(t) {
    if (document.getElementById('password').value == t.value) {
        t.style.borderColor = 'green';
    } else {
        t.style.borderColor = 'rgba(34, 36, 38, 0.15)';
    }
}

function setRole() {
    setTimeout(function () {
        if (userInfoEditRole != "") {
            document.getElementById('role').value = Number(userInfoEditRole);
        }
    }, 300)

}