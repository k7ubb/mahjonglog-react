import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { FirebaseApp } from '../lib/firebase';

type Score = {
	point: number;
	player: string;
}[];

export const addFirestoreLog = async (uid: string, score: Score) => {
	await addDoc(collection(getFirestore(FirebaseApp), 'log'), {
		date: new Date().getTime(),
		uid,
		score,
	});
};
