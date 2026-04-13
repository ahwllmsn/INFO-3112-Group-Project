import { statistics } from "./util/api.js";

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");

// Sidebar
function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

menuBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "index.html";
});

// Summary cards
const totalUsers = document.getElementById("totalUsers");
const totalMatches = document.getElementById("totalMatches");
const communicationExposed = document.getElementById("communicationExposed");
const avgRating = document.getElementById("avgRating");
const avgCompatibility = document.getElementById("avgCompatibility");

// Main containers
const textSummary = document.getElementById("textSummary");
const accountTypeChart = document.getElementById("accountTypeChart");
const accountTypeLegend = document.getElementById("accountTypeLegend");
const preferenceChart = document.getElementById("preferenceChart");
const preferenceLegend = document.getElementById("preferenceLegend");
const genderBars = document.getElementById("genderBars");
const ageBars = document.getElementById("ageBars");
const ratingBars = document.getElementById("ratingBars");
const ownedSkillsTable = document.getElementById("ownedSkillsTable");
const wantedSkillsTable = document.getElementById("wantedSkillsTable");

/* =========================
   LOAD DASHBOARD
========================= */
async function loadDashboard() {
  try {
    const data = await statistics.getAppStatistics();

    if (!data) {
      showError();
      return;
    }

    const userStats = data.userStatistics || {};
    const matchStats = data.matchStatistics || {};

    // Convert average compatibility score X/6 -> X/5.
    matchStats.averageCompatibilityScore = convertCompatibility6to5(matchStats.averageCompatibilityScore);

    renderSummaryCards(userStats, matchStats);
    renderTextSummary(userStats, matchStats);
    renderDonutChart(
      accountTypeChart,
      accountTypeLegend,
      userStats.accountTypesCount || {},
      ["Paid Users", "Free Users"],
      ["paidUserCount", "freeUserCount"],
      ["#2563eb", "#7c3aed"],
      "Accounts"
    );

    renderDonutChart(
      preferenceChart,
      preferenceLegend,
      userStats.preferenceTypesCount || {},
      ["Love", "Friendship"],
      ["seekingLoveCount", "seekingFriendshipCount"],
      ["#db2777", "#60a5fa"],
      "Looking For"
    );

    renderBarChart(
      genderBars,
      [
        { label: "Male", value: userStats.userGenderCounts?.maleUsersCount || 0 },
        { label: "Female", value: userStats.userGenderCounts?.femaleUsersCount || 0 },
        { label: "Other", value: userStats.userGenderCounts?.otherGenderUsersCount || 0 }
      ]
    );

    renderBarChart(
      ageBars,
      [
        { label: "18 - 24", value: userStats.ageRangeCounts?.age18to24 || 0 },
        { label: "25 - 34", value: userStats.ageRangeCounts?.age25to34 || 0 },
        { label: "35 - 44", value: userStats.ageRangeCounts?.age35to44 || 0 },
        { label: "45 - 54", value: userStats.ageRangeCounts?.age45to54 || 0 },
        { label: "55 - 64", value: userStats.ageRangeCounts?.age55to64 || 0 },
        { label: "65+", value: userStats.ageRangeCounts?.age65plus || 0 }
      ]
    );

    renderBarChart(
      ratingBars,
      [
        { label: "1 Star", value: matchStats.starRatingCounts?.star1 || 0 },
        { label: "2 Stars", value: matchStats.starRatingCounts?.star2 || 0 },
        { label: "3 Stars", value: matchStats.starRatingCounts?.star3 || 0 },
        { label: "4 Stars", value: matchStats.starRatingCounts?.star4 || 0 },
        { label: "5 Stars", value: matchStats.starRatingCounts?.star5 || 0 }
      ]
    );

    renderSkillsTable(
      ownedSkillsTable,
      userStats.skillsOwnedCount || {},
      "Users With Skill"
    );

    renderSkillsTable(
      wantedSkillsTable,
      userStats.skillsWantedCount || {},
      "Users Wanting Skill"
    );

    document.getElementById("heading-status-text").innerHTML = "Live App Stats";

  } catch (error) {
    console.error("Dashboard error:", error);
    showError();
  }
}

// Since compatibility score is X/6, and match rating is X/5,
// we should convert compatibility score to be out of 5 so we can accurately compare these numbers.
const convertCompatibility6to5 = (compatibility_score) => {
  return (compatibility_score / 6) * 5;
}

