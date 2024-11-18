import {
	getEmailByAccountId,
	loginAccount,
} from '../repository/loginRepository.ts';
import { useHandleAuth } from './useHandleAuth.tsx';

export const useHandleLogin = () => {
	const { update } = useHandleAuth();
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
		await loginAccount({ email, password });
		update();
	};

	return { submitLogin };
};
