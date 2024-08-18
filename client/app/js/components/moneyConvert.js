function MoneyConvert(money) {
	const number = Number(money);
	const formattedNumber = number.toFixed(3);

	return formattedNumber;
}

export default MoneyConvert;
