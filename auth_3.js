const bcrypt = require('bcrypt');

exports.getPasswordHash = async (password) =>
{
	const hash = await bcrypt.hash(password, 10);
	return hash;
}

exports.isPasswordCorrect = async (userEnteredPassword, passwordHash) =>
{
	const res = await bcrypt.compare(userEnteredPassword, passwordHash);
	return res;
}
