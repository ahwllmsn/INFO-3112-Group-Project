import { retrieveAllUserMatchData, retrieveOneUser } from "./data.js";

const getMatchScores = async (email) => {
    let userData = await retrieveAllUserMatchData();
    let currentUser = await retrieveOneUser(email);

    let matches = [];

    for(let u of userData) {
        let score = calculateScore(currentUser, u);
        if (score > 0) {
            let match = {"u1_email":currentUser.email, "u2_email":u.email, "compatibility_score": score};
            matches.push(match);
        } 
    }
    // Sort array of matches in descending order (highest match score first).
    matches.sort(compareMatchScores);
    console.log(`Retrieved ${matches.length} potential matches for user ${email}.`);
    return matches;
}

const compareMatchScores = (u1, u2) => {
    if (u1.compatibility_score > u2.compatibility_score) {
        return -1;
    } else if (u1.compatibility_score < u2.compatibility_score) {
        return 1;
    }
    return 0;
}   

const calculateScore = (u1, u2) => {
    // Cannot match with self.
    if (u1.email == u2.email) {
        return -1;
    }
    // Incompatible if both not looking for same thing (friendship vs love).
    else if ((u1.preference == "Friendship" && u2.preference == "Love") || (u1.preference == "Love" && u2.preference == "Friendship")) {
        return -1;
    }
    // Gender incompatible - e.g. looking for female, but other user is male.
    else if (!(genderCompatible(u1.gender, u2.matchGender) && genderCompatible(u2.gender, u1.matchGender))) {
        return -1;
        
    }
    else if (u1.skillsOwned == null || u1.skillsWanted == null || u2.skillsOwned == null || u2.skillsWanted == null) {
        return -1;
    }
    let score = skillsCompatible(u1.skillsOwned, u2.skillsWanted) + skillsCompatible(u2.skillsOwned, u1.skillsWanted);
    return score;
}

const genderCompatible = (gender, matchGender) => {
    if (gender == "Female") {
        return matchGender == "Anyone" || matchGender == "Female";
    } else if (gender == "Male") {
        return matchGender == "Anyone" || matchGender == "Male";
    } else if (gender == "Other") {
        return matchGender == "Anyone" || matchGender == "Other";
    }
}

const skillsCompatible = (owned, wanted) => {
    let score = 0;

    for (let i = 0; i < owned.length; i++) {
        for (let j = 0; j < wanted.length; j++) {
            if (owned[i] == wanted[j]) {
                score++;
            }
        }
    }   
    return score;
}

export {
    getMatchScores
}