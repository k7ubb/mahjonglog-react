import {
	getFirestore,
	getDocs,
	addDoc,
	collection,
	query,
	where,
} from 'firebase/firestore';
import { FirebaseApp } from '../lib/firebase';
import type { Score } from '../usecase/useHandleLog';

export const getFirestoreLogs = async (uid: string) => {
	const datas = (
		await getDocs(
			query(
				collection(getFirestore(FirebaseApp), 'logs'),
				where('uid', '==', uid)
			)
		)
	).docs
		.map((doc) => doc.data())
		.sort((a, b) => a.date - b.date);
	const logs: { date: string; scores: Score[] }[] = [];
	for (const data of datas) {
		const d = new Date(data.date);
		const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		const element = logs.find((log) => log.date === date);
		if (element) {
			element.scores.push(data.score);
		} else {
			logs.push({
				date,
				scores: [data.score],
			});
		}
	}
	return logs;
};

export const addFirestoreLog = async (uid: string, score: Score) => {
	await addDoc(collection(getFirestore(FirebaseApp), 'logs'), {
		date: new Date().getTime(),
		uid,
		score,
	});
};
