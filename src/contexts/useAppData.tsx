import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';
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
	addFirestorePlayer,
	changeFirestorePlayerName,
	deleteFirestorePlayer
} from '@/repository/playerRepository';
import { calculatePoint } from '@/utils/point';

export type Player = {
	id: string;
	name: string;
	otherApp: {
		rank: [number, number, number, number],
		score: number
	}
};

export type Score = {
	playerID: string;
	point: number;
	rank: 1 | 2 | 3 | 4;
};

export type Log = {
	id: string;
	date: number;
	playerIDs: [string, string, string, string];
	scores: [Score, Score, Score: Score];
};

export type AppData = {
	players: Player[];
	logs: Log[];
	deletedLogs: Log[];
	isFilterDialogOpen: boolean;
	filterFrom: string;
	filterTo: string;
	isFilterEnabled: boolean;
	filteredLogs: Log[];
};

type AppDataFunctions = {
	update: () => Promise<void>;
	addPlayer: (name: string) => Promise<void>;
	changePlayerName: (playerId: string, newName: string) => Promise<void>;
	deletePlayer: (playerId: string) => Promise<void>;
	addLog: (name: string[], rawPoints: number[]) => Promise<void>;
	deleteLog: (id: string) => Promise<void>;
	restoreLog: (id: string) => Promise<void>;
	deleteLogCompletely: () => Promise<void>;
	openFilterDialog: () => void;
	closeFilterDialog: () => void;
	setFilter: (from: string, to: string) => void;
};

type AppDataState = 'guest' | 'loading' | 'ready';

const AppDataContext = createContext<AppData & AppDataFunctions>(null!);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
	const { login, user } = useUserData();
	const { startLoading, endLoading } = useLoading();
	const [state, setState] = useState<AppDataState>(login ? 'loading' : 'guest');
	const [players, setPlayers] = useState<Player[]>([]);
	const [logs, setLogs] = useState<Log[]>([]);
	const [deletedLogs, setDeletedLogs] = useState<Log[]>([]);
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [filterFrom, setFilterFrom] = useState<string>('');
	const [filterTo, setFilterTo] = useState<string>('');
	const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
	const isFilterEnabled = filterTo !== '' && filterFrom !== '';

	const update = async () => {
		if (!login) { return; }
		setState('loading');
		startLoading();
		try {
			const [players, logs, deletedLogs] = await Promise.all([
				getFirestorePlayers(user.uid),
				getFirestoreLogs(user.uid),
				getFirestoreDeletedLogs(user.uid)
			]);
			setPlayers(players);
			setLogs(logs);
			setDeletedLogs(deletedLogs);
		} catch (error) {
			console.error('Error fetching appData:', error);
		} finally {
			setState('ready');
			endLoading();
		}
	};

	useEffect(() => {
		void update();
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

	const addPlayer = async (name: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		if (players.some((p) => p.name === name)) {
			throw new Error('この名前はすでに使われています');
		}
		await addFirestorePlayer(user.uid, name);
		await update();
	};

	const changePlayerName = async (pid: string, newName: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		await changeFirestorePlayerName(pid, newName);
		await update();
	};

	const deletePlayer = async (pid: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		await deleteFirestorePlayer(pid);
		await update();
	};

	const addLog = async (playerIDs: string[], rawPoints: number[]) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		if (playerIDs.includes('')) {
			throw new Error('プレイヤーを選択してください');
		}
		if (playerIDs.length !== new Set(playerIDs).size) {
			throw new Error('同じプレイヤーが複数存在します');
		}
		const total = rawPoints.reduce((a, b) => a + b, 0);
		if (total !== 1000) {
			throw new Error(
				`合計点が ${Math.abs(1000 - total) * 100} 点${
					total > 1000 ? '多い' : '少ない'
				}です。修正してください。`,
			);
		}
		const points = calculatePoint(rawPoints);
		const scores = new Array(4)
			.fill(null)
			.map((_, i) => ({
				point: points[i],
				playerID: playerIDs[i]
			}) as Score)
			.sort((a, b) => b.point - a.point);
		await addFirestoreLog(user.uid, playerIDs, scores);
		await update();
	};

	const deleteLog = async (id: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		const deleteTarget = logs.find((log) => log.id === id);
		if (!deleteTarget) {
			throw new Error('log not found');
		}
		await deleteFirestoreLog(user.uid, id, deleteTarget);
		await update();
	};

	const restoreLog = async (id: string) => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		const restoreTarget = deletedLogs.find((log) => log.id === id);
		if (!restoreTarget) {
			throw new Error('log not found');
		}
		await restoreFirestoreLog( user.uid, id, restoreTarget );
		await update();
	};

	const deleteLogCompletely = async () => {
		if (!login) { throw new Error('AppDataにアクセスするにはログインする必要があります'); }
		await deleteFirestoreLogCompletely(user.uid);
		await update();
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
				isFilterEnabled,
				filteredLogs,
				update,
				openFilterDialog: () => setIsFilterDialogOpen(true),
				closeFilterDialog: () => setIsFilterDialogOpen(false),
				setFilter: (from, to) => {
					setFilterFrom(from);
					setFilterTo(to);
				},
				addPlayer,
				changePlayerName,
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
