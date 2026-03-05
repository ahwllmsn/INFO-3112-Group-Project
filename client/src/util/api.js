const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
}

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;

const users = {
    getProfileInfo: async (email) => {
        let response = await fetch(serverRoute('get-profile'), {
            headers,
            method: 'GET',
            body: {email}
        });
        let data = await response.json();
        return data;
    }
}

const matches = {

}

export {
    users,
    matches
}
