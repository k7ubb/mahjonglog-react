import { type Log } from '@/contexts/useAppData';
import { formatDate } from '@/utils/formatDate';

export type GraphData = {
	label: string;
	score: number;
};

export const calculateGraphData = (logs: Log[], playerID: string, filterFrom: string | undefined, filterTo: string | undefined) => {
	const graphData: GraphData[] = [];

	for (const log of logs.toReversed()) {
		const index = log.playerIDs.findIndex((id) => id === playerID);
		if (index > -1) {
			graphData.push({
				label: formatDate(new Date(log.date)),
				score:
					log.scores[index].point +
					(graphData.length > 0 ? graphData[graphData.length - 1].score : 0),
			});
		}
	}

	if (graphData.length > 0) {
		graphData.unshift({
			label: graphData[0].label,
			score: 0
		});
	}

	return graphData
		// フィルターが設定されていたら範囲外のみ抽出
		.filter((data) => !filterFrom || filterFrom < data.label)
		.filter((data) => !filterTo || data.label < filterTo);
};

export type RelativeGraphData = {
	label: string;
	score: {
		[player: string]: number;
	};
};

export const calculateRelativeGraphData = (logs: Log[], playerIDs: string[], filterFrom: string | undefined, filterTo: string | undefined, isNormalize: boolean) => {
	const graphData: RelativeGraphData[] = [];
	for (const log of logs.toReversed()) {
		if (log.playerIDs.some((id) => playerIDs.includes(id))) {
			graphData.push({
				label: formatDate(new Date(log.date)),
				score: Object.fromEntries(playerIDs.map((playerID) => {
					const pointDiff = log.scores.find((s) => s.playerID === playerID)?.point || 0;
					return [
						playerID,
						pointDiff + (graphData.length > 0 ? graphData[graphData.length - 1].score[playerID] : 0)
					];
				}))
			});
		}
	}

	if (graphData.length > 0) {
		graphData.unshift({
			label: graphData[0].label,
			score: Object.fromEntries(playerIDs.map((playerID) => [playerID, 0]))
		});
	}

	const filterGraphData = graphData
		// フィルターが設定されていたら範囲外のみ抽出
		.filter((data) => !filterFrom || filterFrom < data.label)
		.filter((data) => !filterTo || data.label < filterTo);

	if (!isNormalize) {
		return filterGraphData;
	}

	const minmax = Object.fromEntries(playerIDs.map((playerID) => {
		const scores = filterGraphData.map((data) => data.score[playerID]);
		return [
			playerID,
			{
				min: Math.min(...scores),
				max: Math.max(...scores),
			}
		];
	}));

	return filterGraphData.map((data) => ({
		label: data.label,
		score: Object.fromEntries(playerIDs.map((playerID) => {
			const {min, max} = minmax[playerID];
			return [
				playerID,
				min === max ? 0 : ((data.score[playerID] - min) / (max - min)) * 100
			];
		})),
	}));
};
