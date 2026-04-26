import { openDB, type DBSchema } from 'idb';
import { type User } from '@/contexts/useUserData';
import { type UserDataWithAuth } from '@/usecase/useAccount';

interface UserAuthDB extends DBSchema {
	accounts: {
		key: string;
		value: UserDataWithAuth;
	};
	keys: {
		key: string;
		value: CryptoKey;
	};
}

const DB_NAME = 'mahjonglog-react-auth';

const getDB = () => openDB<UserAuthDB>(DB_NAME, 1, {
	upgrade(db) {
		db.createObjectStore('accounts', { keyPath: 'uid' });
		db.createObjectStore('keys');
	},
});

async function getMasterKey(): Promise<CryptoKey> {
	const db = await getDB();
	let key = await db.get('keys', 'master-key');

	if (!key) {
		key = await window.crypto.subtle.generateKey(
			{ name: 'AES-GCM', length: 256 },
			false, // extractable
			['encrypt', 'decrypt']
		);
		await db.put('keys', key, 'master-key');
	}
	return key;
}

const encrypt = async (text: string) => {
	const key = await getMasterKey();
	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	const encoded = new TextEncoder().encode(text);
	const encryptedPass = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		encoded
	);
	return { encryptedPass, iv };
};

export const decrypt = async (encryptedPass: ArrayBuffer, iv: Uint8Array) => {
	const key = await getMasterKey();
	const decrypted = await window.crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: iv as unknown as BufferSource },
		key,
		encryptedPass
	);
	return new TextDecoder().decode(decrypted);
};

export const getUsersDataWithAuth = async () => {
	const db = await getDB();
	return db.getAll('accounts');
};

export const saveUserDataWithAuth = async (user: User, password: string) => {
	const { encryptedPass, iv } = await encrypt(password);
	const db = await getDB();
	await db.put('accounts', { ...user, encryptedPass, iv });
};

export const updateUserDataWithAuth = async (user: User) => {
	const db = await getDB();
	const existedUser = await db.get('accounts', user.uid);
	if (!existedUser) { throw new Error('アカウントが見つかりません'); }
	await db.put('accounts', { ...existedUser, ...user });
};

export const removeUserDataWithAuth = async (uid: string) => {
	const db = await getDB();
	await db.delete('accounts', uid);
};
