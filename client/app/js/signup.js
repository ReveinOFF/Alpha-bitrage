import axios from "./components/axiosConfig.js";
import { setCookie } from "./components/cookieController.js";

if (window.location.pathname === "/sign-up.html")
	document.addEventListener("DOMContentLoaded", () => {
		const form = document.querySelector(".auth-window--reg");
		const okBtn = document.querySelector(".referral-code__ok");
		const refInp = document.querySelector("#ref-code");

		localStorage.removeItem("ref");

		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get("r")) {
			localStorage.setItem("ref", searchParams.get("r"));
			refInp.value = searchParams.get("r");
		}

		okBtn.addEventListener("click", () => {
			if (refInp.value.length > 0) {
				localStorage.setItem("ref", refInp.value);
				refInp.value = "";
			}
		});

		form.addEventListener("submit", async (event) => {
			event.preventDefault();

			if (
				event.target[1].value !== event.target[3].value ||
				!event.target[5].checked
			)
				return;

			let data = {
				email: event.target[0].value,
				password: event.target[1].value,
			};

			const ref = localStorage.getItem("ref");

			if (ref?.length > 0) data.referral = ref;

			await axios.post("/authentication/registration", data).then((res) => {
				if (res.status === 201) {
					localStorage.setItem("token", res.data.token);
					setCookie("refreshToken", res.data.refreshToken, 7);
					localStorage.removeItem("ref");
					window.location.pathname = "/";
				}
			});
		});
	});
