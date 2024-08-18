import Popup from "./components/popup.js";
import PasswordInput from "./components/password-input.js";
import isAuth from "./components/privatePages.js";

document.addEventListener("DOMContentLoaded", () => {
	// Menu
	const menuOpen = document.querySelector("#menu-open");
	const menuClose = document.querySelector("#menu-close");

	const menuPopup = new Popup("menu", "backdrop");

	if (menuOpen) {
		menuOpen.addEventListener("click", () => menuPopup.open());
		menuClose.addEventListener("click", () => menuPopup.close());
	}

	// Tabs
	const tabsComponents = document.querySelectorAll("[data-tabs]");

	tabsComponents.forEach((tabComponent) => {
		const tabs = tabComponent.querySelectorAll("[data-tab]");

		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				tabs.forEach((tab) => tab.classList.remove("active"));
				document
					.querySelectorAll(`[data-tab-content=${tabComponent.dataset.tabs}]`)
					.forEach((content) => content.classList.add("hidden"));

				const content = document.querySelector(
					`#${tab.dataset.tab}[data-tab-content=${tabComponent.dataset.tabs}]`
				);
				tab.classList.add("active");
				content.classList.remove("hidden");
			});
		});
	});

	// Sub menu and avatar
	if (window.matchMedia("(min-width: 640px)")) {
		const subMenuItems = document.querySelectorAll("[data-sub]");
		const userInfo = document.querySelector(".user");

		// Перебираем все элементы подменю
		subMenuItems.forEach((sub) => {
			// Добавляем обработчик события click для каждого подменю
			sub.addEventListener("click", (event) => {
				event.stopPropagation(); // Останавливаем всплытие события
				const menu = sub.querySelector(".menu-link__sub");
				menu.classList.toggle("active");
			});
		});

		if (userInfo) {
			userInfo.addEventListener("click", (event) => {
				event.stopPropagation(); // Останавливаем всплытие события
				const info = userInfo.querySelector(".user-extended");
				info.classList.toggle("active");
			});
		}

		// Добавляем обработчик события click для всего документа
		document.addEventListener("click", (event) => {
			// Закрываем все подменю
			subMenuItems.forEach((sub) => {
				const menu = sub.querySelector(".menu-link__sub");
				if (menu.classList.contains("active")) {
					menu.classList.remove("active");
				}
			});

			if (userInfo) {
				if (
					userInfo.querySelector(".user-extended").classList.contains("active")
				) {
					userInfo.querySelector(".user-extended").classList.remove("active");
				}
			}
		});
	}

	// Become Premium
	const becomePremiumPopup = new Popup("become-premium-popup", "backdrop");
	const openBecomePremiumPopup = document.querySelector(".status-label");
	const closeBecomePremiumPopup = document.querySelector(
		".become-premium .popup__close"
	);

	if (openBecomePremiumPopup) {
		openBecomePremiumPopup.addEventListener("click", () =>
			becomePremiumPopup.open()
		);
		closeBecomePremiumPopup.addEventListener("click", () =>
			becomePremiumPopup.close()
		);
	}

	// Password Field
	PasswordInput();
});

document.addEventListener("DOMContentLoaded", () => {
	const authRequiredPages = [
		"/",
		"/index.html",
		"/about.html",
		"/execution.html",
		"/help-center-1.html",
		"/help-center.html",
		"/privacy-policy.html",
		"/referral.html",
		"/terms-and-conditions.html",
	];
	const publicPages = ["/sign-in.html", "/sign-up.html", "/refer.html"];

	const currentPage = window.location.pathname;

	if (isAuth()) {
		if (publicPages.includes(currentPage)) {
			window.location.pathname = "/";
		}
	} else {
		if (authRequiredPages.includes(currentPage)) {
			window.location.pathname = "/sign-in.html";
		}
	}
});
