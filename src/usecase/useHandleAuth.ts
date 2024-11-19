import {
	getEmailByAccountId,
	checkAccountIDExist,
	fireauthLogin,
	fireauthRegister,
	fireauthLogout
} from '../repository/authRepository.ts';
import { useHandleUser } from './useHandleUser.tsx';

export const useHandleAuth = () => {
	const { update } = useHandleUser();

	const submitLogin = async ({
		emailOrAccountId,
		password,
	}: {
		emailOrAccountId: string;
		password: string;
	}) => {
		const email = emailOrAccountId.match(/^.+@.+$/)
			? emailOrAccountId
			: await getEmailByAccountId(emailOrAccountId);
		await fireauthLogin({ email, password });
		update();
	};

	const submitRegister = async ({
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
	
	const submitLogout = async () => {
		await fireauthLogout();
		update();
	};

	return {
		submitLogin,
		submitRegister,
		submitLogout,
	};

};
