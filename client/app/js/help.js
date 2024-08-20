import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/help-center.html") {
	document.addEventListener("DOMContentLoaded", async () => {
		const block = document.querySelector(".ann-block");
		const tilesBlock = document.querySelector(".tiles");
		const searchInp = document.querySelector(".search-field__input");
		let timeoutId;

		searchInp.addEventListener("input", (data) => {
			clearTimeout(timeoutId);

			if (data.target.value.length > 0) {
				timeoutId = setTimeout(async () => {
					const response = await axios.get("/help/search", {
						params: { text: data.target.value },
					});

					if (response.data?.length > 0) {
						block.style.display = "flex";
						block.innerHTML = "";

						tilesBlock.style.display = "none";
					} else {
						block.style.display = "none";
						block.innerHTML = "";

						tilesBlock.style.display = "grid";
					}

					response.data.forEach((element) => {
						const item = document.createElement("div");
						item.className = "ann-btn";
						item.textContent = element.title;
						item.addEventListener(
							"click",
							() => (location.href = element.link)
						);

						block.appendChild(item);
					});
				}, 1000);
			} else {
				block.style.display = "none";
				block.innerHTML = "";

				tilesBlock.style.display = "grid";
			}
		});
	});
}
