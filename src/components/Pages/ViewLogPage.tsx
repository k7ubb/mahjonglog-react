import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';
import { AuthGuard } from "feature/auth/component/AuthGuard";
import { ViewLogTable } from 'components/Molecules/ViewLogTable';

export const ViewLogPage: React.FC = () => {
  return (
    <AuthGuard>
      <Header destination="/app">ログ表示</Header>

      <AppArea>
        <ViewLogTable />
      </AppArea>
    </AuthGuard>
  );
};
