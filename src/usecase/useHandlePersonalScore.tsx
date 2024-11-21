import { useState, useEffect } from 'react';
import { useHandleLog } from './useHandleLog';

type PersonalScore = {
	rank: [number, number, number, number];
	count: number;
	average_rank: number;
	score: number;
	average_score: number;
};

export const useHandlePersonalScore = (player: string) => {
	const { logs, loading: logLoading } = useHandleLog();
	const [personalScore, setPersonalScore] =
		useState<PersonalScore | undefined>();
	const [loading, setLoading] = useState(true);

	const update = async () => {
		const personalScore_: PersonalScore = {
			rank: [0, 0, 0, 0],
			count: 0,
			average_rank: 0,
			score: 0,
			average_score: 0,
		};
		for (const log of logs) {
			for (let i = 0; i < 4; i++) {
				if (log.score[i].player === player) {
					personalScore_.rank[i]++;
					personalScore_.count++;
					personalScore_.score += log.score[i].point;
				}
			}
		}
		if (personalScore_.count !== 0) {
			personalScore_.average_rank =
				Math.floor(
					(personalScore_.rank
						.map((point, i) => point * (i + 1))
						.reduce((a, b) => a + b, 0) /
						personalScore_.count) *
						100
				) / 100;
			personalScore_.average_score =
				Math.floor((personalScore_.score / personalScore_.count) * 100) / 100;
		}
		setPersonalScore(personalScore_);
		setLoading(false);
	};

	useEffect(() => {
		if (!logLoading) {
			update();
		}
	}, [logLoading]);

	return {
		personalScore,
		loading,
	};
};
