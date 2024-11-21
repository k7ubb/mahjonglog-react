import { useState, useEffect } from 'react';
import {
	getFirestorePlayers,
	updateFirestorePlayers,
} from '../repository/playerRepository';
import { useHandleUser } from '../usecase/useHandleUser';

export const useHandlePlayer = () => {
	const { user } = useHandleUser();
	const [players, setPlayers] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	const update = async () => {
		setLoading(true);
		setPlayers(user ? await getFirestorePlayers(user.uid) : []);
		setLoading(false);
	};

	useEffect(() => {
		update();
	}, [user]);

	const addPlayer = async (newPlayer: string) => {
		if (players.includes(newPlayer)) {
			throw new Error('この名前はすでに使われています');
		}
		if (!user) {
			throw new Error('login error');
		}
		await updateFirestorePlayers(user.uid, [...players, newPlayer]);
		await update();
	};

	const deletePlayer = async (player: string) => {
		if (!user) {
			throw new Error('login error');
		}
		await updateFirestorePlayers(
			user.uid,
			players.filter((_) => _ !== player)
		);
		await update();
	};

	return {
		players,
		loading,
		addPlayer,
		deletePlayer,
	};
};
