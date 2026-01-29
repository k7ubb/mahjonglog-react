import { useState, useEffect } from 'react';
import { useHandleLog } from '@/usecase/useHandleLog';
import {
	type PersonalScore,
	calculatePersonalScore,
} from '@/utils/personalScore';

export const useHandlePersonalScore = (player: string) => {
	const { logs, loading: logLoading } = useHandleLog();
	const [personalScore, setPersonalScore] = useState<
		PersonalScore | undefined
	>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!logLoading) {
			setPersonalScore(calculatePersonalScore(logs, player));
			setLoading(false);
		}
	}, [logLoading, logs]);

	return {
		personalScore,
		loading,
	};
};
