import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { AuthGuard } from "feature/auth/component/AuthGuard";
import { firestoreGet } from 'lib/firebase/firestore';

import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';

import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';

export const PlayerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setPlayers((await firestoreGet("players", user?.uid!)).data()?.players || []);
      } catch (e) {
        console.log((e as Error).message);
      }
    })()
  }, [user]);

  return (
    <AuthGuard>
      <Header destination="/app">個人記録</Header>

      <AppArea>
        <ListGroup>
        {
          players.map(item => <ListItem key={item}>{item}</ListItem>)
        }
        </ListGroup>
        <ListGroup>
          <ListItem onClick={() => {navigate("/app/player/add")}}>プレイヤーを追加</ListItem>
        </ListGroup>
      </AppArea>
    </AuthGuard>
  );
};
