import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { User, UserData } from '@/contexts/useUserData';
import { FirebaseApp } from '@/lib/firebase';

export const getFirestoreUserData = async (): Promise<UserData> => {
	const auth = getAuth();
	return new Promise<UserData>((resolve) => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				resolve({ status: 'unlogin', user: null });
			} else {
				void getDoc(doc(getFirestore(FirebaseApp), 'account', user.uid))
					.then((doc) => {
						const data = doc.data() as Omit<User, 'uid'> | undefined;
						const userData = data?.email && data?.accountID && data?.accountName
							? {
								uid: user.uid,
								email: data.email,
								accountID: data.accountID,
								accountName: data.accountName,
							}
							: null;
						if (!userData) {
							resolve({ status: 'unlogin', user: null });
						}
						else if (!user.emailVerified) {
							resolve({ status: 'unauthenticated', user: userData });
						}
						else {
							resolve({ status: 'login', user: userData });
						}
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
