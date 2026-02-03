import { type Log } from '@/usecase/useHandleLog';
import { formatDate } from '@/utils/formatDate';

export type GraphData = {
	label: string;
	score: number;
};

export const calculateGraphData = (allLogs: Log[], player: string, filter: { from?: string; to?: string }) => {
	const graphData: GraphData[] = [];
	for (const log of allLogs.toReversed()) {
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
	return graphData
		// アプリ移行前のデータを除外
		.filter((data) => data.label !== '1970-01-01')
		// フィルターが設定されていたら範囲外のみ抽出
		.filter((data) => !filter.from || filter.from < data.label)
		.filter((data) => !filter.to || data.label < filter.to);
};

export type RelativeGraphData = {
	label: string;
	score: {
		[player: string]: number;
	};
};

export const calculateRelativeGraphData = (allLogs: Log[], players: string[], filter: { from?: string; to?: string }) => {
	const graphData: RelativeGraphData[] = [];
	for (const log of allLogs.toReversed()) {
		if (log.score.map((score) => score.player).some(item => players.includes(item))) {
			graphData.push({
				label: formatDate(new Date(log.date)),
				score: {
					...Object.fromEntries(players.map((player) => {
						const pointDiff = log.score.filter((s) => s.player === player).reduce((a, s) => a + s.point, 0);
						return [
							player,
							pointDiff + (graphData.length > 0 ? graphData[graphData.length - 1].score[player] : 0)
						];
					}
					))}
			});
		}
	}
	const filterGraphData = graphData
		// アプリ移行前のデータを除外
		.filter((data) => data.label !== '1970-01-01')
		// フィルターが設定されていたら範囲外のみ抽出
		.filter((data) => !filter.from || filter.from < data.label)
		.filter((data) => !filter.to || data.label < filter.to);

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
