import { jwtDecode } from "jwt-decode";

function isAdmin() {
	const token = localStorage.getItem("token");

	const { role } = jwtDecode(token);

	return role === "admin";
}

export default isAdmin;
