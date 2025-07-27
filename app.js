/* ================================
   FAKE NEWS ENGINE + TEMPESTA AI™
   ================================ */

const articles = [
  {
    title: "Volcano Erupts in Downtown Paris",
    summary:
      "A surprise volcanic eruption in the heart of Paris has left tourists covered in lava and croissants. Authorities urge citizens to avoid the Eiffel Tower crater.",
    date: "July 24, 2025",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Hurricane_Florence_seen_from_the_International_Space_Station_%2844028434444%29.jpg/960px-Hurricane_Florence_seen_from_the_International_Space_Station_%2844028434444%29.jpg"
  },
  {
    title: "Tornado Lifts Entire Town, Residents Unharmed",
    summary:
      "The town of Breezefield was lifted 300 feet into the air by a tornado and gently set down in a neighboring county. Locals are calling it 'the most exciting commute ever.'",
    date: "July 23, 2025",
    image:
      "https://media.khou.com/assets/KHOU/images/7b1e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/7b1e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e_1140x641.jpg"
  },
  {
    title: "Snowstorm Hits Sahara Desert",
    summary:
      "Meteorologists are baffled as a record-breaking snowstorm blankets the Sahara, giving camels a rare chance to build snowmen.",
    date: "July 22, 2025",
    image: "image.png"
  },
  {
    title: "Rain of Frogs Delays Soccer Finals",
    summary:
      "A sudden downpour of frogs has postponed the much-anticipated soccer finals. Players and fans are advised to bring umbrellas and buckets.",
    date: "July 21, 2025",
    image: "image copy.png"
  }
];

const PLACEHOLDER = "https://placehold.co/800x450?text=No+Image";
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

/* -------- utils -------- */

function normalizeArticles(list) {
  return [...list]
    .map(a => {
      const d = new Date(a.date);
      return {
        ...a,
        _date: isNaN(d) ? new Date() : d,
        id: a.title.toLowerCase().replace(/[^\w]+/g, "-"),
        image: a.image && a.image.startsWith("http") ? a.image : PLACEHOLDER
      };
    })
    .sort((a, b) => b._date - a._date);
}

const data = normalizeArticles(articles);

/* -------- rendering -------- */

function renderMainArticle(article = data[0]) {
  const mainStory = document.querySelector(".main-story");
  if (!mainStory) return;

  mainStory.innerHTML = `
    <img src="${article.image}" alt="${article.title}" class="main-image" loading="eager"
         onerror="this.src='${PLACEHOLDER}'" />
    <h1 class="main-title">${article.title}</h1>
    <p><em><time datetime="${article._date.toISOString()}">
      ${dateFmt.format(article._date)}
    </time></em></p>
    <p>${article.summary}</p>
  `;
}

function renderArticlesSidebar() {
  const sidebar = document.getElementById("sidebar-articles");
  if (!sidebar) return;

  sidebar.innerHTML = data
    .slice(1)
    .map(
      article => `
      <article class="sidebar-article" data-id="${article.id}">
        <img src="${article.image}" alt="${article.title}" class="sidebar-thumb" loading="lazy"
             onerror="this.src='${PLACEHOLDER}'" />
        <h4>${article.title}</h4>
        <p><em><time datetime="${article._date.toISOString()}">
          ${dateFmt.format(article._date)}
        </time></em></p>
        <p>${article.summary}</p>
      </article>
    `
    )
    .join("");
}

function wireSidebarClicks() {
  const sidebar = document.getElementById("sidebar-articles");
  if (!sidebar) return;

  sidebar.addEventListener("click", e => {
    const card = e.target.closest(".sidebar-article");
    if (!card) return;
    const id = card.dataset.id;
    const article = data.find(a => a.id === id);
    if (article) {
      // clear any previous TEMPESTA highlights before swapping article
      clearTempestaScan();
      renderMainArticle(article);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/* -------- TEMPESTA AI™ (pure satire) -------- */

const labelMap = {
  green: "🟢 Verified by TEMPESTA*",
  yellow: "🟡 Possibly True-ish",
  red: "🔴 Certified Nonsense"
};

function splitIntoSentences(text) {
  // naive but fun
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
}

function randomTruthLevel() {
  const levels = ["green", "yellow", "red"];
  return levels[Math.floor(Math.random() * levels.length)];
}

function runTempestaScan() {
  const story = document.querySelector(".main-story");
  if (!story) return;

  const paragraphs = story.querySelectorAll("p");
  paragraphs.forEach(p => {
    // save original plain text once
    if (!p.dataset.original) {
      p.dataset.original = p.textContent;
    }

    const sentences = splitIntoSentences(p.dataset.original);
    const newHTML = sentences
      .map(s => {
        const level = randomTruthLevel();
        return `<span class="${level}" data-label="${labelMap[level]}">${s}</span>`;
      })
      .join(" ");

    p.innerHTML = newHTML;
    p.classList.add("truthy-scan");
  });
}

function clearTempestaScan() {
  const story = document.querySelector(".main-story");
  if (!story) return;
  const paragraphs = story.querySelectorAll("p.truthy-scan");
  paragraphs.forEach(p => {
    if (p.dataset.original) {
      p.textContent = p.dataset.original;
    }
    p.classList.remove("truthy-scan");
  });
}

function toggleTempestaPanel() {
  const panel = document.getElementById("tempesta-panel");
  if (!panel) return;

  panel.classList.toggle("open");

  // Every time you open, re-randomize the chaos.
  if (panel.classList.contains("open")) {
    clearTempestaScan();
    runTempestaScan();
  } else {
    clearTempestaScan();
  }
}

/* -------- boot -------- */

document.addEventListener("DOMContentLoaded", () => {
  renderMainArticle();
  renderArticlesSidebar();
  wireSidebarClicks();

  const tempestaBtn = document.getElementById("tempesta-toggle");
  if (tempestaBtn) {
    tempestaBtn.addEventListener("click", toggleTempestaPanel);
  }

  // close with ESC
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const panel = document.getElementById("tempesta-panel");
      if (panel && panel.classList.contains("open")) {
        toggleTempestaPanel();
      }
    }
  });
});
