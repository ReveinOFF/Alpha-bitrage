import axios from "./components/axiosConfig.js";
import { getColorByProcent } from "./components/colorConvert.js";
import Execution from "./components/execution.js";

if (window.location.pathname === "/execution.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const listAll = document.querySelector("#table-1 .table-body");
		const listTop = document.querySelector("#table-2 .table-body");
		const listPremium = document.querySelector("#table-3 .table-body");
		const listOpen = document.querySelector(".open-rout-table .table-body");
		const listHist = document.querySelector(".hist-rout-table .table-body");
		const emptyOpen = document.querySelector(".open-rout-table-empty");
		const emptyHist = document.querySelector(".hist-rout-table-empty");
		const histCont = document.querySelector(".hist-rout-table");

		const values = [
			"route-item__icon--red",
			"route-item__icon--yellow",
			"route-item__icon--green",
		];

		const convertProcent = (value) => Math.floor(value * 10) / 10;

		await axios.get("/routes/execution").then((res) => {
			if (res.status === 200) {
				const allData = res.data.all;
				const topData = res.data.top;
				const premiumData = res.data.premium;
				const openData = res.data.open;
				const histData = res.data.history;

				allData.forEach((element) => {
					const randomValue = values[Math.floor(Math.random() * values.length)];

					const htmlString = `<div class="table-item">
						<span>${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</span>
						<span>${element.buyPrice} $</span>
						<span>${element.sellPrice} $</span>
						<span>${element.buyPrice}-${element.sellPrice}</span>
						<span class="${getColorByProcent(element.spread, "table")}">+ ${convertProcent(
						element.spread
					)} %</span>
						<span>
							<svg class="route-item__icon ${randomValue}">
								<use xlink:href="#icon-volume"></use>
							</svg>
						</span>
					</div>`;
					listAll.insertAdjacentHTML("beforeend", htmlString);
				});

				topData.forEach((element) => {
					const randomValue = values[Math.floor(Math.random() * values.length)];

					const htmlString = `<div class="table-item">
						<span>${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</span>
						<span>${element.buyPrice} $</span>
						<span>${element.sellPrice} $</span>
						<span>${element.buyPrice}-${element.sellPrice}</span>
						<span class="${getColorByProcent(element.spread, "table")}">+ ${convertProcent(
						element.spread
					)} %</span>
						<span>
							<svg class="route-item__icon ${randomValue}">
								<use xlink:href="#icon-volume"></use>
							</svg>
						</span>
					</div>`;
					listTop.insertAdjacentHTML("beforeend", htmlString);
				});

				premiumData.forEach((element) => {
					const randomValue = values[Math.floor(Math.random() * values.length)];

					const htmlString = `<div class="table-item">
						<span>${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</span>
						<span>${element.buyPrice} $</span>
						<span>${element.sellPrice} $</span>
						<span>${element.buyPrice}-${element.sellPrice}</span>
						<span class="${getColorByProcent(element.spread, "table")}">+ ${convertProcent(
						element.spread
					)} %</span>
						<span>
							<svg class="route-item__icon ${randomValue}">
								<use xlink:href="#icon-volume"></use>
							</svg>
						</span>
					</div>`;
					listPremium.insertAdjacentHTML("beforeend", htmlString);
				});

				if (openData.length > 0) {
					emptyOpen.remove();

					openData.forEach((element) => {
						const htmlString = `<div class="table-item">
						<span>${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</span>
						<span>${element.quantity}$</span>
						<span>${convertProcent(element.spread)} %</span>
						<span>${element.created}</span>
						<span>${element.status}</span>
					</div>`;
						listOpen.insertAdjacentHTML("beforeend", htmlString);
					});
				}

				if (histData.length > 0) {
					emptyHist.remove();
					histCont.classList.remove("hidden");

					histData.forEach((element) => {
						const htmlString = `<div class="table-item">
						<span>${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</span>
						<span>${element.quantity}$</span>
						<span>${convertProcent(element.spread)} %</span>
						<span>${element.status}</span>
						<span class="${element.profit !== 0.0 ? "color-green" : ""}">${
							element.profit === 0.0 ? "---" : element.profit
						}$</span>
						<span>${element.created}</span>
					</div>`;
						listHist.insertAdjacentHTML("beforeend", htmlString);
					});
				}

				if (document.querySelector(".execution")) {
					Execution();
				}
			}
		});
	});
