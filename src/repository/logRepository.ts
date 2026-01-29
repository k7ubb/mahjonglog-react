import {
	getFirestore,
	getDocs,
	addDoc,
	setDoc,
	deleteDoc,
	doc,
	collection,
	query,
	where,
} from 'firebase/firestore';
import type { Score, Log } from '@/usecase/useHandleLog';
import { FirebaseApp } from '@/lib/firebase';

export const getFirestoreLogs = async (uid: string) => (
	await getDocs(
		query(
			collection(getFirestore(FirebaseApp), 'logs'),
			where('uid', '==', uid),
		),
	)
).docs
	.map((doc) => ({
		id: doc.id,
		date: doc.data().date as number,
		score: doc.data().score as Score,
	}) as Log)
	.sort((a, b) => b.date - a.date);

export const getFirestoreDeletedLogs = async (uid: string) => (
	await getDocs(
		query(
			collection(getFirestore(FirebaseApp), 'logs-archive'),
			where('uid', '==', uid),
		),
	)
).docs
	.map(
		(doc) => ({
			id: doc.id,
			date: doc.data().date as number,
			score: doc.data().score as Score,
		}) as Log
	)
	.sort((a, b) => b.date - a.date);

export const addFirestoreLog = async (uid: string, score: Score) => {
	await addDoc(collection(getFirestore(FirebaseApp), 'logs'), {
		date: new Date().getTime(),
		uid,
		score,
	});
};

export const deleteFirestoreLog = async (uid: string, id: string, log: Log) => {
	await deleteDoc(doc(getFirestore(FirebaseApp), 'logs', id));
	await setDoc(doc(getFirestore(FirebaseApp), 'logs-archive', id), {
		date: log.date,
		score: log.score,
		uid: uid,
	});
};

export const restoreFirestoreLog = async (
	uid: string,
	id: string,
	log: Log,
) => {
	await deleteDoc(doc(getFirestore(FirebaseApp), 'logs-archive', id));
	await setDoc(doc(getFirestore(FirebaseApp), 'logs', id), {
		date: log.date,
		score: log.score,
		uid: uid,
	});
};

export const deleteFirestoreLogCompletely = async (uid: string) => {
	const logs = await getFirestoreDeletedLogs(uid);
	for (const log of logs) {
		await deleteDoc(doc(getFirestore(FirebaseApp), 'logs-archive', log.id));
	}
};
