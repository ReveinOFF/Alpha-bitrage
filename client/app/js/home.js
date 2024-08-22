import axios from "./components/axiosConfig.js";
import { jwtDecode } from "jwt-decode";
import { getColorByProcent } from "./components/colorConvert.js";

async function fetchData() {
	const listNew = document.querySelector(".route-items-new");
	const listTopMin = document.querySelector(".route-items-top");
	const listPremiumMin = document.querySelector(".route-items-premium");
	const listAll = document.querySelector("#table-1 .table-body");
	const listTop = document.querySelector("#table-2 .table-body");
	const listPremium = document.querySelector("#table-3 .table-body");

	const premiumMinHide = document.querySelector(".route--premium");

	const { premium } = jwtDecode(localStorage.getItem("token"));

	const values = [
		"route-item__icon--red",
		"route-item__icon--yellow",
		"route-item__icon--green",
	];

	const convertProcent = (value) => Math.floor(value * 10) / 10;

	if (premium) premiumMinHide.classList.remove("route--premium");

	await axios.get("/routes/main").then((res) => {
		if (res.status === 200) {
			listNew.replaceChildren();
			listTopMin.replaceChildren();
			listPremiumMin.replaceChildren();
			listAll.replaceChildren();
			listTop.replaceChildren();
			listPremium.replaceChildren();

			const newData = res.data.new;
			const topMinData = res.data.topMin;
			const premiumMinData = res.data.premiumMin;

			const allData = res.data.all;
			const topData = res.data.top;
			const premiumData = res.data.premium;

			newData.forEach((element) => {
				const htmlString = `
		                <div class="route-item">
		                    <svg class="route-item__icon"><use xlink:href="#icon-route"></use></svg>
		                    <div class="route-item__name">${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</div>
		                    <div class="route-item__value">${element.buyPrice}-${
					element.sellPrice
				}</div>
		                    <div class="route-item__din ${getColorByProcent(
													element.spread,
													"route"
												)}">+ ${convertProcent(element.spread)}%</div>
		                </div>
		            `;
				listNew.insertAdjacentHTML("beforeend", htmlString);
			});

			topMinData.forEach((element) => {
				const htmlString = `
				        <div class="route-item">
				            <svg class="route-item__icon"><use xlink:href="#icon-route"></use></svg>
				            <div class="route-item__name">${element.exchangeFrom.toLocaleUpperCase()}-${element.exchangeTo.toLocaleUpperCase()}</div>
				            <div class="route-item__value">${element.buyPrice}-${
					element.sellPrice
				}</div>
				            <div class="route-item__din ${getColorByProcent(
											element.spread,
											"route"
										)}">+ ${convertProcent(element.spread)}%</div>
				        </div>
				    `;
				listTopMin.insertAdjacentHTML("beforeend", htmlString);
			});

			premiumMinData.forEach((element) => {
				const htmlString = `
				        <div class="route-item">
				            <svg class="route-item__icon"><use xlink:href="#icon-route"></use></svg>
				            <div class="route-item__name">${
											premium ? element.exchangeFrom.toLocaleUpperCase() : "..."
										}-${
					premium ? element.exchangeTo.toLocaleUpperCase() : "..."
				}</div>
				            <div class="route-item__value">${
											premium ? element.buyPrice : "..."
										}-${premium ? element.sellPrice : "..."}</div>
				            <div class="route-item__din ${getColorByProcent(
											element.spread,
											"route"
										)}">+ ${convertProcent(element.spread)}%</div>
				        </div>
				    `;
				listPremiumMin.insertAdjacentHTML("beforeend", htmlString);
			});

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

				const lastInsertedElement = listAll.lastElementChild;

				lastInsertedElement.addEventListener("click", () => {
					window.location.href = `/execution.html?exchangeFrom=${element.exchangeFrom}&exchangeTo=${element.exchangeTo}&buyPrice=${element.buyPrice}&sellPrice=${element.sellPrice}&spread=${element.spread}`;
				});
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

				const lastInsertedElement = listTop.lastElementChild;

				lastInsertedElement.addEventListener("click", () => {
					window.location.href = `/execution.html?exchangeFrom=${element.exchangeFrom}&exchangeTo=${element.exchangeTo}&buyPrice=${element.buyPrice}&sellPrice=${element.sellPrice}&spread=${element.spread}`;
				});
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

				const lastInsertedElement = listPremium.lastElementChild;

				lastInsertedElement.addEventListener("click", () => {
					window.location.href = `/execution.html?exchangeFrom=${element.exchangeFrom}&exchangeTo=${element.exchangeTo}&buyPrice=${element.buyPrice}&sellPrice=${element.sellPrice}&spread=${element.spread}`;
				});
			});
		}
	});
}

if (
	window.location.pathname === "/index.html" ||
	window.location.pathname === "/"
)
	document.addEventListener("DOMContentLoaded", async () => {
		fetchData();
		setInterval(fetchData, 10 * 60 * 1000);
	});
