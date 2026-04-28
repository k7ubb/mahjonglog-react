import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { User } from '@/contexts/useUserData';
import { FirebaseApp } from '@/lib/firebase';

export const getFirestoreUserData = async () => {
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

export const changeFirestoreUserName = async (uid: string, newAccountName: string) => {
	await updateDoc(doc(getFirestore(FirebaseApp), 'account', uid), {
		accountName: newAccountName
	});
};
