import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { firestoreGet } from 'lib/firebase/firestore';

type GlobalAuthState = {
  user: User | null | undefined;
  uid: string | undefined;
  email: string | undefined;
  accountID: string | undefined;
  accountName: string | undefined;
};

const initialState: GlobalAuthState = {
  user: undefined,
  uid: undefined,
  email: undefined,
  accountID: undefined,
  accountName: undefined
};

const AuthContext = createContext<GlobalAuthState>(initialState);

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<GlobalAuthState>(initialState);
  
  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (user) => {
        if (user === null) {
          setUser(initialState);
        }
        else{
          (async () => {
            const userInfo = (await firestoreGet('account', user.uid)).data();
            if (userInfo?.email && userInfo?.accountID && userInfo?.accountName) {
              setUser({
                user: user,
                uid: user.uid,
                email: userInfo.email,
                accountID: userInfo.accountID,
                accountName: userInfo.accountName
              });
            }
            else {
              await signOut(getAuth());
              // LocalStorageから削除
              const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
              localStorage.setItem("accounts", JSON.stringify(accounts.filter((x:any) => x.email !== userInfo?.email)));
            }
          })();
        }
      });
    } catch (e) {
      setUser(initialState);
    }
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
};

export const useAuthContext = () => useContext(AuthContext);
