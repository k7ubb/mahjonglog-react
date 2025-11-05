import { useState, useEffect } from 'react';
import { useHandleLog } from './useHandleLog';
import { type PersonalScore, calculatePersonalScore } from '../utils/personalScore';

export const useHandlePersonalScore = (player: string) => {
	const { logs, loading: logLoading } = useHandleLog();
	const [personalScore, setPersonalScore] =
		useState<PersonalScore | undefined>();
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setPersonalScore(calculatePersonalScore(logs, player));
		setLoading(false);
	};

	useEffect(() => {
		if (!logLoading) {
			update();
		}
	}, [logLoading, logs]);

	return {
		personalScore,
		loading,
	};
};
