import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet, firestoreSet } from 'lib/firebase/firestore';

import type { MJscore } from 'components/type';
import style from 'components/Atoms/List.module.css';
import addLogListStyle from 'components/Molecules/AddLogList.module.css';

const initialState = {
  point0: 250,
  point1: 250,
  point2: 250,
  point3: 250,
  player0: "",
  player1: "",
  player2: "",
  player3: "",
};

type reducerAction =
  | { type: "point0"; value: number; }
  | { type: "point1"; value: number; }
  | { type: "point2"; value: number; }
  | { type: "point3"; value: number; }
  | { type: "player0"; value: string; }
  | { type: "player1"; value: string; }
  | { type: "player2"; value: string; }
  | { type: "player3"; value: string; }

const reducer = (state: any, action: reducerAction) => {
  return {
    ...state,
    [action.type]: action.value
  };
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

  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState('');

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
    <form onSubmit={async (event) => {
      event.preventDefault();
  
      const score = [
        { point: state.point0, player: state.player0 },
        { point: state.point1, player: state.player1 },
        { point: state.point2, player: state.player2 },
        { point: state.point3, player: state.player3 },
      ];
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
        navigate("/app");
      } catch (e) {
        setError((e as Error).message);
      }
    }}>
      { error && (
        <ListTitle>
          <span style={{color:"red"}}>{error}</span>
        </ListTitle>
      )}
      { players && (
        <>
          <ListGroup>
            {/*player 0*/}
            <div className={`${style.listitem} ${addLogListStyle.addlogList}`} >
              <select
                id="player0"
                value={state.player0}
                onChange={(e) => dispatch({ type: "player0", value: e.target.value })}
              >
                <option disabled value="">名前を選択</option>
                { (players as any).map( (player: any) => {
                  return <option key={player} value={player}>{player}</option>;
                }) }
              </select>
              <span className={addLogListStyle.point}>
                <input
                  id="point0"
                  type="number"
                  value={state.point0}
                  required
                  onChange={(e) => dispatch({ type: "point0", value: Number(e.target.value) })}
                />00
              </span>
            </div>

            {/*player 1*/}
            <div className={`${style.listitem} ${addLogListStyle.addlogList}`} >
              <select
                id="player1"
                value={state.player1}
                onChange={(e) => dispatch({ type: "player1", value: e.target.value })}
              >
                <option disabled value="">名前を選択</option>
                { (players as any).map( (player: any) => {
                  return <option key={player} value={player}>{player}</option>;
                }) }
              </select>
              <span className={addLogListStyle.point}>
                <input
                  id="point1"
                  type="number"
                  value={state.point1}
                  required
                  onChange={(e) => dispatch({ type: "point1", value: Number(e.target.value) })}
                />00
              </span>
            </div>
            {/*player 2*/}
            <div className={`${style.listitem} ${addLogListStyle.addlogList}`} >
              <select
                id="player2"
                value={state.player2}
                onChange={(e) => dispatch({ type: "player2", value: e.target.value })}
              >
                <option disabled value="">名前を選択</option>
                { (players as any).map( (player: any) => {
                  return <option key={player} value={player}>{player}</option>;
                }) }
              </select>
              <span className={addLogListStyle.point}>
                <input
                  id="point2"
                  type="number"
                  value={state.point2}
                  required
                  onChange={(e) => dispatch({ type: "point2", value: Number(e.target.value) })}
                />00
              </span>
            </div>
            {/*player 3*/}
            <div className={`${style.listitem} ${addLogListStyle.addlogList}`} >
              <select
                id="player3"
                value={state.player3}
                onChange={(e) => dispatch({ type: "player3", value: e.target.value })}
              >
                <option disabled value="">名前を選択</option>
                { (players as any).map( (player: any) => {
                  return <option key={player} value={player}>{player}</option>;
                }) }
              </select>
              <span className={addLogListStyle.point}>
                <input
                  id="point3"
                  type="number"
                  value={state.point3}
                  required
                  onChange={(e) => dispatch({ type: "point3", value: Number(e.target.value) })}
                />00
              </span>
            </div>
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
