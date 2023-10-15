import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';
import { AuthGuard } from "feature/auth/component/AuthGuard";
import { AddLogForm } from 'components/Molecules/AddLogForm';

export const AddLogPage: React.FC = () => {
  return (
    <AuthGuard>
      <Header destination="/app">対局記録を登録</Header>

      <AppArea>
        <AddLogForm />
      </AppArea>
    </AuthGuard>
  );
};
