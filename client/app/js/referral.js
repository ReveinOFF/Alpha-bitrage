import axios from "./components/axiosConfig.js";

if (window.location.pathname === "/referral.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const input = document.querySelector(".copy-field__input");
		const btn1 = document.querySelector(".copy-link");
		const btn2 = document.querySelector(".copy-code");

		const res = await axios.get("/authentication/referral");
		const url = `alpharbitrage.xyz/refer?r=${res.data.code}`;

		if (input) input.textContent = url;

		btn1.addEventListener("click", () => navigator.clipboard.writeText(url));

		btn2.addEventListener("click", () =>
			navigator.clipboard.writeText(res.data.code)
		);

		const blockEmpty = document.querySelector(".empty-space");
		const refBlock = document.querySelector(".referrals-table");

		const refCont = document.querySelector(".referrals-table-body");

		const total = document.querySelector(".referrals-head__total");

		if (res.data.users.length > 0 && blockEmpty && refBlock) {
			blockEmpty.style.display = "none";
			refBlock.style.display = "block";
			total.textContent = `Total referrals: ${res.data.totalRef}`;

			res.data.users.forEach((element) => {
				const date = new Date(element.createdAt);

				const day = date.getDate().toString().padStart(2, "0");
				const month = (date.getMonth() + 1).toString().padStart(2, "0");
				const year = date.getFullYear();

				const formattedDate = `${day}.${month}.${year}`;

				const number = Number(element.earnings);
				const formattedNumber = number.toFixed(2);

				const span1 = document.createElement("span");
				span1.textContent = element.name || "-";
				const span2 = document.createElement("span");
				span2.textContent = formattedDate;
				const span3 = document.createElement("span");
				span3.textContent = `${
					element.earnings === "0" ? formattedNumber : element.earnings
				}$`;

				const div = document.createElement("div");
				div.className = "referrals-table-item";
				div.appendChild(span1);
				div.appendChild(span2);
				div.appendChild(span3);

				refCont.appendChild(div);
			});
		}
	});
