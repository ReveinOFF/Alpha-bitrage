import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/admin.html")
	document.addEventListener("DOMContentLoaded", async () => {
		await axios.get("/admin/main-info").then((res) => {
			const totalUser = document.querySelector("#total-user");
			const totalDep = document.querySelector("#total-deposit");
			const totalPrem = document.querySelector("#count-prem");
			const totalWD = document.querySelector("#count-wd");
			const nf = document.querySelector(".notif-block");

			totalUser.textContent = res.data.userCount;
			totalDep.textContent = `$${res.data.totalDeposit}`;
			totalPrem.textContent = res.data.premiumCount;
			totalWD.textContent = `$${res.data.totalWithdraw}`;

			if (res.data.notifications)
				res.data.notifications.forEach((element) => {
					const html = `<div>User ${element}</div>`;

					nf.insertAdjacentHTML("beforeend", html);
				});
		});
	});
