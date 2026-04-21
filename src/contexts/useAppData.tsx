import { useState, useEffect, useContext, createContext } from 'react';
import { useLoading } from '@/contexts/useLoading';
import { useUserData } from '@/contexts/useUserData';
import {
	getFirestoreLogs,
	getFirestoreDeletedLogs,
	addFirestoreLog,
	deleteFirestoreLog,
	restoreFirestoreLog,
	deleteFirestoreLogCompletely,
} from '@/repository/logRepository';
import {
	getFirestorePlayers,
	updateFirestorePlayers,
} from '@/repository/playerRepository';
import { parseScore } from '@/utils/score';

export type Score = {
	point: number;
	player: string;
}[];

export type Log = {
	id: string;
	date: number;
	score: Score;
};

export type AppData = {
	players: string[];
	logs: Log[];
	deletedLogs: Log[];
	isFilterDialogOpen: boolean;
	filterFrom: string;
	filterTo: string;
	filteredLogs: Log[];
};

type AppDataFunctions = {
	addPlayer: (playerName: string) => Promise<void>;
	deletePlayer: (playerId: string) => Promise<void>;
	addLog: (playerName: string[], scoreString: string[]) => Promise<void>;
	deleteLog: (id: string) => Promise<void>;
	restoreLog: (id: string) => Promise<void>;
	deleteLogCompletely: () => Promise<void>;
	openFilterDialog: () => void;
	closeFilterDialog: () => void;
	setFilter: (from: string, to: string) => void;
};

type AppDataState = 'guest' | 'loading' | 'ready';

const AppDataContext = createContext<AppData & AppDataFunctions>(null!);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
	const { login, user } = useUserData();
	const { startLoading, endLoading } = useLoading();
	const [state, setState] = useState<AppDataState>(login ? 'loading' : 'guest');
	const [players, setPlayers] = useState<string[]>([]);
	const [logs, setLogs] = useState<Log[]>([]);
	const [deletedLogs, setDeletedLogs] = useState<Log[]>([]);
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [filterFrom, setFilterFrom] = useState<string>('');
	const [filterTo, setFilterTo] = useState<string>('');
	const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);

	// Promise.allで並列実行する場合は、stateの更新を行わない
	const updatePlayers = async (skipSetState?: boolean) => {
		if (!login) { return; }
		if (!skipSetState) {
			setState('loading');
			startLoading();
		}
		try {
			const players = await getFirestorePlayers(user.uid);
			setPlayers(players);
		} catch (error) {
			console.error('Error fetching players:', error);
		} finally {
			if (!skipSetState) {
				setState('ready');
				endLoading();
			}
		}
	};

	// Promise.allで並列実行する場合は、stateの更新を行わない
	const updateLogs = async (skipSetState?: boolean) => {
		if (!login) { return; }
		if (!skipSetState) {
			setState('loading');
			startLoading();
		}
		try {
			const logs = await getFirestoreLogs(user.uid);
			const deletedLogs = await getFirestoreDeletedLogs(user.uid);
			setLogs(logs);
			setDeletedLogs(deletedLogs);
		} catch (error) {
			console.error('Error fetching logs:', error);
		} finally {
			if (!skipSetState) {
				setState('ready');
				endLoading();
			}
		}
	};

	useEffect(() => {
		if (!login) { return; }
		startLoading();
		setState('loading');
		void Promise.all([updatePlayers(true), updateLogs(true)])
			.finally(() => {
				setState('ready');
				endLoading();
			});
	}, [user]);

	useEffect(() => {
		if (!login) { return; }
		if (filterFrom && filterTo) {
			const from = new Date(filterFrom).getTime();
			const to = new Date(filterTo).getTime();
			setFilteredLogs(logs.filter((log) => from <= log.date && log.date <= to));
		} else {
			setFilteredLogs(logs);
		}
	}, [logs, filterFrom, filterTo]);

	const addPlayer = async (newPlayer: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		if (players.includes(newPlayer)) {
			throw new Error('この名前はすでに使われています');
		}
		await updateFirestorePlayers(user.uid, [...players, newPlayer]);
		await updatePlayers();
	};

	const deletePlayer = async (deleteTarget: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		await updateFirestorePlayers(user.uid, players.filter((p) => p !== deleteTarget));
		await updatePlayers();
	};

	const addLog = async (playerName: string[], scoreString: string[]) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
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
				}`,
			);
		}
		const score = new Array(4)
			.fill(null)
			.map((_, i) => ({
				point: scoreNum[i],
				player: playerName[i]
			}))
			.sort((a, b) => b.point - a.point)
			.map((scr, i) => ({
				point: parseScore[i](scr.point),
				player: scr.player,
			}));
		await addFirestoreLog(user.uid, score);
		await updateLogs();
	};

	const deleteLog = async (id: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		const deleteTarget = logs.find((log) => log.id === id);
		if (!deleteTarget) {
			throw new Error('log not found');
		}
		await deleteFirestoreLog(user.uid, id, deleteTarget);
		await updateLogs();
	};

	const restoreLog = async (id: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		const restoreTarget = deletedLogs.find((log) => log.id === id);
		if (!restoreTarget) {
			throw new Error('log not found');
		}
		await restoreFirestoreLog( user.uid, id, restoreTarget );
		await updateLogs();
	};

	const deleteLogCompletely = async () => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		await deleteFirestoreLogCompletely(user.uid);
		await updateLogs();
	};

	if (state === 'loading') { return null; }

	return (
		<AppDataContext.Provider
			value={{
				players,
				logs,
				deletedLogs,
				isFilterDialogOpen,
				filterFrom,
				filterTo,
				filteredLogs,
				openFilterDialog: () => setIsFilterDialogOpen(true),
				closeFilterDialog: () => setIsFilterDialogOpen(false),
				setFilter: (from, to) => {
					setFilterFrom(from);
					setFilterTo(to);
				},
				addPlayer,
				deletePlayer,
				addLog,
				deleteLog,
				restoreLog,
				deleteLogCompletely
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
};

export const useAppData = () => useContext(AppDataContext);
