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

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
};

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
		const date = formatDate(new Date(data.date));
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
	return logs.sort((a, b) => b.date.localeCompare(a.date));
};

export const addFirestoreLog = async (uid: string, score: Score) => {
	await addDoc(collection(getFirestore(FirebaseApp), 'logs'), {
		date: new Date().getTime(),
		uid,
		score,
	});
};
