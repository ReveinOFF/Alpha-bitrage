import axios from "./components/axiosConfig.js";
import { setCookie } from "./components/cookieController.js";

if (window.location.pathname === "/sign-in.html")
	document.addEventListener("DOMContentLoaded", () => {
		const form = document.querySelector(".auth-window--login");

		form.addEventListener("submit", async (event) => {
			event.preventDefault();

			await axios
				.post("/authentication/login", {
					email: event.target[0].value,
					password: event.target[1].value,
				})
				.then((res) => {
					if (res.status === 200) {
						localStorage.setItem("token", res.data.token);
						setCookie("refreshToken", res.data.refreshToken, 7);
						window.location.pathname = "/index.html";
					}
				});
		});
	});
