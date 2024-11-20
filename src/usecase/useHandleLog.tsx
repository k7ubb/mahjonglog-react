import { useState, useEffect } from 'react';
import {
	getFirestoreLogs,
	addFirestoreLog,
} from '../repository/logRepository.ts';
import { useHandleUser } from '../usecase/useHandleUser';

export type Score = {
	point: number;
	player: string;
}[];

const parseScore = [
	(point: number) => Math.round((point + 100 - 1) / 10),
	(point: number) => Math.round((point - 200 - 1) / 10),
	(point: number) => Math.round((point - 400 - 1) / 10),
	(point: number) => Math.round((point - 500 - 1) / 10),
];

export const useHandleLog = () => {
	const { user } = useHandleUser();
	const [logs, setLogs] = useState<{ date: string; scores: Score[] }[]>([]);
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setLoading(true);
		setLogs(user ? await getFirestoreLogs(user.uid) : []);
		setLoading(false);
	};

	useEffect(() => {
		update();
	}, [user]);

	const addLog = async (playerName: string[], scoreString: string[]) => {
		if (!user) {
			throw new Error('login error');
		}
		if (playerName.includes('')) {
			throw new Error('名前を選択してください');
		}
		if (playerName.length !== new Set(playerName).size) {
			throw new Error('同じプレイヤーが複数存在します');
		}
		const scoreNum = scoreString.map((s) => Number(s));
		const scoreTotal = scoreNum.reduce((a, b) => a + b, 0);
		if (scoreTotal !== 1000) {
			throw new Error(
				`合計点が ${Math.abs(1000 - scoreTotal)} 点${
					scoreTotal > 1000 ? '多い' : '少ない'
				}`
			);
		}
		const score = new Array(4)
			.fill(null)
			.map((_, i) => ({
				point: scoreNum[i],
				player: playerName[i],
			}))
			.sort((a, b) => b.point - a.point)
			.map((scr, i) => ({
				point: parseScore[i](scr.point),
				player: scr.player,
			}));
		await addFirestoreLog(user.uid, score);
	};

	return {
		logs,
		loading,
		addLog,
	};
};
