export const getColorByProcent = (procent, type) => {
	let color = "";

	if (type === "route") {
		if (procent < 0.5) color = "route-item__din--red";
		else if (procent >= 0.5 && procent < 1) color = "route-item__din--yellow";
		else if (procent >= 1 && procent < 1.5) color = "route-item__din--green";
		else color = "route-item__din--pink";
	} else {
		if (procent < 0.5) color = "table-item-din--red";
		else if (procent >= 0.5 && procent < 1) color = "table-item-din--yellow";
		else if (procent >= 1 && procent < 1.5) color = "table-item-din--green";
		else color = "table-item-din--pink";
	}

	return color;
};
