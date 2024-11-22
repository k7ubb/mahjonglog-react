import { useState, useEffect, createContext, useContext } from 'react';
import {
	getAuthUserData,
	updateUserData,
} from '../repository/userRepository.ts';

export type AuthUser = {
	uid: string;
	email: string;
	accountID: string;
	accountName: string;
};

const AuthContext = createContext<{
	user?: AuthUser;
	loading: boolean;
	update: () => Promise<void>;
	updateProfile: (accountID: string, accountName: string) => Promise<void>;
}>({
	loading: true,
	update: async () => {},
	updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setUser(undefined);
		setLoading(true);
		setUser(await getAuthUserData());
		setLoading(false);
	};

	useEffect(() => {
		update();
	}, []);

	const updateProfile = async (accountID: string, accountName: string) => {
		if (!user) {
			throw new Error('login error');
		}
		await updateUserData(user.uid, {
			email: user.email,
			accountID,
			accountName,
		});
		await update();
	};

	return (
		<AuthContext.Provider value={{ user, loading, update, updateProfile }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useHandleUser = () => useContext(AuthContext);
