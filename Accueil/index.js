/* ══════════════════════════════════════════════════════════════
   accueil.js — Scripts de la page d'accueil HelpDesk
══════════════════════════════════════════════════════════════ */

/*  SCROLL REVEAL
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // on n'observe plus une fois visible
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll(".appear").forEach((el) => revealObserver.observe(el));

/*  COMPTEURS ANIMÉS
   */

/**
 * Anime un compteur de 0 à `target` en `duration` ms
 * @param {HTMLElement} el      - L'élément dont le texte sera mis à jour
 * @param {number}      target  - Valeur finale
 * @param {number}      duration - Durée de l'animation en ms
 */
function animateCounter(el, target, duration = 1400) {
  let currentValue = 0;
  const increment = target / (duration / 16); // ~60fps

  const tick = () => {
    currentValue += increment;
    if (currentValue < target) {
      el.textContent = Math.floor(currentValue);
      requestAnimationFrame(tick);
    } else {
      el.textContent = target; 
    }
  };

  tick();
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);

      animateCounter(el, target);
      counterObserver.unobserve(el); // déclenché une et une  seule fois
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-target]").forEach((el) =>
  counterObserver.observe(el)
);

/*  ACCORDÉON FAQ
    */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const clickedItem = btn.closest(".faq-item");
    const isAlreadyOpen = clickedItem.classList.contains("open");

    // Ferme tous les items ouverts
    document.querySelectorAll(".faq-item.open").forEach((item) => {
      item.classList.remove("open");
    });

    // Ouvre l'item cliqué s'il n'était pas déjà ouvert
    if (!isAlreadyOpen) {
      clickedItem.classList.add("open");
    }
  });
});
