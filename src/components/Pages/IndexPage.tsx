import { useState } from 'react';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';

import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';

import { AccountConfigArea } from 'components/Organisms/AccountConfigArea';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';


export const IndexPage: React.FC = () => {
  const { accountName } = useAuthContext();
  const [showAccountConfig, setShowAccountConfig] = useState(false);

  return (
    <>
      <Header>麻雀戦績共有アプリ</Header>

      <AppArea>
        {accountName && (
          <>
            <ListTitle>ようこそ、{accountName}さん</ListTitle>
            <ListGroup>
            <ListItem destination="/app/addlog">新規登録</ListItem>
            <ListItem destination="/app/viewlog">ログ表示</ListItem>
            <ListItem destination="/app/player">個人記録</ListItem>
            <ListItem destination="">設定</ListItem>
            </ListGroup>
          </>
        )}
        <ListGroup>
          <ListItem onClick={() => setShowAccountConfig(true)}>アカウント切替</ListItem>
        </ListGroup>
      </AppArea>
      {(!accountName || showAccountConfig) && (
        <AccountConfigArea onClick={() => setShowAccountConfig(false)}/>
      )}
    </>
  );
};
