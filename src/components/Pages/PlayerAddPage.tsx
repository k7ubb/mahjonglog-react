import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';
import { AuthGuard } from "feature/auth/component/AuthGuard";
import { PlayerAddForm } from 'components/Molecules/PlayerAddForm';

export const PlayerAddPage: React.FC = () => {
  return (
    <AuthGuard>
      <Header destination="/app/player">プレイヤーを追加</Header>

      <AppArea>
        <PlayerAddForm />
      </AppArea>
    </AuthGuard>
  );
};
