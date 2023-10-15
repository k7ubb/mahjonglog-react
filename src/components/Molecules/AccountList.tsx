import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreGetsQuery } from 'lib/firebase/firestore';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ListGroup, ListItem } from 'components/Atoms/List';
import { useLSaccountsReducer } from 'components/hooks/useLSaccountsReducer';
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
  const { LSaccounts, dispatch } = useLSaccountsReducer();
  const [accountsData, setAccountsData] = useState([] as any[]);

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
    dispatch( { type: "delete", value: {email, password: "pass"}} );
  };
  
  const AccountListItem = ({ id, name, email, password }: Props) => {
    const { accountID } = useAuthContext();
    return (
      <div className={`${style.listitem} ${accountListStyle.accountList}`} onClick={() => loginAccount(email, password)} >
        <div className={accountListStyle.icon}></div>
        <div className={accountListStyle.name}>{name}</div>
        <div className={accountListStyle.id}>@{id}</div>
        <FontAwesomeIcon icon={faTimesCircle} className={accountListStyle.delete} onClick={() => deleteAccount(email)} />
        { accountID === id && (
          <FontAwesomeIcon icon={faCircleCheck} className={accountListStyle.login} />
        ) }
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      try {
        let _accountsData = [] as any[];
        for(let LSaccount of LSaccounts) {
          const accountData = (await firestoreGetsQuery('account', "email", "==", LSaccount.email))[0];
          if (accountData !== undefined) {
            _accountsData = [..._accountsData, {...accountData, password: LSaccount.password}];
            setAccountsData(_accountsData);
          }
          else {
            dispatch( { type: "delete", value: LSaccount } );
          }
        }
      } catch (e) {
        console.log((e as Error).message);
      }
    })()
  }, [LSaccounts, dispatch]);

  return (
    <ListGroup>
    {
      accountsData.map(accountData => (
				<AccountListItem id={accountData.accountID} name={accountData.accountName} email={accountData.email} password={accountData.password} key={accountData.email}/>
      ))
    }
    </ListGroup>
  );
};
