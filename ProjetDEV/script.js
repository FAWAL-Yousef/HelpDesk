// ── Données ──────────────────────────────────────────────────────────────────

const contacts = [
  {
    id: 1,
    prenom: "Camille",
    nom: "Aubert",
    role: "Directrice RH",
    tel: "+33 6 12 34 56 78",
    email: "camille.aubert@exemple.fr",
    adresse: "12 rue des Lilas, 75010 Paris",
    color: "purple"
  },
  {
    id: 2,
    prenom: "Lucas",
    nom: "Bernard",
    role: "Développeur senior",
    tel: "+33 6 23 45 67 89",
    email: "lucas.bernard@exemple.fr",
    adresse: "4 impasse du Moulin, 69003 Lyon",
    color: "teal"
  },
  {
    id: 3,
    prenom: "Sophie",
    nom: "Clément",
    role: "Responsable marketing",
    tel: "+33 6 34 56 78 90",
    email: "sophie.clement@exemple.fr",
    adresse: "8 boulevard Haussmann, 75009 Paris",
    color: "coral"
  },
  {
    id: 4,
    prenom: "Marc",
    nom: "Dupont",
    role: "Comptable",
    tel: "+33 6 45 67 89 01",
    email: "marc.dupont@exemple.fr",
    adresse: "22 avenue de la Gare, 31000 Toulouse",
    color: "blue"
  },
  {
    id: 5,
    prenom: "Julie",
    nom: "Moreau",
    role: "Chef de projet",
    tel: "+33 6 56 78 90 12",
    email: "julie.moreau@exemple.fr",
    adresse: "3 place Bellecour, 69002 Lyon",
    color: "pink"
  },
  {
    id: 6,
    prenom: "Thomas",
    nom: "Simon",
    role: "Designer UX",
    tel: "+33 6 67 89 01 23",
    email: "thomas.simon@exemple.fr",
    adresse: "17 rue Sainte-Catherine, 33000 Bordeaux",
    color: "amber"
  }
];

// ── Couleurs par rôle ─────────────────────────────────────────────────────────

const colors = {
  purple: { bg: "var(--purple-bg)", txt: "var(--purple-txt)" },
  teal:   { bg: "var(--teal-bg)",   txt: "var(--teal-txt)"   },
  coral:  { bg: "var(--coral-bg)",  txt: "var(--coral-txt)"  },
  blue:   { bg: "var(--blue-bg)",   txt: "var(--blue-txt)"   },
  pink:   { bg: "var(--pink-bg)",   txt: "var(--pink-txt)"   },
  amber:  { bg: "var(--amber-bg)",  txt: "var(--amber-txt)"  }
};

// ── Icônes SVG ────────────────────────────────────────────────────────────────

const icons = {
  tel: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.64 5.18 2 2 0 0 1 6.64 3h3a2 2 0 0 1 2 1.72c.13 1 .37 1.97.7 2.9a2 2 0 0 1-.45 2.11L10.91 10.91A16 16 0 0 0 13.09 13.09l.98-.98a2 2 0 0 1 2.11-.45c.93.33 1.9.57 2.9.7A2 2 0 0 1 21 14.44"/>
  </svg>`,
  email: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>`,
  adresse: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>`
};

// ── État ──────────────────────────────────────────────────────────────────────

let activeId = null;

contacts.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

// ── Utilitaires ───────────────────────────────────────────────────────────────

function initials(c) {
  return c.prenom[0] + c.nom[0];
}

// ── Rendu ─────────────────────────────────────────────────────────────────────

function render(list) {
  const dir = document.getElementById("directory");
  document.getElementById("count").textContent =
    list.length + " contact" + (list.length > 1 ? "s" : "");

  dir.innerHTML = "";

  if (!list.length) {
    dir.innerHTML = '<div class="no-result">Aucun résultat trouvé.</div>';
    return;
  }

  let currentLetter = "";

  list.forEach(c => {
    const letter = c.nom[0].toUpperCase();

    // Séparateur alphabétique
    if (letter !== currentLetter) {
      currentLetter = letter;
      const sep = document.createElement("div");
      sep.className = "letter-sep";
      sep.textContent = letter;
      dir.appendChild(sep);
    }

    const col = colors[c.color];
    const isActive = c.id === activeId;

    // Ligne de la personne
    const row = document.createElement("div");
    row.className = "person-row" + (isActive ? " active" : "");
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.innerHTML = `
      <div class="avatar" style="background:${col.bg}; color:${col.txt}">${initials(c)}</div>
      <div class="person-info">
        <div class="person-name">${c.prenom} ${c.nom}</div>
        <div class="person-role">${c.role}</div>
      </div>
      <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    `;
    row.addEventListener("click", () => toggle(c.id));
    row.addEventListener("keydown", e => { if (e.key === "Enter") toggle(c.id); });
    dir.appendChild(row);

    // Panneau de détail
    const wrap = document.createElement("div");
    wrap.className = "detail-wrap" + (isActive ? " open" : "");
    wrap.id = "detail-" + c.id;
    wrap.innerHTML = `
      <div class="detail-card">
        <div class="detail-top">
          <div class="detail-avatar" style="background:${col.bg}; color:${col.txt}">${initials(c)}</div>
          <div>
            <div class="detail-fullname">${c.prenom} ${c.nom}</div>
            <div class="detail-role">${c.role}</div>
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <div class="field-icon">${icons.tel}</div>
            <div>
              <div class="field-label">Téléphone</div>
              <div class="field-value">${c.tel}</div>
            </div>
          </div>
          <div class="field">
            <div class="field-icon">${icons.email}</div>
            <div>
              <div class="field-label">Email</div>
              <div class="field-value"><a href="mailto:${c.email}">${c.email}</a></div>
            </div>
          </div>
          <div class="field">
            <div class="field-icon">${icons.adresse}</div>
            <div>
              <div class="field-label">Adresse</div>
              <div class="field-value">${c.adresse}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    dir.appendChild(wrap);
  });
}

// ── Toggle détail ─────────────────────────────────────────────────────────────

function toggle(id) {
  activeId = (activeId === id) ? null : id;

  const q = document.getElementById("search").value.toLowerCase();
  const filtered = contacts.filter(c =>
    (c.prenom + " " + c.nom + " " + c.role).toLowerCase().includes(q)
  );

  render(filtered);

  if (activeId) {
    const el = document.getElementById("detail-" + activeId);
    setTimeout(() => el && el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }
}

// ── Recherche ─────────────────────────────────────────────────────────────────

document.getElementById("search").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = contacts.filter(c =>
    (c.prenom + " " + c.nom + " " + c.role).toLowerCase().includes(q)
  );
  if (activeId && !filtered.find(c => c.id === activeId)) activeId = null;
  render(filtered);
});

// ── Initialisation ────────────────────────────────────────────────────────────

render(contacts);
