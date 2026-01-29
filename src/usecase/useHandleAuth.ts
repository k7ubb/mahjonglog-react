import {
	getEmailByAccountID,
	checkAccountIDExist,
	fireauthLogin,
	fireauthRegister,
	fireauthLogout,
} from '@/repository/authRepository';
import { useHandleUser } from '@/usecase/useHandleUser';

export const useHandleAuth = () => {
	const { update } = useHandleUser();

	const login = async ({
		emailOrAccountID,
		password,
	}: {
		emailOrAccountID: string;
		password: string;
	}) => {
		const email = emailOrAccountID.match(/^.+@.+$/)
			? emailOrAccountID
			: await getEmailByAccountID(emailOrAccountID);
		await fireauthLogin({ email, password });
		await update();
	};

	const register = async ({
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
		await fireauthRegister({ email, password, accountID, accountName });
		await update();
	};

	const logout = async () => {
		await fireauthLogout();
		await update();
	};

	return {
		login,
		register,
		logout,
	};
};
