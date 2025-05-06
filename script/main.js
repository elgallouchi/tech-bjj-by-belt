let currentData = [];
let currentBjjData = [];

const fetchData = async () => {
  try {
    const data = await fetch("../data.json");
    const bjjData = await fetch("../bjj-data.json");
    currentBjjData = await bjjData.json();
    currentData = await data.json();
  } catch (error) {
    console.log(error);
  }
};
const showData = async (belt = "") => {
  try {
    await fetchData();
    let output = "";
    const dom = document.getElementById("main");

    // Filtrer les données si un paramètre belt est spécifié
    const filteredData = (await belt)
      ? { [belt]: currentBjjData[belt] || [] }
      : currentBjjData;

    for (const [ceinture, video] of Object.entries(filteredData)) {
      // Ne pas afficher si le tableau de vidéos est vide
      if (!video || video.length === 0) continue;

      await video.forEach((el) => {
        output += `
            <div class="card">
              <div class="${
                ceinture === "blanche"
                  ? "white-belt card-belt"
                  : ceinture === "bleue"
                  ? "bleue-belt card-belt"
                  : ceinture === "violette"
                  ? "purple-belt card-belt"
                  : ceinture === "marron"
                  ? "brown-belt card-belt"
                  : "black-belt card-belt"
              }">${ceinture}</div>
              <img
                class="card-img"
                src="${el?.thumbnail}" alt="${el.titre}"
              />
              <div class="card-footer">
                <h2 class="card-title">${el?.titre}</h2>
                <div class="card-categories">
        ${el?.categories
          ?.map((cat) =>
            cat.includes("Technique importante à maitriser") ||
            cat.includes("Blanche") ||
            cat.includes("Bleue") ||
            cat.includes("Violette") ||
            cat.includes("Marron") ||
            cat.includes("Noire") ||
            cat.includes("Avec vidéo en action")
              ? ``
              : `<span>${cat}, </span>`
          )
          .join(" ")}
      </div>
              </div>
            </div>
            `;
      });
    }

    dom.innerHTML = output || "<p>Aucune vidéo trouvée pour cette ceinture</p>";
  } catch (error) {
    dom.innerHTML = "<p>Erreur lors du chargement des données</p>";

    console.log(error);
  }
};
showData();

// Récupère le paramètre 'belt' de l'URL
const getBeltParam = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("belt") || "";
};

// Au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const beltParam = getBeltParam();
  showData(beltParam);
});

// Pour gérer les changements d'URL (boutons précédent/suivant)
window.addEventListener("popstate", () => {
  const beltParam = getBeltParam();
  showData(beltParam);
});
