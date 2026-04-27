import { type Player, type Log } from '@/contexts/useAppData';

export type PersonalScore = {
	rank: [number, number, number, number];
	count: number;
	average_rank: number;
	score: number;
	average_score: number;
};

export const calculatePersonalScore = (logs: Log[], player: Player, isFilterEnabled: boolean) => {
	const personalScore: PersonalScore = {
		rank: isFilterEnabled ? [0, 0, 0, 0] : [...player.otherApp.rank],
		count: isFilterEnabled ? 0 : player.otherApp.rank.reduce((a, b) => a + b, 0),
		average_rank: 0,
		score: isFilterEnabled ? 0 : player.otherApp.score,
		average_score: 0,
	};
	for (const log of logs) {
		const index = log.playerIDs.findIndex((id) => id === player.id);
		if (index > -1) {
			personalScore.rank[index]++;
			personalScore.count++;
			personalScore.score += log.scores[index].point;
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
