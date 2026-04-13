/* =========================
   CREATE MATCH CARD
========================= */
const matchScoreWord = (score) => {
  switch (score) {
    case 6:
      return "Excellent";
    case 5:
      return "Strong";
    case 4:
      return "Great";
    case 3: 
      return "Good";
    case 2:
      return "Okay";
    default:
    return "Fair";
  }
}

export {
    matchScoreWord
}