import { type Log } from '@/contexts/useAppData';
import { formatDate } from '@/utils/formatDate';

export type GraphData = {
	label: string;
	score: number;
};

export const calculateGraphData = (logs: Log[], player: string, filterFrom: string | undefined, filterTo: string | undefined) => {
	const graphData: GraphData[] = [];

	for (const log of logs.toReversed()) {
		for (let i = 0; i < 4; i++) {
			if (log.score[i].player === player) {
				graphData.push({
					label: formatDate(new Date(log.date)),
					score:
						log.score[i].point +
						(graphData.length > 0 ? graphData[graphData.length - 1].score : 0),
				});
			}
		}
	}

	if (graphData.length > 0) {
		graphData.unshift({
			label: graphData[0].label,
			score: 0
		});
	}

	return graphData
		// アプリ移行前のデータを除外
		.filter((data) => data.label !== '1970-01-01')
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

export const calculateRelativeGraphData = (logs: Log[], players: string[], filterFrom: string | undefined, filterTo: string | undefined, isNormalize: boolean) => {
	const graphData: RelativeGraphData[] = [];
	for (const log of logs.toReversed()) {
		if (log.score.map((score) => score.player).some(item => players.includes(item))) {
			graphData.push({
				label: formatDate(new Date(log.date)),
				score: Object.fromEntries(players.map((player) => {
					const pointDiff = log.score.filter((s) => s.player === player).reduce((a, s) => a + s.point, 0);
					return [
						player,
						pointDiff + (graphData.length > 0 ? graphData[graphData.length - 1].score[player] : 0)
					];
				}))
			});
		}
	}

	if (graphData.length > 0) {
		graphData.unshift({
			label: graphData[0].label,
			score: Object.fromEntries(players.map((player) => [player, 0]))
		});
	}

	const filterGraphData = graphData
		// アプリ移行前のデータを除外
		.filter((data) => data.label !== '1970-01-01')
		// フィルターが設定されていたら範囲外のみ抽出
		.filter((data) => !filterFrom || filterFrom < data.label)
		.filter((data) => !filterTo || data.label < filterTo);

	if (!isNormalize) {
		return filterGraphData;
	}

	const minmax = Object.fromEntries(players.map((player) => {
		const scores = filterGraphData.map((data) => data.score[player]);
		return [
			player,
			{
				min: Math.min(...scores),
				max: Math.max(...scores),
			}
		];
	}));

	return filterGraphData.map((data) => ({
		label: data.label,
		score: Object.fromEntries(players.map((player) => {
			const {min, max} = minmax[player];
			return [
				player,
				min === max ? 0 : ((data.score[player] - min) / (max - min)) * 100
			];
		})),
	}));
};
