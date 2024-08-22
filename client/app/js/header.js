import axios from "./components/axiosConfig.js";
import { deleteCookie, getCookie } from "./components/cookieController.js";
import MoneyConvert from "./components/moneyConvert.js";
import { jwtDecode } from "jwt-decode";

async function logout() {
	const refToken = getCookie("refreshToken");

	const res = await axios.post("/authentication/logout", {
		refreshToken: refToken,
	});

	if (res.status === 200) {
		deleteCookie("refreshToken");
		localStorage.removeItem("token");
		window.location.pathname = "/sign-in.html";
	}
}

if (
	window.location.pathname !== "/sign-up.html" &&
	window.location.pathname !== "/sign-in.html" &&
	window.location.pathname !== "/refer.html" &&
	window.location.pathname !== "/admin.html" &&
	window.location.pathname !== "/admin-user.html" &&
	window.location.pathname !== "/admin-user-page.html" &&
	window.location.pathname !== "/admin-guide.html" &&
	window.location.pathname !== "/admin-announce.html" &&
	window.location.pathname !== "/admin-withdrawal.html"
)
	document.addEventListener("DOMContentLoaded", async () => {
		const image = document.querySelector(".user-avatar");

		const name1 = document.querySelector(".user-extended-info__name");
		const email1 = document.querySelector(".user-extended-info__email");
		const money1 = document.querySelector(".total-balance__info strong");

		const name2 = document.querySelector(".user-extended-info__name2");
		const email2 = document.querySelector(".user-extended-info__email2");
		const money2 = document.querySelector(".small-button--balance");

		const premium = document.querySelector(".status-label");
		const { premium: premiumToken } = jwtDecode(localStorage.getItem("token"));

		const logout1 = document.querySelector(".logout1");
		const logout2 = document.querySelector(".logout2");

		await axios.get("/authentication/profile").then((res) => {
			if (res.status === 200) {
				if (image && res.data.image)
					image.src = `http://localhost:3000/${res.data.image}`;

				if (name1) name1.innerHTML = res.data.name || "-";
				if (email1) email1.innerHTML = res.data.email || "-";
				if (money1)
					money1.innerHTML =
						res.data.money === "0"
							? MoneyConvert(res.data.money)
							: res.data.money;

				if (name2) name2.innerHTML = res.data.name || "-";
				if (email2) email2.innerHTML = res.data.email || "-";
				if (money2)
					money2.textContent =
						res.data.money === "0"
							? MoneyConvert(res.data.money)
							: res.data.money;

				if (premium && premiumToken) premium.style.display = "none";
			}
		});

		logout1.addEventListener("click", async () => logout());
		logout2.addEventListener("click", async () => logout());
	});
