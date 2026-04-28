import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useLoading } from '@/contexts/useLoading';
import { updateUserDataWithAuth } from '@/lib/cryptoStorage';
import {
	getFirestoreUserData,
	changeFirestoreUserName,
} from '@/repository/userRepository';

export type User = {
	uid: string;
	email: string;
	accountID: string;
	accountName: string;
};

export type UserData = {
	login: true;
	user: User
} | {
	login: false;
	user: null;
};

type UseDataFunctions = {
	update: () => Promise<void>;
	updateAccountName: (accountName: string) => Promise<void>;
}

const UserContext = createContext<UserData & UseDataFunctions>(null!);
const AuthUserContext = createContext<User & UseDataFunctions>(null!);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { startLoading, endLoading } = useLoading();
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<UserData>({
		login: false,
		user: null
	});

	const update = async () => {
		setLoading(true);
		startLoading();
		try {
			const user = await getFirestoreUserData();
			if (user) {
				setUserData({
					login: true,
					user
				});
			} else {
				setUserData({
					login: false,
					user: null
				});
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		} finally {
			setLoading(false);
			endLoading();
		}
	};

	useEffect(() => {
		void update();
	}, []);

	const updateAccountName = async (newAccountName: string) => {
		if (!userData.login) {
			throw new Error('updateProfileを使用するにはログインする必要があります');
		}
		await changeFirestoreUserName(userData.user.uid, newAccountName);
		await updateUserDataWithAuth({
			...userData.user,
			accountID: userData.user.accountID,
			accountName: newAccountName
		});
		await update();
	};

	if (loading) { return null; }

	return (
		<UserContext.Provider value={{
			...userData,
			update,
			updateAccountName
		}}>
			{userData.login ? (
				<AuthUserContext.Provider value={{ ...userData.user, update, updateAccountName }}>
					{children}
				</AuthUserContext.Provider>
			) : (
				<>{children}</>
			)}
		</UserContext.Provider>
	);
};

export const useUserData = () => useContext(UserContext);

export const useAuthUserData = () => useContext(AuthUserContext);
