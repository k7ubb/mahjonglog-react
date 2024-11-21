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

	const addPlayer = async (newPlayerName: string) => {
		if (players.includes(newPlayerName)) {
			throw new Error('この名前はすでに使われています');
		}
		if (!user) {
			throw new Error('login error');
		}
		await updateFirestorePlayers(user.uid, [...players, newPlayerName]);
		await update();
	};

	return {
		players,
		loading,
		addPlayer,
	};
};
