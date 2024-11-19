import { useState, useEffect, createContext, useContext } from 'react';
import { getAuthUserData } from '../repository/userRepository.ts';

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
}>({
	user: undefined,
	loading: true,
	update: async () => {},
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

	return (
		<AuthContext.Provider value={{ user, loading, update }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useHandleUser = () => useContext(AuthContext);
