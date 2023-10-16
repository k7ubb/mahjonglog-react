import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { AuthGuard } from "feature/auth/component/AuthGuard";
import { firestoreGet } from 'lib/firebase/firestore';

import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';

import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';

type Log = {
  date: string;
  score: any;
};

type PersonalLog = {
  player: string;
  count: number;
  rank: [number, number, number, number];
  average_rank: number;
  score: number;
  average_score: number;
};

export const PlayerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { uid } = useAuthContext();
  const [players, setPlayers] = useState([]);
  const { player } = useParams();

  const [log, setLog] = useState<Log[]>([]);
  const [personalLog, setPersonalLog] = useState<PersonalLog[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const players_ = (await firestoreGet("players", uid!)).data()?.players || [];
        setPlayers(players);
        const log = (await firestoreGet('log', uid!)).data()?.log.map((x:any) => JSON.parse(x));
        setLog(log);

        let personal = [] as PersonalLog[];
        for (let p of players_) {
          personal.push({
            player: p,
            count: 0,
            rank: [0, 0, 0, 0],
            average_rank: 0,
            score: 0,
            average_score: 0
          });
          for (let l of log) {
            if (l.score.player) {
              
            }
          }
        }
        setPersonalLog(personal);
      } catch (e) {
        console.log((e as Error).message);
      }
    })()
  }, [user]);

  return (
    <AuthGuard>
      <Header destination={player? "/app/player" : "/app"}>{player? player : "個人記録"}</Header>

      <AppArea>
        {
          !player?
            <>
              <ListGroup>
              {
                players.map(item => <ListItem key={item} destination={`/app/player/${item}`}>{item}</ListItem>)
              }
              </ListGroup>
              <ListGroup>
                <ListItem onClick={() => {navigate("/app/player/add")}}>プレイヤーを追加</ListItem>
              </ListGroup>
            </>
          :
            <></>
        }
      </AppArea>
    </AuthGuard>
  );
};
