import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';
import { AccountLoginForm } from 'components/Molecules/AccountLoginForm';

export const AccountLoginPage: React.FC = () => {
  return (
    <>
      <Header destination="/app">ログイン</Header>

      <AppArea>
        <AccountLoginForm />
      </AppArea>
    </>
  );
};
