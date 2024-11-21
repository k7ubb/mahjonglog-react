import {
	getFirestore,
	getDocs,
	addDoc,
	collection,
	query,
	where,
} from 'firebase/firestore';
import { FirebaseApp } from '../lib/firebase';
import type { Score, Log } from '../usecase/useHandleLog';

export const getFirestoreLogs = async (uid: string) => {
	const docs = (
		await getDocs(
			query(
				collection(getFirestore(FirebaseApp), 'logs'),
				where('uid', '==', uid)
			)
		)
	).docs;
	return docs
		.map(
			(doc) =>
				<Log>{
					id: doc.id,
					date: doc.data().date,
					score: doc.data().score,
				}
		)
		.sort((a, b) => b.date - a.date);
};

export const addFirestoreLog = async (uid: string, score: Score) => {
	await addDoc(collection(getFirestore(FirebaseApp), 'logs'), {
		date: new Date().getTime(),
		uid,
		score,
	});
};
