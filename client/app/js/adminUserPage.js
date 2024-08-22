import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/admin-user-page.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const userBack = document.querySelector(".user-back svg");

		userBack.addEventListener("click", () => {
			location.href = "http://localhost:3000/admin-user.html";
		});

		const searchParams = new URLSearchParams(window.location.search);

		await axios.get(`/admin/user?id=${searchParams.get("q")}`).then((res) => {
			const img = document.querySelector(".user-main-info img");
			const name = document.querySelector(".user-main-info .user-name");
			const email = document.querySelector(".user-main-info .user-email");
			const reg = document.querySelector(".user-main-info .user-reg");
			const premium = document.querySelector(".user-main-info .user-prem");
			const money = document.querySelector(".user-main-info .user-money");

			if (res.data.image?.length > 0) img.src = res.data.image;
			name.textContent = res.data.name;
			email.textContent = res.data.email;
			premium.textContent = res.data.premium ? "YES" : "NO";
			money.textContent = `$${parseInt(res.data.money)}`;

			const date = new Date(res.data.createdAt);
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			reg.textContent = `${day}/${month}/${year}`;

			const list1 = document.querySelector("#table-1 tbody");
			const list2 = document.querySelector("#table-2 tbody");
			const list3 = document.querySelector("#table-3 tbody");

			res.data.deposites.forEach((element) => {
				const html = `
                            <tr>
								<td>${new Date(element.createdAt).toLocaleDateString()}</td>
								<td>${new Date(element.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}</td>
								<td>+${parseInt(element.money)}$</td>
							</tr>`;

				list1.insertAdjacentHTML("beforeend", html);
			});

			res.data.withdrawals.forEach((element) => {
				const html = `
                            <tr>
								<td>${new Date(element.createdAt).toLocaleDateString()}</td>
								<td>${new Date(element.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}</td>
								<td>+${parseInt(element.money)}$</td>
							</tr>`;

				list2.insertAdjacentHTML("beforeend", html);
			});

			res.data.routes.forEach((element) => {
				const html = `
                            <tr>
								<td>${new Date(element.createdAt).toLocaleDateString()}</td>
								<td>${new Date(element.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}</td>
								<td>+${parseFloat(element.profit)}$</td>
							</tr>`;

				list3.insertAdjacentHTML("beforeend", html);
			});
		});
	});
