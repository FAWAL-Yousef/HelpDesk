const DEMO_TICKETS = [
  { id: 1, titre: "Difficulté sur l'héritage en PHP", auteur: "Alice M.", categorie: "Cours", priorite: "Haute",   statut: "Ouvert",   date: "2026-04-14" },
  { id: 2, titre: "Erreur segmentation en C avec les pointeurs", auteur: "Bob K.", categorie: "TP", priorite: "Haute", statut: "En cours", date: "2026-04-13" },
  { id: 3, titre: "Exercice 4 du TD3 incompris", auteur: "Clara D.", categorie: "TD", priorite: "Moyenne", statut: "Ouvert",   date: "2026-04-13" },
  { id: 4, titre: "Différence entre JOIN et LEFT JOIN",  auteur: "David R.", categorie: "Cours", priorite: "Basse",  statut: "Résolu",   date: "2026-04-11" },
  { id: 5, titre: "Faire tourner Apache sur Windows",    auteur: "Emma S.", categorie: "TP", priorite: "Moyenne", statut: "En cours", date: "2026-04-10" },
  { id: 6, titre: "Récursivité — cas de base manquant ?", auteur: "Jean D.", categorie: "TD", priorite: "Basse",  statut: "Résolu",   date: "2026-04-09" },
];

const CURRENT_USER = { name: "Jean Dupont", role: "Étudiant", email: "j.dupont@etu.fr" };

let tickets = [...DEMO_TICKETS];
let filterStatus   = "tous";
let filterPriority = "tous";
let searchTerm     = "";

function init() {
  const initials = CURRENT_USER.name.split(" ").map(n => n[0]).join("").toUpperCase();
  document.getElementById("user-avatar").textContent = initials;
  document.getElementById("user-display-name").textContent = CURRENT_USER.name;
  document.getElementById("role-badge").textContent = CURRENT_USER.role;
  renderTickets();
}

function renderTickets() {
  const list = document.getElementById("tickets-list");
  const filtered = getFiltered();

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <h3>Aucun ticket trouvé</h3>
        <p>Modifiez vos filtres ou créez un nouveau ticket.</p>
        <a href="creationticket.html" class="btn btn-primary btn-sm">Créer un ticket</a>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(ticket => {
    const statusClass = ticket.statut === "Ouvert" ? "status-ouvert"
                      : ticket.statut === "En cours" ? "status-en-cours"
                      : "status-resolu";
    const prioClass = ticket.priorite.toLowerCase();
    const date = formatDate(ticket.date);

    return `
      <a href="ticket.php?id=${ticket.id}" class="ticket-card">
        <div class="ticket-prio-bar prio-${prioClass}"></div>
        <div class="ticket-body">
          <div class="ticket-meta">
            <span class="cat-badge">${ticket.categorie}</span>
            <span class="status-badge ${statusClass}">${ticket.statut}</span>
          </div>
          <div class="ticket-title">${ticket.titre}</div>
          <div class="ticket-author">Par ${ticket.auteur}</div>
        </div>
        <div class="ticket-right">
          <span class="prio-badge ${prioClass}">${ticket.priorite}</span>
          <span class="ticket-date">${date}</span>
        </div>
      </a>`;
  }).join("");
}

function getFiltered() {
  return tickets.filter(t => {
    const matchStatus   = filterStatus   === "tous" || t.statut   === filterStatus;
    const matchPriority = filterPriority === "tous" || t.priorite === filterPriority;
    const matchSearch   = !searchTerm    || t.titre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });
}

document.getElementById("filter-status").addEventListener("click", e => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll("#filter-status .filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  filterStatus = chip.dataset.value;
  renderTickets();
});

document.getElementById("filter-priority").addEventListener("click", e => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll("#filter-priority .filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  filterPriority = chip.dataset.value;
  renderTickets();
});

document.getElementById("search-input").addEventListener("input", e => {
  searchTerm = e.target.value;
  renderTickets();
});

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7)  return `Il y a ${diff} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

init();
