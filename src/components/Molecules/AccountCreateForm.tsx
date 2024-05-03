import { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreSet, firestoreGetsQuery } from 'lib/firebase/firestore';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const initialState = {
  email: "",
  password: "",
  passwordCheck: "",
  accountId: "",
  accountName: ""
};

type reducerAction =
  | { type: "email"; value: string; }
  | { type: "password"; value: string; }
  | { type: "passwordCheck"; value: string; }
  | { type: "accountId"; value: string; }
  | { type: "accountName"; value: string; }

const reducer = (state: any, action: reducerAction) => {
  return {
    ...state,
    [action.type]: action.value,
  };
};

export const AccountCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState("");

  return (
    <form onSubmit={async (event) => {
      event.preventDefault();
      try {
        if (state.password !== state.passwordCheck) {
          throw new Error("パスワードが一致しません");
        }
        if ((await firestoreGetsQuery("account", "accountID", "==", state.accountId))[0] !== undefined) {
          throw new Error("このアカウントIDは使われています");
        }
        const uid = (await createUserWithEmailAndPassword(getAuth(), state.email, state.password) as any)._tokenResponse.localId;

        // FireStoreに追記
        await firestoreSet("account", uid, {
          email: state.email,
          accountID: state.accountId,
          accountName: state.accountName
        });

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
          navigate("/app");
        }, 1);

      } catch (e) {
        setError((e as Error).message);
      }
      }}>
      <ListTitle>メールアドレス</ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="email" 
            placeholder="user@example.com" 
            value={state.email} 
            onChange={(e) => dispatch({ type: "email", value: e.target.value })}
            />
        </ListItem>
      </ListGroup>

      <ListTitle>
        パスワード
      </ListTitle>
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
        <ListItem>
          <input 
            required
            type="password" 
            placeholder="パスワード(確認)"
            value={state.passwordCheck} 
            onChange={(e) => dispatch({ type: "passwordCheck", value: e.target.value })}
          />
        </ListItem>
      </ListGroup>

      <ListTitle>
        アカウント設定
      </ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="text"
            pattern="^[a-zA-Z0-9\-_\@\.]+$"
            placeholder="アカウントID (半角英数のみ)"
            value={state.accountId} 
            onChange={(e) => dispatch({ type: "accountId", value: e.target.value })}
          />
        </ListItem>
        <ListItem>
          <input 
            required
            type="text" 
            placeholder="アカウント名"
            value={state.accountName} 
            onChange={(e) => dispatch({ type: "accountName", value: e.target.value })}
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
