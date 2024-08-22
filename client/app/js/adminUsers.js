import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/admin-user.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const blockUsers = document.querySelector(".users-block tbody");

		await axios.get("/admin/all-users").then((res) => {
			res.data.forEach((element) => {
				const htmlUser = `
                    <tr data-id="${element.id}">
						<td>${element.name || "..."}</td>
						<td>${new Date(element.createdAt).toLocaleDateString()}</td>
						<td class="admin-dep">$${parseInt(element.deposited)}</td>
						<td>${element.routes.length}</td>
						<td>${element.withdrawals.length}</td>
					</tr>`;

				blockUsers.insertAdjacentHTML("beforeend", htmlUser);

				blockUsers.addEventListener("click", (e) => {
					const targetRow = e.target.closest("tr");

					if (targetRow) {
						const elementId = targetRow.dataset.id;
						location.href = `http://localhost:3000/admin-user-page.html?q=${elementId}`;
					}
				});
			});
		});
	});
