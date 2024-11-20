import {
	getEmailByAccountID,
	checkAccountIDExist,
	fireauthLogin,
	fireauthRegister,
	fireauthLogout,
} from '../repository/authRepository.ts';
import { useHandleUser } from './useHandleUser.tsx';

export const useHandleAuth = () => {
	const { update } = useHandleUser();

	const login = async ({
		emailOrAccountId,
		password,
	}: {
		emailOrAccountId: string;
		password: string;
	}) => {
		const email = emailOrAccountId.match(/^.+@.+$/)
			? emailOrAccountId
			: await getEmailByAccountID(emailOrAccountId);
		await fireauthLogin({ email, password });
		update();
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
		update();
	};

	const logout = async () => {
		await fireauthLogout();
		update();
	};

	return {
		login,
		register,
		logout,
	};
};
