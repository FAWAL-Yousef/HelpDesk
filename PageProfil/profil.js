
function toggleHistory() {
    var content = document.getElementById("history-content");
    var arrow = document.getElementById("arrow");

    if(content.style.display === "block") {
        content.style.display = "none";
        arrow.innerHTML= " <> ";
    } else {
        content.style.display = "block";
        arrow.innerHTML = " >< ";
    }
}


//pour la modification du profil
function toggleEditForm() {
    var form = document.getElementById("container-form");
    if(form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}