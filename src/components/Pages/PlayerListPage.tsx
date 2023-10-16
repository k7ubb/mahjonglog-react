import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { AuthGuard } from "feature/auth/component/AuthGuard";
import { firestoreGet } from 'lib/firebase/firestore';

import { Header } from 'components/Templete/Header';
import { AppArea } from 'components/Templete/AppArea';

import { ListGroup, ListItem } from 'components/Atoms/List';

import style from 'components/Atoms/List.module.css';
import personalLogListStyle from 'components/Molecules/PersonalLogList.module.css';


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

type Props = {
  personal: PersonalLog
};

const initialState = (): PersonalLog=> {
  return {
    player: "",
    count: 0,
    rank: [0, 0, 0, 0],
    average_rank: 0,
    score: 0,
    average_score: 0
  };
};


const PersonalLogView = ( { personal }: Props ) => {
  let score_color  = "#000";
  let ascore_color = "#000";
  if(personal.score > 0) { score_color  = "#00f"; }
  if(personal.score < 0) { score_color  = "#f00"; }
  if(personal.average_score > 0){ ascore_color = "#00f"; }
  if(personal.average_score < 0){ ascore_color = "#f00"; }
  
return (
    <div className={`${style.listgroup} ${personalLogListStyle.personalLogList}`} >
      <ListItem><div>1位<span>{personal.rank[0]}</span></div></ListItem>
      <ListItem>2位<span>{personal.rank[1]}</span></ListItem>
      <ListItem>3位<span>{personal.rank[2]}</span></ListItem>
      <ListItem>4位<span>{personal.rank[3]}</span></ListItem>
      <ListItem>試合数<span>{personal.count}</span></ListItem>
      <ListItem>平均順位<span>{personal.average_rank}</span></ListItem>
      <ListItem>累計得点<span style={{color:score_color}}>{personal.score}</span></ListItem>
      <ListItem>平均得点<span style={{color:ascore_color}}>{personal.average_score}</span></ListItem>
    </div>
  );
}

export const PlayerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { uid } = useAuthContext();
  const [players, setPlayers] = useState([]);
  const { player } = useParams();

  const [log, setLog] = useState<Log[]>([]);
  const [personalLog, setPersonalLog] = useState(initialState());

  useEffect(() => {
    (async () => {
      try {
        setPlayers((await firestoreGet("players", uid!)).data()?.players || []);
        setLog((await firestoreGet('log', uid!)).data()?.log.map((x:any) => JSON.parse(x)) || []);
      } catch (e) {
        console.log((e as Error).message);
      }
    })()
  }, [uid]);

  useEffect(() => {
    let personal = initialState();
    personal.player = player!;

    for (let l of log) {
			for (let i = 0; i < 4; i++) {
				if(l.score[i].player === player){
					personal.rank[i]++;
					personal.count++;
					personal.score += l.score[i].point;
				}
			}
    }
    if (personal.count !== 0) {
      personal.average_rank =  Math.floor(( (personal.rank[0] + 2*personal.rank[1] + 3*personal.rank[2] + 4*personal.rank[3]) / personal.count ) * 100) / 100;
      personal.average_score = Math.floor(( personal.score / personal.count) * 100) / 100;
    }
    setPersonalLog(personal);
  }, [player, log]);

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
            <PersonalLogView personal={personalLog} />
        }
      </AppArea>
    </AuthGuard>
  );
};
