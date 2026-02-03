import { type Log } from '@/usecase/useHandleLog';
import { formatDate } from '@/utils/formatDate';

export const calculateMatrixData = (logs: Log[], players: string[]) => {
	if (logs.length === 0) { return; }

	const matrix: number[][][] = Array.from({ length: players.length }, () => 
		Array.from({ length: players.length }, () => [])
	);

	// アプリ移行前のデータを除外
	const filteredLogs = logs.filter((log) => formatDate(new Date(log.date)) !== '1970-01-01');
	
	for (const log of filteredLogs) {
		for (const playerA of players) {
			for (const playerB of players) {
				const rankA = log.score.findIndex((s) => s.player === playerA);
				const rankB = log.score.findIndex((s) => s.player === playerB);
				if (rankA !== -1 && rankB !== -1 && rankA !== rankB) {
					matrix[players.indexOf(playerA)][players.indexOf(playerB)].push(rankA - rankB);
				}
			}
		}
	}

	return matrix.map((row) =>
		row.map((cell) => cell.length !== 0 ? cell.reduce((a, b) => a + b, 0) / cell.length : undefined)
	);
};
