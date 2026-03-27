import { useState, useEffect, createContext, useContext } from 'react';
import {
	getFirestoreVersion,
} from '@/repository/versionRepository';

const VersionContext = createContext<{
	version: string;
	loading: boolean;
}>({
	version: '',
	loading: false,
});

export const VersionProvider = ({ children }: { children: React.ReactNode }) => {
	const [version, setVersion] = useState('');
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setLoading(true);
		const { version } = await getFirestoreVersion();
		setVersion(version);
		setLoading(false);
	};

	useEffect(() => {
		void update();
	}, []);
	
	return (
		<VersionContext.Provider
			value={{ version, loading }}
		>
			{children}
		</VersionContext.Provider>
	);
};

export const useHandleVersion = () => useContext(VersionContext);
