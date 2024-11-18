import {
	getEmailByAccountId,
	loginAccount,
} from '../repository/loginRepository.ts';

export const useHandleLogin = () => {
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
	};

	return { submitLogin };
};
