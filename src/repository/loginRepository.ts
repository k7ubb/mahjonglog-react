import {
	getFirestore,
	collection,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseApp } from '../lib/firebase';

export const getEmailByAccountId = async (accountID: string) => {
	const docs = (
		await getDocs(
			query(
				collection(getFirestore(FirebaseApp), 'account'),
				where('accountID', '==', accountID)
			)
		)
	).docs;
	if (docs.length === 0) {
		throw new Error('登録されていないIDです。');
	} else {
		return docs[0].data().email;
	}
};

export const loginAccount = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	await signInWithEmailAndPassword(getAuth(), email, password);
};
