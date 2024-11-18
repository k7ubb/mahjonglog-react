import {
	checkAccountIDExist,
	registerAccount,
} from '../repository/registerRepository';
import { useHandleAuth } from './useHandleAuth';

export const useHandleRegister = () => {
	const { update } = useHandleAuth();
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
		await registerAccount({ email, password, accountID, accountName });
		update();
	};

	return { submitRegister };
};
