import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, query, where, WhereFilterOp } from 'firebase/firestore';
import { FirebaseApp } from 'lib/firebase/firebase';

const app = FirebaseApp();

export const firestoreGets = async (collectionName: string) => {
  return await getDocs(collection(getFirestore(app), collectionName));
};

export const firestoreGet = async (collectionName: string, document: string) => {
  return await getDoc(doc(getFirestore(app), collectionName, document));
};

export const firestoreSet = async (collectionName: string, document: string, data: any) => {
  return await setDoc(doc(getFirestore(app), collectionName, document), data);
};

export const firestoreAdd = async (collectionName: string, data: any) => {
  return await addDoc(collection(getFirestore(app), collectionName), data);
};

export const firestoreUpdate = async (collectionName: string, document: string, data: any) => {
  return await updateDoc(doc(getFirestore(app), collectionName, document), data);
};

// ==, !=を使う。 ===, !==は使えない
export const firestoreGetsQuery = async (collectionName: string, key: string, operator: string, value: any) => {
  const queryRef = await getDocs(query(
    collection(getFirestore(app), collectionName),
    where(key, operator as WhereFilterOp, value)
  ));
  const result: Array<any> = [];
  queryRef.forEach((doc) => result.push({id: doc.id, ...doc.data()}));
  return result;
};