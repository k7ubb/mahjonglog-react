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
import type { Score, Log } from '@/contexts/useAppData';
import { FirebaseApp } from '@/lib/firebase';

export const getFirestoreLogs = async (uid: string) => (
	await getDocs(
		query(
			collection(getFirestore(FirebaseApp), 'logs_v2'),
			where('uid', '==', uid),
		),
	)
).docs
	.map((doc) => ({
		id: doc.id,
		date: doc.data().date as number,
		playerIDs: doc.data().playerIDs as string[],
		scores: doc.data().scores as Score[],
	}) as Log)
	.sort((a, b) => b.date - a.date);

export const getFirestoreDeletedLogs = async (uid: string) => (
	await getDocs(
		query(
			collection(getFirestore(FirebaseApp), 'logs-archive_v2'),
			where('uid', '==', uid),
		),
	)
).docs
	.map(
		(doc) => ({
			id: doc.id,
			date: doc.data().date as number,
			playerIDs: doc.data().playerIDs as string[],
			scores: doc.data().scores as Score[],
		}) as Log
	)
	.sort((a, b) => b.date - a.date);

export const addFirestoreLog = async (uid: string, playerIDs: string[], scores: Score[]) => {
	console.log({
		date: new Date().getTime(),
		uid,
		playerIDs,
		scores,
	});
	await addDoc(collection(getFirestore(FirebaseApp), 'logs_v2'), {
		date: new Date().getTime(),
		uid,
		playerIDs,
		scores,
	});
};

export const deleteFirestoreLog = async (uid: string, id: string, log: Log) => {
	await deleteDoc(doc(getFirestore(FirebaseApp), 'logs_v2', id));
	const { id: _id, ...rest } = log;
	await setDoc(doc(getFirestore(FirebaseApp), 'logs-archive_v2', id), {
		uid: uid,
		...rest,
	});
};

export const restoreFirestoreLog = async (uid: string, id: string, log: Log) => {
	await deleteDoc(doc(getFirestore(FirebaseApp), 'logs-archive_v2', id));
	const { id: _id, ...rest } = log;
	await setDoc(doc(getFirestore(FirebaseApp), 'logs_v2', id), {
		uid: uid,
		...rest
	});
};

export const deleteFirestoreLogCompletely = async (uid: string) => {
	const logs = await getFirestoreDeletedLogs(uid);
	for (const log of logs) {
		await deleteDoc(doc(getFirestore(FirebaseApp), 'logs-archive_v2', log.id));
	}
};
