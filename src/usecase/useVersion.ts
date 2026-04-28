import { useState, useEffect } from 'react';
import { getFirestoreVersion } from '@/repository/versionRepository';

export const useVersion = () => {
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
	
	return {
		version,
		loading,
	};
};
