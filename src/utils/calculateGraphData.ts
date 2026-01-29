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
