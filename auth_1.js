
exports.getPasswordHash = async (password) =>
{
	return password;
}

exports.isPasswordCorrect = async (userEnteredPassword, passwordHash) =>
{
    const hash = await this.getPasswordHash(userEnteredPassword);
	return hash === passwordHash;
}
