import {
	checkAccountIDExist,
	registerAccount,
} from '../repository/registerRepository';

export const useHandleRegister = () => {
	const submitLogin = async ({
		email,
		password,
		passwordCheck,
		accountID,
		accountName,
	}: {
		email: string;
		password: string;
		passwordCheck: string;
		accountID: string;
		accountName: string;
	}) => {
		if (password !== passwordCheck) {
			throw new Error('パスワードが一致しません');
		}
		await checkAccountIDExist(accountID);
		await registerAccount({ email, password, accountID, accountName });
	};

	return { submitLogin };
};
