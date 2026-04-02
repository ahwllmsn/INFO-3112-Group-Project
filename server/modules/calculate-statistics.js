import * as data from './data.js';

// Global variables of data to aggregate.
let users = [];
let matches = [];

const getAllStatistics = async () => {
    // Get all user and match data.
    users = await data.retrieveAllUsers();
    matches = await data.retrieveAllMatches();

    // Object of all app statistics.
    const appStatistics = {
        userStatistics: {
            totalUserCount: users.length, // # all users.
            accountTypesCount: getAccountTypeCounts(), // # paid and free users.
            preferenceTypesCount: getPreferenceCounts(), // # seeking friendship vs love users.
            userGenderCounts: getGenderCounts(), // # users male, female, or other
            ageRangeCounts: getAgeRangeCounts(), // # users in age ranges 18-24, 25-34, 35-44, 45-54, 55-64, 65+
            skillsOwnedCount: getSkillsCount("skillsOwned"), // # of users who possess each skill
            skillsWantedCount: getSkillsCount("skillsWanted") // # of users want their match to have each skill
        },
        matchStatistics: {
            totalMatchCount: matches.length, // # all matches
            communicationExposedCount: getCommunicationExposedCount(), // # accounts that exposed communication w/ each other
        }
    }
    return appStatistics;
}

/*=============================
    USER CALCULATIONS
=============================*/

const filterUserCount = (userField, targetValue) => {
    const filteredUsers = users.filter(user => {
        if (user[userField]) {
            return user[userField] == targetValue;
        }
    });
    return filteredUsers.length;
}

const getAccountTypeCounts = () => {
    const paidAccounts = filterUserCount("accountType", "Paid");
    // Default or non-existent value for "accountType" is considered a "Free" user.
    return {paidUserCount: paidAccounts, freeUserCount: users.length - paidAccounts};
}

const getPreferenceCounts = () => {
    const seekingFriendshipCount = filterUserCount("preference", "Friendship");
    const seekingLoveCount = filterUserCount("preference", "Love");
    return {seekingFriendshipCount, seekingLoveCount};
}

const getGenderCounts = () => {
    const maleUsersCount = filterUserCount("gender", "Male");
    const femaleUsersCount = filterUserCount("gender", "Female");
    const otherGenderUsersCount = filterUserCount("gender", "Other");
    return {maleUsersCount, femaleUsersCount, otherGenderUsersCount};
}

const getAgeRangeCounts = () => {
    // Filter by age range.
    const filterAgeRange = (lowerAge, upperAge) => {
        const filteredUsers = users.filter(user => {
            if (user.age) {
                let userAge = parseInt(user.age);
                return userAge >= lowerAge && userAge <= upperAge;
            }
        });
        return filteredUsers.length;
    }

    const age18to24 = filterAgeRange(18,24);
    const age25to34 = filterAgeRange(25,34);
    const age35to44 = filterAgeRange(35,44);
    const age45to54 = filterAgeRange(45,54);
    const age55to64 = filterAgeRange(55,64);
    const age65plus = filterAgeRange(65,100);

    return {age18to24, age25to34, age35to44, age45to54, age55to64, age65plus};
}

const getSkillsCount = (hasOrWant) => {
    const filterSkillCount = (skill) => {
        const filteredUsers = users.filter(user => {
            if (user[hasOrWant]) {
                for(let ownedSkill of user[hasOrWant]) {
                    if (ownedSkill == skill)
                        return true;
                }
            }
        });
        return filteredUsers.length;
    }

    const javaScript = filterSkillCount("JavaScript");
    const python = filterSkillCount("Python");
    const java = filterSkillCount("Java");
    const cpp = filterSkillCount("C++");
    const react = filterSkillCount("React"); 
    const nodeJS = filterSkillCount("Node.js");

    return {javaScript, python, java, cpp, react, nodeJS};
}

/*=============================
    MATCH CALCULATIONS
=============================*/

const filterMatchCount = (matchField, targetValue) => {
    const filteredMatches = matches.filter(match => {
        if (match[matchField]) {
            return match[matchField] == targetValue;
        }
    });
    return filteredMatches.length;
}

const getCommunicationExposedCount = () => {
    const communicationExposedCount = filterMatchCount("exposed_communication", true);
    return {communicationExposedCount};
}

export {
    getAllStatistics
}