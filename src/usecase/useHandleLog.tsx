import { useState, useEffect } from 'react';
import {
	getFirestoreLogs,
	getFirestoreDeletedLogs,
	addFirestoreLog,
	deleteFirestoreLog,
	restoreFirestoreLog,
	deleteFirestoreLogCompletely,
} from '../repository/logRepository.ts';
import { useHandleUser } from '../usecase/useHandleUser';

export type Score = {
	point: number;
	player: string;
}[];

export type Log = {
	id: string;
	date: number;
	score: Score;
};

const parseScore = [
	(point: number) => Math.round((point + 100 - 1) / 10),
	(point: number) => Math.round((point - 200 - 1) / 10),
	(point: number) => Math.round((point - 400 - 1) / 10),
	(point: number) => Math.round((point - 500 - 1) / 10),
];

export const useHandleLog = () => {
	const { user } = useHandleUser();
	const [logs, setLogs] = useState<Log[]>([]);
	const [deletedLogs, setDeletedLogs] = useState<Log[]>([]);
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setLoading(true);
		setLogs(user ? await getFirestoreLogs(user.uid) : []);
		setDeletedLogs(user ? await getFirestoreDeletedLogs(user.uid) : []);
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
				`合計点が ${Math.abs(1000 - scoreTotal) * 100} 点${
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

	const deleteLog = async (id: string) => {
		if (!user) {
			throw new Error('login error');
		}
		await deleteFirestoreLog(user.uid, id, logs.find((log) => log.id === id)!);
		await update();
	};

	const restoreLog = async (id: string) => {
		if (!user) {
			throw new Error('login error');
		}
		await restoreFirestoreLog(
			user.uid,
			id,
			deletedLogs.find((log) => log.id === id)!
		);
		await update();
	};

	const deleteLogCompletely = async () => {
		if (!user) {
			throw new Error('login error');
		}
		await deleteFirestoreLogCompletely(user.uid);
		await update();
	};

	return {
		logs,
		deletedLogs,
		loading,
		addLog,
		deleteLog,
		restoreLog,
		deleteLogCompletely,
		update,
	};
};
