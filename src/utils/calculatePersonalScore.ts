import { type Log } from '@/usecase/useHandleLog';

export type PersonalScore = {
	rank: [number, number, number, number];
	count: number;
	average_rank: number;
	score: number;
	average_score: number;
};

export const calculatePersonalScore = (logs: Log[], player: string) => {
	const personalScore: PersonalScore = {
		rank: [0, 0, 0, 0],
		count: 0,
		average_rank: 0,
		score: 0,
		average_score: 0,
	};
	for (const log of logs) {
		for (let i = 0; i < 4; i++) {
			if (log.score[i].player === player) {
				personalScore.rank[i]++;
				personalScore.count++;
				personalScore.score += log.score[i].point;
			}
		}
	}
	if (personalScore.count !== 0) {
		personalScore.average_rank =
			Math.floor(
				(personalScore.rank
					.map((point, i) => point * (i + 1))
					.reduce((a, b) => a + b, 0) /
					personalScore.count) *
					100,
			) / 100;
		personalScore.average_score =
			Math.floor((personalScore.score / personalScore.count) * 100) / 100;
	}
	return personalScore;
};
