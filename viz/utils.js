function firstCapital(str) {
	if (str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
	return null;
}