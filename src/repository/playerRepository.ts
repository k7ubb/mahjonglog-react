import {
	getFirestore,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	collection,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import type { Player } from '@/contexts/useAppData';
import { FirebaseApp } from '@/lib/firebase';

export const getFirestorePlayers = async (uid: string) => (
	await getDocs(
		query(
			collection(getFirestore(FirebaseApp), 'players_v2'),
			where('uid', '==', uid),
		),
	)
).docs
	.map((doc) => ({
		id: doc.id,
		name: doc.data().name as string,
		otherApp: doc.data().otherApp as {
			rank: number[],
			score: number
		}
	}) as Player);

export const addFirestorePlayer = async (uid: string, name: string) => {
	await addDoc(collection(getFirestore(FirebaseApp), 'players_v2'), {
		uid,
		name,
		otherApp: {
			rank: [0, 0, 0, 0],
			score: 0
		}
	});
};

export const changeFirestorePlayerName = async (pid: string, newName: string) => {
	await updateDoc(doc(getFirestore(FirebaseApp), 'players_v2', pid), {
		name: newName
	});
};

export const deleteFirestorePlayer = async (pid: string) => {
	await deleteDoc(doc(getFirestore(FirebaseApp), 'players_v2', pid));
};
