exports.getPasswordHash = async (password) =>
{
	return sha256(password);
}

exports.isPasswordCorrect = async (userEnteredPassword, passwordHash) =>
{
    const hash = await this.getPasswordHash(userEnteredPassword);
	return hash === passwordHash;
}

function sha256(txt){
	const crypto = require('crypto');
    const secret = 'pqrstuv';
    const hash = crypto.createHmac('sha256', secret)
                    .update(txt)
                    .digest('hex');
   return hash;
}
