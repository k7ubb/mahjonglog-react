import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '../lib/firebase';
import type { AuthUser } from '../usecase/useHandleUser';

export const getAuthUserData = async () => {
	const auth = getAuth();
	return new Promise<AuthUser | undefined>((resolve) => {
		onAuthStateChanged(auth, async (user) => {
			if (!user) {
				resolve(undefined);
			} else {
				const data = (
					await getDoc(doc(getFirestore(FirebaseApp), 'account', user.uid))
				).data();
				resolve(
					data?.email && data?.accountID && data?.accountName
						? {
								uid: user.uid,
								email: data.email,
								accountID: data.accountID,
								accountName: data.accountName,
						  }
						: undefined
				);
			}
		});
	});
};
