import { deleteCookie, getCookie } from "./components/cookieController.js";
import axios from "./components/axiosConfig.js";

if (
	window.location.pathname === "/admin.html" ||
	window.location.pathname === "/admin-user.html" ||
	window.location.pathname === "/admin-withdrawal.html" ||
	window.location.pathname === "/admin-announce.html" ||
	window.location.pathname === "/admin-guide.html"
)
	document.addEventListener("DOMContentLoaded", async () => {
		const btn = document.querySelector(".admin-logout");

		const navLinks = document.querySelectorAll(".admin-nav a");
		const currentPage = window.location.pathname;

		navLinks.forEach((link) => {
			if (link.getAttribute("href") === currentPage) {
				link.classList.add("active");
			}
		});

		btn.addEventListener("click", async () => {
			const refToken = getCookie("refreshToken");

			const res = await axios.post("/authentication/logout", {
				refreshToken: refToken,
			});

			if (res.status === 200) {
				deleteCookie("refreshToken");
				localStorage.removeItem("token");
				window.location.pathname = "/sign-in.html";
			}
		});
	});
