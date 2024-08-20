import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/admin-announce.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const block = document.querySelector(".ann-list");
		const createBTN = document.querySelector(".create-ann");

		createBTN.addEventListener("click", () => {
			const modal = document.querySelector(".admin-create-ann");

			modal.style.display = "flex";

			const title = modal.querySelector("#title");
			const link = modal.querySelector("#link");
			const btn = modal.querySelector(".create-ann-modal");

			btn.addEventListener("click", async () => {
				const { data } = await axios.post("/admin/create-ann", {
					title: title.value,
					link: link.value,
					type: "Announcements",
				});

				modal.style.display = "none";

				const item = document.createElement("div");
				item.className = "ann-item";

				const titleD = document.createElement("div");
				titleD.textContent = data.title;

				const svg = `<svg
						width="24"
						height="30"
						viewBox="0 0 24 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9 0L7.5 1.5H0V4.5H24V1.5H16.5L15 0H9ZM1.5 7.5V27C1.5 28.65 2.85 30 4.5 30H19.5C21.15 30 22.5 28.65 22.5 27V7.5H1.5ZM8.11523 12L12 15.8848L15.8848 12L18 14.1152L14.1152 18L18 21.8848L15.8848 24L12 20.1152L8.11523 24L6 21.8848L9.88477 18L6 14.1152L8.11523 12Z"
							fill="#DD0000"
							fill-opacity="0.6"
						/>
					</svg>`;

				item.appendChild(titleD);
				item.insertAdjacentHTML("beforeend", svg);

				const addedSvg = item.querySelector("svg");
				if (addedSvg) {
					addedSvg.addEventListener("click", async (e) => {
						await axios.delete(`/admin/delete-ann/${data.id}`);
						block.removeChild(item);
					});
				}

				block.appendChild(item);
			});
		});

		await axios.get("/help/announce").then((res) => {
			res.data.forEach((element) => {
				const item = document.createElement("div");
				item.className = "ann-item";

				const title = document.createElement("div");
				title.textContent = element.title;

				const svg = `<svg
						width="24"
						height="30"
						viewBox="0 0 24 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9 0L7.5 1.5H0V4.5H24V1.5H16.5L15 0H9ZM1.5 7.5V27C1.5 28.65 2.85 30 4.5 30H19.5C21.15 30 22.5 28.65 22.5 27V7.5H1.5ZM8.11523 12L12 15.8848L15.8848 12L18 14.1152L14.1152 18L18 21.8848L15.8848 24L12 20.1152L8.11523 24L6 21.8848L9.88477 18L6 14.1152L8.11523 12Z"
							fill="#DD0000"
							fill-opacity="0.6"
						/>
					</svg>`;

				item.appendChild(title);
				item.insertAdjacentHTML("beforeend", svg);

				const addedSvg = item.querySelector("svg");
				if (addedSvg) {
					addedSvg.addEventListener("click", async (e) => {
						await axios.delete(`/admin/delete-ann/${element.id}`);
						block.removeChild(item);
					});
				}

				block.appendChild(item);
			});
		});
	});
