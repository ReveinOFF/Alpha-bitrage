import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/admin-withdrawal.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const blockWd = document.querySelector(".withdrawal-block");

		await axios.get("/admin/all-wd").then((res) => {
			res.data.forEach((element) => {
				const htmlWd = `
            <div class="withdrawal-item">
				<strong>${element.user.name}</strong>
				<span>sent a withdrawal request -</span>
				<strong>$${parseInt(element.money.toString())}</strong>
				<div>
					<button class="wd-btn-a">Accept</button>
					<button class="wd-btn-d">Decline</button>
				</div>
			</div>`;

				blockWd.insertAdjacentHTML("beforeend", htmlWd);

				const addedItem = blockWd.querySelector(".withdrawal-item");

				const addedBtnA = addedItem.querySelector(".wd-btn-a");
				const addedBtnD = addedItem.querySelector(".wd-btn-d");

				if (addedBtnA) {
					addedBtnA.addEventListener("click", async (e) => {
						await axios.put(`/admin/update-wd`, {
							id: element.id,
							status: "Accept",
						});
						blockWd.removeChild(addedItem);
					});
				}

				if (addedBtnD) {
					addedBtnD.addEventListener("click", async (e) => {
						await axios.put(`/admin/update-wd`, {
							id: element.id,
							status: "Decline",
						});
						blockWd.removeChild(addedItem);
					});
				}
			});
		});
	});
