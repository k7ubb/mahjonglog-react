import { getFirestore, getDoc, setDoc, doc } from 'firebase/firestore';
import { FirebaseApp } from '../lib/firebase';

export const getFirestorePlayers = async (uid: string) => {
	const data = (
		await getDoc(doc(getFirestore(FirebaseApp), 'players', uid))
	).data();
	return data ? data.players : [];
};

export const updateFirestorePlayers = async (
	uid: string,
	players: string[]
) => {
	await setDoc(doc(getFirestore(FirebaseApp), 'players', uid), { players });
};
