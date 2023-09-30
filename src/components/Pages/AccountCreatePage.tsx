import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';
import { AccountCreateForm } from 'components/Molecules/AccountCreateForm';

export const AccountCreatePage: React.FC = () => {
  return (
    <>
      <Header destination="/app">アカウント作成</Header>

      <AppArea>
        <AccountCreateForm />
      </AppArea>
    </>
  );
};
