import decode from "jwt-decode";

class AuthService {
    // get user data
    getProfile() {
        const token = this.getToken();

        if (!token) {
            return null;
        }
        try {
            return decode(token);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    // check if user's logged in
    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }
    // check if token is expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // remove token from local storage
                localStorage.removeItem("id_token");
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }
    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem("id_token");
    }
    login(idToken) {
        //saves company id of logged in user to local storage
        const decodedToken = decode(idToken);
        localStorage.setItem("company_id", decodedToken.data.company);

        // Saves user token to localStorage
        localStorage.setItem("id_token", idToken);
        window.location.assign("/");
    }
    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem("id_token");
        // this will reload the page and reset the state of the application
        window.location.assign("/");
    }
}

export default new AuthService();
