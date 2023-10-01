import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreGetsQuery } from 'lib/firebase/firestore';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const AccountLoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const accountLogin = async (event: any) => {
    event.preventDefault();
    try {
      const db_email = (await firestoreGetsQuery('account', "email", "==", email))[0]?.email || (await firestoreGetsQuery('account', "accountID", "==", email))[0]?.email;
      if (db_email) {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, db_email, password);
        const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
        if (!accounts.find((x: any) => x?.email === db_email)) {
          accounts.push({email: db_email, password: password});
        }
				localStorage.setItem("accounts", JSON.stringify(accounts));
        navigate('/app');
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <form onSubmit={accountLogin}>
      <ListTitle>ログイン</ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="text"
            pattern="^[a-zA-Z0-9\-_@\.]+$"
            placeholder="アカウントID / メールアドレス" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </ListItem>
      </ListGroup>

      <ListTitle>パスワード</ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="password" 
            placeholder="パスワード"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </ListItem>
      </ListGroup>

      { error && (
        <ListTitle>
          <span style={{color:"red"}}>{error}</span>
        </ListTitle>
      )}
      <ListGroup>
        <ListItem><button type="submit">ログイン</button></ListItem>
      </ListGroup>
    </form>
  );
};
