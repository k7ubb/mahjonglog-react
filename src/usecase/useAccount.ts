import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useUserData, type User } from '@/contexts/useUserData';
import { decrypt, getUsersDataWithAuth, saveUserDataWithAuth, removeUserDataWithAuth } from '@/lib/cryptoStorage';
import {
	getEmailByAccountID,
	checkAccountIDExist,
	fireauthLogin,
	fireauthRegister,
	fireauthLogout,
} from '@/repository/authRepository';
import { getAuthUserData } from '@/repository/userRepository';

export type UserDataWithAuth = User & {
	encryptedPass: ArrayBuffer;
	iv: Uint8Array;
};

export const useAccount = () => {
	const { update } = useUserData();
	const [users, setUsers] = useState<(UserDataWithAuth & { current: boolean })[]>([]);

	const updateUsers = async () => {
		const auth = getAuth();
		const usersWithoutCurrent = await getUsersDataWithAuth();
		setUsers(usersWithoutCurrent.map((user) => ({
			...user,
			current: user.uid === auth.currentUser?.uid,
		})));
	};

	useEffect(() => {
		void updateUsers();
	}, []);

	// usersからログインした場合、失敗時に削除するためuidも渡す
	const login = async ({
		emailOrAccountID,
		password,
		uid
	}: {
		emailOrAccountID: string;
		password: string;
		uid?: string;
	}) => {
		const email = emailOrAccountID.match(/^.+@.+$/)
			? emailOrAccountID
			: await getEmailByAccountID(emailOrAccountID);
		try {
			await fireauthLogin({ email, password });
			const user = await getAuthUserData();
			if (!user) {
				throw new Error('ログインに失敗しました。');
			}
			await saveUserDataWithAuth(user, password);
		} catch (e) {
			if (uid) {
				await removeUserDataWithAuth(uid);
			}
			await logout();
			throw e;
		} finally {
			await update();
		}
	};

	const register = async ({
		email,
		password,
		accountID,
		accountName,
	}: {
		email: string;
		password: string;
		accountID: string;
		accountName: string;
	}) => {
		await checkAccountIDExist(accountID);
		try {
			await fireauthRegister({ email, password, accountID, accountName });
			const user = await getAuthUserData();
			if (!user) {
				throw new Error('アカウント登録に失敗しました');
			}
			await saveUserDataWithAuth(user, password);
		} catch (e) {
			await logout();
			throw e;
		}	finally {
			await update();
		}
	};
	
	const changeUser = async (uid: string) => {
		const target = users.find((a) => a.uid === uid);
		if (!target) throw new Error('アカウントが見つかりません');
		const password = await decrypt(target.encryptedPass, target.iv);
		await login({ emailOrAccountID: target.email, password, uid });
	};

	const logout = async () => {
		const auth = getAuth();
		if (auth.currentUser) {
			await removeUserDataWithAuth(auth.currentUser.uid);
		}
		await fireauthLogout();
		await update();
	};

	return {
		login,
		users,
		register,
		logout,
		changeUser
	};
};
