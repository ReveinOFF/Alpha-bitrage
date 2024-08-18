import axios from "./axiosConfig.js";

function openPair(pair) {
	const execution = document.querySelector(".execution");
	const executionSubmit = document.querySelector(".execution .form-submit");
	const executionInput = document.querySelector(".execution-form-input");
	const input = document.querySelector(".execution-form-input input");

	const executionProfit = document.querySelector(".execution-form__profit");
	const executionPair = document.querySelector(".execution-form__pair");
	const executionBuy = document.querySelector(".execution-form__buy");
	const executionSell = document.querySelector(".execution-form__sell");
	const executionNames = document.querySelectorAll(".exchange-field__name");

	executionPair.textContent =
		pair.querySelector("span:nth-child(1)").textContent;
	executionProfit.textContent =
		pair.querySelector("span:nth-child(5)").textContent;
	executionBuy.textContent =
		pair.querySelector("span:nth-child(2)").textContent;
	executionSell.textContent =
		pair.querySelector("span:nth-child(3)").textContent;
	executionNames.item(0).textContent = executionPair.textContent.split("-")[0];
	executionNames.item(1).textContent = executionPair.textContent.split("-")[1];

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

function Execution() {
	const maxInputTrigger = document.querySelector(
		".execution-form-input__label"
	);
	const input = document.querySelector(".execution-form-input input");
	maxInputTrigger.addEventListener("click", () => {
		input.value = 20000;
	});

	const pairs = document.querySelectorAll(
		".execution .table--pairs .table-item"
	);

	pairs.forEach((pair) => {
		pair.addEventListener("click", () => openPair(pair));
	});
}

export default Execution;
