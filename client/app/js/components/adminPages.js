import { jwtDecode } from "jwt-decode";

function isAdmin() {
	const token = localStorage.getItem("token");

	if (token?.length <= 0) false;

	const { role } = jwtDecode(token);

	return role === "admin";
}

export default isAdmin;
