import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet } from 'lib/firebase/firestore';

import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';

import { AccountConfigArea } from 'components/Organisms/AccountConfigArea';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';

export const IndexPage: React.FC = () => {
  const { user } = useAuthContext();
  const [showAccountConfig, setShowAccountConfig] = useState(false);
  const [accountName, setAccountName] = useState('');

  console.log(process.env.REACT_APP_FIREBASE_API_KEY);
  const updateAuthStatus = async () => {
    const loginStatus = (await firestoreGet('account', user?.uid!)).data();
    if (loginStatus) {
      setAccountName(loginStatus.accountName);
    }
    else {
      signOut(getAuth());
      setShowAccountConfig(true);
    }
  };

  if (accountName === "" && user?.uid) {
    updateAuthStatus();
  }

  return (
    <>
      <Header>麻雀戦績共有アプリ</Header>

      <AppArea>
        {accountName !== "" && (
          <>
            <ListTitle>ようこそ、{accountName}さん</ListTitle>
            <ListGroup>
            <ListItem destination='hoge'>新規登録</ListItem>
            <ListItem destination='hoge'>ログ表示</ListItem>
            <ListItem destination='hoge'>個人記録</ListItem>
            <ListItem destination='hoge'>設定</ListItem>
            </ListGroup>
          </>
        )}
        <ListGroup>
          <ListItem onClick={() => setShowAccountConfig(true)}>アカウント切替</ListItem>
        </ListGroup>
      </AppArea>
      {showAccountConfig && (
        <AccountConfigArea onClick={() => setShowAccountConfig(false)}/>
      )}
    </>
  );
};
