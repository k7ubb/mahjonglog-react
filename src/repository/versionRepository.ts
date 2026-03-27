import {
	getFirestore,
	getDoc,
	doc,
} from 'firebase/firestore';
import { FirebaseApp } from '@/lib/firebase';

export const getFirestoreVersion = async () => {
	const { version } = (await getDoc(doc(getFirestore(FirebaseApp), 'app', 'version'))).data() as { version: string; };
	return { version };
};
