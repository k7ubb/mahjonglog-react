import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '../lib/firebase';
import type { AuthUser } from '../usecase/useHandleUser';

export const getAuthUserData = async () => {
	const auth = getAuth();
	return new Promise<AuthUser>((resolve) => {
		onAuthStateChanged(auth, async (user) => {
			if (!user) {
				resolve(null);
			} else {
				const account = (
					await getDoc(doc(getFirestore(FirebaseApp), 'account', user.uid))
				).data();
				resolve(
					account?.email && account?.accountID && account?.accountName
						? {
								uid: user.uid,
								email: account.email,
								accountID: account.accountID,
								accountName: account.accountName,
						  }
						: null
				);
			}
		});
	});
};
