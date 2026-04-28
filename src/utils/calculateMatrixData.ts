import { type Log } from '@/contexts/useAppData';

export const calculateMatrixData = (logs: Log[], playerIDs: string[]) => {
	const matrix: number[][][] = Array.from({ length: playerIDs.length }, () => 
		Array.from({ length: playerIDs.length }, () => [])
	);
	
	for (const log of logs) {
		for (const playerA of playerIDs) {
			for (const playerB of playerIDs) {
				const indexA = log.playerIDs.findIndex((id) => id === playerA);
				const indexB = log.playerIDs.findIndex((id) => id === playerB);
				if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
					matrix[playerIDs.indexOf(playerA)][playerIDs.indexOf(playerB)].push(indexA - indexB);
				}
			}
		}
	}

	return matrix.map((row) =>
		row.map((cell) => cell.length !== 0 ? cell.reduce((a, b) => a + b, 0) / cell.length : undefined)
	);
};