/* =========================
   SUMMARY
========================= */
function renderSummaryCards(userStats, matchStats) {
  totalUsers.textContent = userStats.totalUserCount ?? 0;
  totalMatches.textContent = matchStats.totalMatchCount ?? 0;
  communicationExposed.textContent = matchStats.communicationExposedCount ?? 0;
  avgRating.textContent = formatNumber(matchStats.averageStarRating);
  avgCompatibility.textContent = formatNumber(matchStats.averageCompatibilityScore);
}

function renderTextSummary(userStats, matchStats) {
  const paidCount = userStats.accountTypesCount?.paidUserCount || 0;
  const freeCount = userStats.accountTypesCount?.freeUserCount || 0;

  const loveCount = userStats.preferenceTypesCount?.seekingLoveCount || 0;
  const friendshipCount = userStats.preferenceTypesCount?.seekingFriendshipCount || 0;

  const topOwned = getTopEntry(userStats.skillsOwnedCount || {});
  const topWanted = getTopEntry(userStats.skillsWantedCount || {});

  textSummary.innerHTML = `
    <p>
      The platform currently has <strong>${userStats.totalUserCount ?? 0}</strong> users and
      <strong>${matchStats.totalMatchCount ?? 0}</strong> recorded matches.
    </p>
    <p>
      The account mix is <strong>${paidCount}</strong> paid users and
      <strong>${freeCount}</strong> free users.
    </p>
    <p>
      Preference trends show <strong>${loveCount}</strong> users seeking love and
      <strong>${friendshipCount}</strong> users seeking friendship.
    </p>
    <p>
      The most common owned skill is <strong>${topOwned.label}</strong> (${topOwned.value}),
      while the most wanted skill is <strong>${topWanted.label}</strong> (${topWanted.value}).
    </p>
    <p>
      Users have exposed communication in <strong>${matchStats.communicationExposedCount ?? 0}</strong> matches.
      Average rating is <strong>${formatNumber(matchStats.averageStarRating)}</strong>/5, and
      average compatibility is <strong>${formatNumber(matchStats.averageCompatibilityScore)}</strong>/5.
    </p>
  `;
}

/* =========================
   DONUT CHART
========================= */
function renderDonutChart(container, legendContainer, source, labels, keys, colors, centerText) {
  const values = keys.map(key => Number(source[key] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    container.style.background = "#334155";
    container.innerHTML = `<div class="donut-center">No Data</div>`;
    legendContainer.innerHTML = "";
    return;
  }

  let current = 0;
  const stops = values.map((value, index) => {
    const start = (current / total) * 360;
    current += value;
    const end = (current / total) * 360;
    return `${colors[index]} ${start}deg ${end}deg`;
  });

  container.style.background = `conic-gradient(${stops.join(", ")})`;
  container.innerHTML = `<div class="donut-center">${centerText}<br>${total}</div>`;

  legendContainer.innerHTML = labels.map((label, index) => `
    <div class="legend-item">
      <span class="legend-color" style="background:${colors[index]}"></span>
      <span>${label}: ${values[index]}</span>
    </div>
  `).join("");
}

/* =========================
   BAR CHART
========================= */
function renderBarChart(container, items) {
  const maxValue = Math.max(...items.map(item => item.value), 1);

  container.innerHTML = items.map(item => {
    const width = (item.value / maxValue) * 100;

    return `
      <div class="bar-item">
        <div class="bar-top">
          <span>${item.label}</span>
          <span>${item.value}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${width}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

/* =========================
   TABLE
========================= */
function renderSkillsTable(container, source, countHeading) {
  const rows = Object.entries(source)
    .map(([label, value]) => ({ label: formatSkillLabel(label), value: Number(value || 0) }))
    .sort((a, b) => b.value - a.value);

  container.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Skill</th>
          <th>${countHeading}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, index) => `
          <tr>
            <td><span class="rank-badge">${index + 1}</span></td>
            <td>${row.label}</td>
            <td>${row.value}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

/* =========================
   HELPERS
========================= */
function formatNumber(value) {
  if (value == null || Number.isNaN(value)) {
    return "0.00";
  }
  return Number(value).toFixed(2);
}

function getTopEntry(source) {
  const entries = Object.entries(source).map(([label, value]) => ({
    label: formatSkillLabel(label),
    value: Number(value || 0)
  }));

  if (!entries.length) {
    return { label: "N/A", value: 0 };
  }

  entries.sort((a, b) => b.value - a.value);
  return entries[0];
}

function formatSkillLabel(label) {
  const map = {
    javaScript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    react: "React",
    nodeJS: "Node.js"
  };

  return map[label] || label;
}

function showError() {
  textSummary.textContent = "Could not load dashboard statistics.";
}

loadDashboard();