import { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreGetsQuery } from 'lib/firebase/firestore';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const initialState = {
  email: "",
  password: "",
};

type reducerAction =
  | { type: "email"; value: string; }
  | { type: "password"; value: string; }

const reducer = (state: any, action: reducerAction) => {
  return {
    ...state,
    [action.type]: action.value,
  };
};

export const AccountLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState("");

  return (
    <form onSubmit={async (event) => {
      event.preventDefault();
      try {
        const db_email = (await firestoreGetsQuery('account', "email", "==", state.email))[0]?.email || (await firestoreGetsQuery('account', "accountID", "==", state.email))[0]?.email;
        if (db_email) {
          const auth = getAuth();
          await signInWithEmailAndPassword(auth, db_email, state.password)
          
          // LocalStorageに追記
          const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
          if (!accounts.find((x: any) => x.email === state.email)) {
            accounts.push({
              email: state.email,
              password: state.password
            });
            localStorage.setItem("accounts", JSON.stringify(accounts));
          }
          
          setTimeout(() => {
            navigate('/app');
          }, 1);
        }
      } catch (e) {
        setError((e as Error).message);
      }
      }}>
      <ListTitle>ログイン</ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="text"
            pattern="^[a-zA-Z0-9\-_@\.]+$"
            placeholder="アカウントID / メールアドレス" 
            value={state.email} 
            onChange={(e) => dispatch({ type: "email", value: e.target.value })}
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
            value={state.password} 
            onChange={(e) => dispatch({ type: "password", value: e.target.value })}
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
