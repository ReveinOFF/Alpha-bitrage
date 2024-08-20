import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/guides.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const block = document.querySelector(".guides-block");

		await axios.get("/help/guide").then((res) => {
			res.data.forEach((element) => {
				const item = document.createElement("div");
				item.className = "ann-btn";
				item.textContent = element.title;
				item.addEventListener("click", () => (location.href = element.link));

				block.appendChild(item);
			});
		});
	});
