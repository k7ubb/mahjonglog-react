import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet, firestoreSet } from 'lib/firebase/firestore';

import type { MJscore, MJlog } from 'components/type';
import style from 'components/Atoms/List.module.css';
import addLogListStyle from 'components/Molecules/AddLogList.module.css';

type Props = {
  id: number;
};

const checkError = function(score: MJscore[]) {
  let total = 0;
  for (let sc of score) {
    if (sc.player === "") {
      throw new Error("名前を選択してください");
    }
    total += sc.point;
  }
  if (total !== 1000) {
    throw new Error(`点棒の合計が ${Math.abs(1000-total)*100} 点${1000>total? "少ない" : "多い"}`);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++){  
      if (score[i].player === score[j].player) {
        throw new Error("同じプレイヤーが複数存在します");
      }
    }
  }
};

export const AddLogForm: React.FC = () => {
  const navigate = useNavigate();
  const { uid } = useAuthContext();

  const [players, setPlayers] = useState(undefined);
  const [score, setScore] = useState([
    {point: 250, player: ""},
    {point: 250, player: ""},
    {point: 250, player: ""},
    {point: 250, player: ""}
  ]);
  const [error, setError] = useState('');


  const addLog = async (event: any) => {
    event.preventDefault();

    score.sort( (a,b) => b.point - a.point );

    try {
      checkError(score);
    } catch (e){ 
      setError((e as Error).message);
      return;
    }

		score[0].point = Math.round( (score[0].point + 100 -1) / 10 );
 		score[1].point = Math.round( (score[1].point - 200 -1) / 10 );
		score[2].point = Math.round( (score[2].point - 400 -1) / 10 );
		score[3].point = Math.round( (score[3].point - 500 -1) / 10 );

		const d = new Date();
    const log = {
      date: d.getTime(),
      date_str: d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate(),
      score
    };

    try {
      const previousLog = (await firestoreGet('log', uid!)).data()?.log || [];
      console.log(log);
      await firestoreSet("log", uid!, {
        log: [...previousLog, log]
      });
      alert("保存しました");
      setScore([
        {point: 250, player: ""},
        {point: 250, player: ""},
        {point: 250, player: ""},
        {point: 250, player: ""}
      ]);
      navigate("/app")
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const AddLogListItem = ({ id }: Props) => {
    return (
      <div className={`${style.listitem} ${addLogListStyle.addlogList}`} >
				<select id={"player" + id} defaultValue={score[id-1].player} onChange={(e) => {
            score[id-1].player = e.target.value;
            setScore([...score]);
        }}>
          <option disabled value="">名前を選択</option>
          { (players as any).map( (player: any) => {
            return <option key={player} value={player}>{player}</option>;
          }) }
				</select>
				<span className={addLogListStyle.point}>
					<input id={"point" + id} type="number" defaultValue={score[id-1].point} required onChange={(e) => {
            score[id-1].point = Number(e.target.value);
            setScore([...score]);
          }} />00
				</span>
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      try {
        setPlayers((await firestoreGet('players', uid!)).data()?.players);
      } catch (e) {
        console.log((e as Error).message);
      }
    })()
  }, [uid]);

  return (
    <form onSubmit={addLog}>
      <ListGroup>
      </ListGroup>

      { error && (
        <ListTitle>
          <span style={{color:"red"}}>{error}</span>
        </ListTitle>
      )}
      { players && (
        <>
          <ListGroup>
            <AddLogListItem id={1} />
            <AddLogListItem id={2} />
            <AddLogListItem id={3} />
            <AddLogListItem id={4} />
          </ListGroup>

          <ListGroup>
            <ListItem>
              <button type="submit">対局結果を保存</button>
            </ListItem>
          </ListGroup>
        </>
      )}
    </form>
  );
};
