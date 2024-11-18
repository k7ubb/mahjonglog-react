import { useState, useEffect, createContext, useContext } from 'react';
import { getAuthUserData } from '../repository/authRepository.ts';

export type AuthUser = {
	uid: string;
	email: string;
	accountID: string;
	accountName: string;
} | null;

const AuthContext = createContext<{
	user: AuthUser;
	loading: boolean;
	update: () => Promise<void>;
}>({
	user: null,
	loading: true,
	update: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser>(null);
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setUser(null);
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

export const useHandleAuth = () => useContext(AuthContext);
