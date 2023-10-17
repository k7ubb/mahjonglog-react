import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet, firestoreSet } from 'lib/firebase/firestore';

import type { FireStoreMJpoint  } from 'components/type';
import style from 'components/Atoms/List.module.css';
import addLogListStyle from 'components/Molecules/AddLogList.module.css';

type Props = {
  id: number;
};

type Personalpoint = {
  player: string;
  point: number;
};

const initialPersonalpoint = {
  date: 0,
  date_str: "",
  player: ["", "", "", ""],
  point: [0, 0, 0, 0]
};

const checkError = function(score: FireStoreMJpoint) {
  for (let player of score.player) {
    if (player === "") {
      throw new Error("名前を選択してください");
    }
  }
  let total = 0;
  for (let point of score.point) {
    total += point;
  }
  if (total !== 1000) {
    throw new Error(`点棒の合計が ${Math.abs(1000-total)*100} 点${1000>total? "少ない" : "多い"}`);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++){  
      if (score.player[i] === score.player[j]) {
        throw new Error("同じプレイヤーが複数存在します");
      }
    }
  }
};

export const AddLogForm: React.FC = () => {
  const navigate = useNavigate();
  const { uid } = useAuthContext();

  const [players, setPlayers] = useState(undefined);
  const [inputData, setInputData] = useState(
    [
      {point: 250, player: ""},
      {point: 250, player: ""},
      {point: 250, player: ""},
      {point: 250, player: ""}
    ]
  );
  const [error, setError] = useState('');


  const addLog = async (event: any) => {
    event.preventDefault();

		const data = inputData.concat();
    data.sort( (a,b) => b.point - a.point );

    const fireStoreData = initialPersonalpoint;
    for (let i in data) {
      fireStoreData.point[i] = data[i].point;
      fireStoreData.player[i] = data[i].player;
    }

    try {
      checkError(fireStoreData);
    } catch (e){ 
      setError((e as Error).message);
      return;
    }

		fireStoreData.point[0] = Math.round( (fireStoreData.point[0] + 100 -1) / 10 );
 		fireStoreData.point[1] = Math.round( (fireStoreData.point[1] - 200 -1) / 10 );
		fireStoreData.point[2] = Math.round( (fireStoreData.point[2] - 400 -1) / 10 );
		fireStoreData.point[3] = Math.round( (fireStoreData.point[3] - 500 -1) / 10 );

		const d = new Date();
    fireStoreData.date = d.getTime();
		fireStoreData.date_str = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();

    try {
      const previousLog = (await firestoreGet('log', uid!)).data()?.log || [];
      await firestoreSet("log", uid!, {
        log: [...previousLog, fireStoreData]
      });
      alert("保存しました");
      setInputData([
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
				<select id={"player" + id} defaultValue={inputData[id-1].player} onChange={(e) => {
            inputData[id-1].player = e.target.value;
            setInputData([...inputData]);
        }}>
          <option disabled value="">名前を選択</option>
          { (players as any).map( (player: any) => {
            return <option key={player} value={player}>{player}</option>;
          }) }
				</select>
				<span className={addLogListStyle.point}>
					<input id={"point" + id} type="number" defaultValue={inputData[id-1].point} required onChange={(e) => {
            inputData[id-1].point = Number(e.target.value);
            setInputData(inputData);
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
