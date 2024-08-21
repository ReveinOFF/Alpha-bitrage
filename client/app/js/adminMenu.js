import { deleteCookie, getCookie } from "./components/cookieController.js";
import axios from "./components/axiosConfig.js";

if (
	window.location.pathname === "/admin.html" ||
	window.location.pathname === "/admin-user.html" ||
	window.location.pathname === "/admin-withdrawal.html" ||
	window.location.pathname === "/admin-announce.html" ||
	window.location.pathname === "/admin-guide.html" ||
	window.location.pathname === "/admin-user-page.html"
)
	document.addEventListener("DOMContentLoaded", async () => {
		const btn = document.querySelector(".admin-logout");

		const navLinks = document.querySelectorAll(".admin-nav a");
		const currentPage = window.location.pathname;

		navLinks.forEach((link) => {
			if (link.getAttribute("href") === currentPage) {
				link.classList.add("active");
			}

			if (
				link.getAttribute("href") === "/admin-user.html" &&
				currentPage === "/admin-user-page.html"
			)
				link.classList.add("active");
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

		const image = document.querySelector(".admin-header .user-avatar-h");
		const name = document.querySelector(".admin-header .user-name-h");

		const { data } = await axios.get("/admin/menu-info");

		if (data?.image?.length > 0) image.src = data.image;
		name.textContent = data?.name || "...";
	});
