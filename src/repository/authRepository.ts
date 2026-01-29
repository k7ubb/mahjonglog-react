import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from 'firebase/auth';
import {
	getFirestore,
	collection,
	getDocs,
	setDoc,
	doc,
	query,
	where,
} from 'firebase/firestore';
import { FirebaseApp } from '@/lib/firebase';

export const getEmailByAccountID = async (accountID: string) => {
	const docs = (
		await getDocs(
			query(
				collection(getFirestore(FirebaseApp), 'account'),
				where('accountID', '==', accountID),
			),
		)
	).docs;
	if (docs.length === 0) {
		throw new Error('登録されていないIDです。');
	} else {
		return docs[0].data().email as string;
	}
};

export const fireauthLogin = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	await signInWithEmailAndPassword(getAuth(), email, password);
};

export const checkAccountIDExist = async (accountID: string) => {
	const docs = (
		await getDocs(
			query(
				collection(getFirestore(FirebaseApp), 'account'),
				where('accountID', '==', accountID),
			),
		)
	).docs;
	if (docs.length !== 0) {
		throw new Error('このアカウントIDは使われています');
	}
};

export const fireauthRegister = async ({
	email,
	password,
	accountID,
	accountName,
}: {
	email: string;
	password: string;
	accountID: string;
	accountName: string;
}) => {
	await createUserWithEmailAndPassword(getAuth(), email, password);
	const auth = getAuth();
	return new Promise<void>((resolve, reject) => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				throw new Error('アカウント登録に失敗しました');
			}
			setDoc(
				doc(getFirestore(FirebaseApp), 'account', user.uid),
				{
					email,
					accountID,
					accountName,
				},
			).then(resolve).catch(reject);
		});
	});
};

export const fireauthLogout = async () => {
	await signOut(getAuth());
};
