import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreGetsQuery } from 'lib/firebase/firestore';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ListGroup, ListItem } from 'components/Atoms/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import style from 'components/Atoms/List.module.css';
import accountListStyle from 'components/Molecules/AccountList.module.css';

type Props = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const AccountList = () => {
  const navigate = useNavigate();
  const [accountsData, setAccountsData] = useState([] as any[]);
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  
  const loginAccount = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      window.location.reload()
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const deleteAccount = (email: string) => {
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    accounts = accounts.filter((x:any) => x.email !== email);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    setAccountsData(accountsData.filter((x:any) => x.email !== email));
  };
  
  const AccountListItem = ({ id, name, email, password }: Props) => {
    const { user } = useAuthContext()
    return (
      <div className={`${style.listitem} ${accountListStyle.accountList}`} onClick={() => loginAccount(email, password)} >
        <div className={accountListStyle.icon}></div>
        <div className={accountListStyle.name}>{name}</div>
        <div className={accountListStyle.id}>@{id}</div>
        <FontAwesomeIcon icon={faTimesCircle} className={accountListStyle.delete} onClick={() => deleteAccount(email)} />
        { user?.email === email && (
          <FontAwesomeIcon icon={faCircleCheck} className={accountListStyle.login} />
        ) }
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      try {
        let _accountsData = [] as any[];
        for(let account of accounts) {
          const accountData = (await firestoreGetsQuery('account', "email", "==", account.email))[0];
          _accountsData = [..._accountsData, {...accountData, password: account.password}];
          setAccountsData(_accountsData);
        }
      } catch (e) {
        console.log(e);
      }
    })()
  }, []);

  return (
    <ListGroup>
    {
      accountsData.map(accountData => (
				<AccountListItem id={accountData.accountID} name={accountData.accountName} email={accountData.email} password={accountData.password}/>
      ))
    }
    </ListGroup>
  );
};
