import axios from "./components/axiosConfig.js";
import { getColorByProcent } from "./components/colorConvert.js";
import Execution from "./components/execution.js";

async function openPair() {
	const searchParams = new URLSearchParams(window.location.search);

	const from = searchParams.get("exchangeFrom");
	const to = searchParams.get("exchangeTo");
	const buy = searchParams.get("buyPrice");
	const sell = searchParams.get("sellPrice");
	const spread = searchParams.get("spread");

	const execution = document.querySelector(".execution");
	const executionSubmit = document.querySelector(".execution .form-submit");
	const executionInput = document.querySelector(".execution-form-input");
	const input = document.querySelector(".execution-form-input input");

	const executionProfit = document.querySelector(".execution-form__profit");
	const executionPair = document.querySelector(".execution-form__pair");
	const executionBuy = document.querySelector(".execution-form__buy");
	const executionSell = document.querySelector(".execution-form__sell");
	const executionNames = document.querySelectorAll(".exchange-field__name");

	executionPair.textContent = `${from.toLocaleUpperCase()}_${to.toLocaleUpperCase()}`;
	executionProfit.textContent = `${spread}%`;
	executionBuy.textContent = `$${buy}`;
	executionSell.textContent = `$${sell}`;
	executionNames.item(0).textContent = from.toLocaleUpperCase();
	executionNames.item(1).textContent = to.toLocaleUpperCase();

	const convertProcent = (value) => Math.floor(value * 10) / 10;

	executionSubmit.addEventListener("click", async () => {
		executionSubmit.disabled = true;
		executionInput.style.display = "none";

		await axios
			.post("/routes/create", {
				exchangeFrom: executionNames.item(0).textContent.toLocaleLowerCase(),
				exchangeTo: executionNames.item(1).textContent.toLocaleLowerCase(),
				buyPrice: executionBuy.textContent.replace("$", "").trim(),
				sellPrice: executionSell.textContent.replace("$", "").trim(),
				spread: parseFloat(
					executionProfit.textContent.replace(/[+%]/g, "").trim()
				).toString(),
				quantity: parseInt(input.value),
			})
			.then((res) => {
				if (res.status === 201) {
					const listOpen = document.querySelector(
						".open-rout-table .table-body"
					);
					const emptyOpen = document.querySelector(".open-rout-table-empty");

					if (emptyOpen) emptyOpen.remove();

					const data = res.data;

					const htmlString = `<div class="table-item">
						<span>${data.exchangeFrom.toLocaleUpperCase()}-${data.exchangeTo.toLocaleUpperCase()}</span>
						<span>${data.quantity}$</span>
						<span>${convertProcent(data.spread)} %</span>
						<span>${data.created}</span>
						<span>${data.status}</span>
						</div>`;
					listOpen.insertAdjacentHTML("beforeend", htmlString);

					// Время в секундах (2 часа, 48 минут и 16 секунд)
					let totalTime = 2 * 3600 + 48 * 60 + 16;

					// Функция для форматирования времени в ЧЧ:ММ:СС
					function formatTime(seconds) {
						let h = Math.floor(seconds / 3600);
						let m = Math.floor((seconds % 3600) / 60);
						let s = seconds % 60;
						return `${h.toString().padStart(2, "0")}:${m
							.toString()
							.padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
					}

					// Установить начальное значение таймера
					executionSubmit.textContent = formatTime(totalTime);

					// Запуск таймера с интервалом в 1 секунду
					let timer = setInterval(() => {
						totalTime--;
						executionSubmit.textContent = formatTime(totalTime);

						// Остановка таймера, когда время истекло
						if (totalTime <= 0) {
							clearInterval(timer);
							executionSubmit.textContent = "Время истекло";
						}
					}, 1000);
				}
			});
	});

	execution.classList.add("open");
}

if (window.location.pathname === "/execution.html")
	document.addEventListener("DOMContentLoaded", async () => {
		const execution = document.querySelector(".execution");

		const searchParams = new URLSearchParams(window.location.search);

		const from = searchParams.get("exchangeFrom");
		const to = searchParams.get("exchangeTo");
		const buy = searchParams.get("buyPrice");
		const sell = searchParams.get("sellPrice");
		const spread = searchParams.get("spread");

		if ((from, to, buy, sell, spread)) {
			openPair();
			execution.classList.add("open");
		}

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
