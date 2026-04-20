document.querySelectorAll(".nom").forEach(el => {
  el.addEventListener("click", function () {

    let texte = this.textContent.toLowerCase().trim();
    let parties = texte.split(/\s+/);

    let nom = parties.pop();
    let prenoms = parties.join("-");

    let domaine = this.classList.contains("prof")
      ? "@ube.fr"
      : "@etu.ube.fr";

    let email = prenoms 
      ? `${prenoms}_${nom}${domaine}`
      : `${nom}${domaine}`;

    // ✅ On vide avant d'ajouter (clé du comportement)
    let container = document.getElementById("contact");
    container.innerHTML = "";

    let div = document.createElement("div");
    div.className = "contact";

    div.innerHTML = `
        <strong>${this.textContent}</strong>
        ${email}
    `;

    container.appendChild(div);
  });
});