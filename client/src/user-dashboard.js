import * as api from './util/api.js';

const totalUsers = document.getElementById("totalUsers");
const totalMatches = document.getElementById("totalMatches");
const averageRating = document.getElementById("averageRating");
const contactShared = document.getElementById("contactShared");
const compatibility = document.getElementById("compatibility");

async function loadDashboard() {

try {

const stats = await api.statistics.getAppStatistics();

console.log("Stats:", stats);

totalUsers.textContent =
stats.userStatistics.totalUserCount;

totalMatches.textContent =
stats.matchStatistics.totalMatchCount;

averageRating.textContent =
stats.matchStatistics.averageStarRating.toFixed(1);

contactShared.textContent =
stats.matchStatistics.communicationExposedCount;

compatibility.textContent =
stats.matchStatistics.averageCompatibilityScore.toFixed(1);

} catch (error) {

console.error("Dashboard error:", error);

totalUsers.textContent = "Error";
totalMatches.textContent = "Error";
averageRating.textContent = "Error";
contactShared.textContent = "Error";
compatibility.textContent = "Error";

}

}

loadDashboard();