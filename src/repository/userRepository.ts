import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { AuthUser } from '@/usecase/useHandleUser';
import { FirebaseApp } from '@/lib/firebase';

export const getAuthUserData = async () => {
	const auth = getAuth();
	return new Promise<AuthUser | undefined>((resolve) => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				resolve(undefined);
			} else {
				void getDoc(doc(getFirestore(FirebaseApp), 'account', user.uid))
					.then((doc) => {
						const data = doc.data() as Omit<AuthUser, 'uid'> | undefined;
						resolve(
							data?.email && data?.accountID && data?.accountName
								? {
									uid: user.uid,
									email: data.email,
									accountID: data.accountID,
									accountName: data.accountName,
								}
								: undefined,
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
