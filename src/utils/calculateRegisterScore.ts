import { type Score } from '@/contexts/useAppData';

// playerIdsとpointsのindexが一致する値を渡すこと。
export const calculateRegisterScore = (rawPlayerIDs: string[], rawPoints: number[]) => {
	const scores = new Array(4)
		.fill(null)
		.map((_, i) => ({
			point: rawPoints[i],
			playerID: rawPlayerIDs[i]
		}) as Score)
		.sort((a, b) => b.point - a.point);

	scores[0].point = Math.round((scores[0].point + 100 - 1) / 10);
	scores[1].point = Math.round((scores[1].point - 200 - 1) / 10);
	scores[2].point = Math.round((scores[2].point - 400 - 1) / 10);
	scores[3].point = Math.round((scores[3].point - 500 - 1) / 10);

	const playerIDs = scores.map((score) => score.playerID);

	return { playerIDs, scores };
};
