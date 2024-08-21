import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/admin-withdrawal.html")
	document.addEventListener("DOMContentLoaded", async () => {
		console.log("aaa");
		const blockWd = document.querySelector(".withdrawal-block");

		await axios.get("/admin/all-wd").then((res) => {
			res.data.forEach((element) => {
				const htmlWd = `
            <div class="withdrawal-item">
				<strong>${element.user.name}</strong>
				<span>sent a withdrawal request -</span>
				<strong>$${parseInt(element.money.toString())}</strong>
				<div>
					<button>Accept</button>
					<button>Decline</button>
				</div>
			</div>`;

				blockWd.insertAdjacentHTML("beforeend", htmlWd);
			});
		});
	});
