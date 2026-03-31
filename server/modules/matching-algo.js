import { retrieveAllUserMatchData, retrieveOneUser } from "./data.js";

/* ===============================
MAIN MATCH FUNCTION
=============================== */

const getMatchScores = async (email) => {
  const allUsers = await retrieveAllUserMatchData();
  const currentUser = await retrieveOneUser(email);

  let matches = [];

  for (let u of allUsers) {
    const score = calculateScore(currentUser, u);

    if (score > 0) {
      const mutual = isMutualMatch(currentUser, u);

      matches.push({
        u1_email: currentUser.email,
        u2_email: u.email,
        compatibility_score: score,
        mutualMatch: mutual
      });
    }
  }

  matches.sort(compareMatchScores);

  return matches;
};

/* ===============================
SORT
=============================== */

const compareMatchScores = (a, b) =>
  b.compatibility_score - a.compatibility_score;

/* ===============================
SCORE LOGIC
=============================== */

const calculateScore = (u1, u2) => {
  if (u1.email === u2.email) return -1;

  if (
    (u1.preference === "Love" && u2.preference === "Friendship") ||
    (u1.preference === "Friendship" && u2.preference === "Love")
  ) return -1;

  if (
    !genderCompatible(u1.gender, u2.matchGender) ||
    !genderCompatible(u2.gender, u1.matchGender)
  ) return -1;

  if (!u1.skillsOwned || !u1.skillsWanted || !u2.skillsOwned || !u2.skillsWanted)
    return -1;

  return (
    skillsMatch(u1.skillsOwned, u2.skillsWanted) +
    skillsMatch(u2.skillsOwned, u1.skillsWanted)
  );
};

/* ===============================
MUTUAL MATCH
=============================== */

const isMutualMatch = (u1, u2) =>
  calculateScore(u1, u2) > 0 && calculateScore(u2, u1) > 0;

/* ===============================
GENDER CHECK
=============================== */

const genderCompatible = (gender, matchGender) => {
  if (matchGender === "Anyone") return true;
  return gender === matchGender;
};

/* ===============================
SKILLS MATCH
=============================== */

const skillsMatch = (owned, wanted) => {
  let score = 0;

  for (let i of owned) {
    for (let j of wanted) {
      if (i === j) score++;
    }
  }

  return score;
};

export { getMatchScores };