import { getCookie } from "./cookieController.js";

function isAuthenticated() {
	const token = getCookie("refreshToken");
	return !!token;
}

export default isAuthenticated;
