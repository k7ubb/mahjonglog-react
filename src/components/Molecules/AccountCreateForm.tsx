import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreSet, firestoreGetsQuery } from 'lib/firebase/firestore';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useLSaccountsReducer } from 'components/hooks/useLSaccountsReducer';

export const AccountCreateForm: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [accountID, setAccountID] = useState("");
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordSub, setPasswordSub] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [accountIDInvalid, setAccountIDInvalid] = useState(false);
  const [error, setError] = useState("");

  const { dispatch } = useLSaccountsReducer();

  const passwordSimilarCheck = (password: string, passwordSub: string) => {
    setPasswordInvalid((password !== "" && passwordSub !== "" && password !== passwordSub));
  };

  const accountIDUniqueCheck = async (accountID: string) => {
    if (accountID !== "") {
      setAccountIDInvalid((await firestoreGetsQuery("account", "accountID", "==", accountID))[0] !== undefined);
    }
  };

  const accountCreate = async (event: any) => {
    event.preventDefault();
    try {
      if (passwordInvalid) { throw new Error("パスワードが一致しません"); }
      if (accountIDInvalid) { throw new Error("このアカウントIDは使われています"); }
      const uid = (await createUserWithEmailAndPassword(getAuth(), email, password) as any)._tokenResponse.localId;

      // FireStoreに追記
      await firestoreSet("account", uid, {
        email: email,
        accountID: accountID,
        accountName: accountName
      });

      // LocalStorageに追記
      dispatch( { type: "add", value: {email, password} } );

      setTimeout(() => {
        navigate("/app");
      }, 1);
      
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <form onSubmit={accountCreate}>
      <ListTitle>メールアドレス</ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="email" 
            placeholder="user@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </ListItem>
      </ListGroup>

      <ListTitle>
        パスワード
        {passwordInvalid && (<span style={{color:"red"}}>
          パスワードが一致しません
        </span>)}
      </ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="password" 
            placeholder="パスワード"
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
              passwordSimilarCheck(e.target.value, passwordSub);
            }} 
          />
        </ListItem>
        <ListItem>
          <input 
            required
            type="password" 
            placeholder="パスワード(確認)"
            value={passwordSub} 
            onChange={(e) => {
              setPasswordSub(e.target.value);
              passwordSimilarCheck(password, e.target.value);
            }} 
          />
        </ListItem>
      </ListGroup>

      <ListTitle>
        アカウント設定
        {accountIDInvalid && (<span style={{color:"red"}}>
          このアカウントIDは使われています
        </span>)}
      </ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="text"
            pattern="^[a-zA-Z0-9\-_\@\.]+$"
            placeholder="アカウントID (半角英数のみ)"
            value={accountID} 
            onChange={(e) => {
              setAccountID(e.target.value);
              accountIDUniqueCheck(e.target.value);
            }} 
          />
        </ListItem>
        <ListItem>
          <input 
            required
            type="text" 
            placeholder="アカウント名"
            value={accountName} 
            onChange={(e) => setAccountName(e.target.value)} 
          />
        </ListItem>
      </ListGroup>

      { error && (
        <ListTitle>
          <span style={{color:"red"}}>{error}</span>
        </ListTitle>
      )}
      <ListGroup>
        <ListItem><button type="submit">アカウント登録</button></ListItem>
      </ListGroup>
    </form>
  );
};
