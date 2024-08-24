import axios from "axios";
import { getCookie, deleteCookie, setCookie } from "./cookieController.js";

const instance = axios.create({
	baseURL: "http://localhost:5000/api",
	timeout: 1000,
});

const refreshToken = async (oldRefToken) => {
	try {
		const response = await instance.get(
			`/authentication/refresh-token?token=${oldRefToken}`
		);
		const { token, refreshToken } = response.data;

		setCookie("refreshToken", refreshToken, 7);
		localStorage.setItem("token", token);

		return token;
	} catch (error) {
		console.error("Error when updating tokens:", error);
		throw error;
	}
};

instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		const refToken = getCookie("refreshToken");

		if (token?.length <= 0) {
			deleteCookie("refreshToken");
			localStorage.removeItem("token");
			return Promise.reject(new Error("No token found"));
		}

		if (token && refToken) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

instance.interceptors.response.use(
	(resp) => resp,
	async (error) => {
		const { response } = error;
		if (response && response.status === 401) {
			const refToken = getCookie("refreshToken");

			if (!refToken) {
				deleteCookie("refreshToken");
				localStorage.removeItem("token");
				return Promise.reject(error);
			}

			try {
				await refreshToken(refToken);

				location.reload();

				return Promise.resolve();
			} catch (err) {
				deleteCookie("refreshToken");
				localStorage.removeItem("token");
				location.reload();

				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	}
);

export default instance;
