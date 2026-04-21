import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '@/contexts/useUserData';
import { FirebaseApp } from '@/lib/firebase';

export const getAuthUserData = async () => {
	const auth = getAuth();
	return new Promise<User | null>((resolve) => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				resolve(null);
			} else {
				void getDoc(doc(getFirestore(FirebaseApp), 'account', user.uid))
					.then((doc) => {
						const data = doc.data() as Omit<User, 'uid'> | undefined;
						resolve(
							data?.email && data?.accountID && data?.accountName
								? {
									uid: user.uid,
									email: data.email,
									accountID: data.accountID,
									accountName: data.accountName,
								}
								: null,
						);
					});
			}
		});
	});
};

export const updateUserData = async (
	uid: string,
	{
		email,
		accountID,
		accountName,
	}: {
		email: string;
		accountID: string;
		accountName: string;
	},
) => {
	await setDoc(doc(getFirestore(FirebaseApp), 'account', uid), {
		email,
		accountID,
		accountName,
	});
};
