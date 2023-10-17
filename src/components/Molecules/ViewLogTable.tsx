import { useState, useEffect } from 'react';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet } from 'lib/firebase/firestore';

import type { FireStoreMJpoint } from 'components/type';

import style from 'components/Atoms/List.module.css';
import viewLogListStyle from 'components/Molecules/ViewLogList.module.css';

type Props = {
  log: FireStoreMJpoint
};

type LogByDate = {
  date: string;
  count: number;
};

const LogItem = ( { log }: Props ) => {
  let color = [];
  for(let i=0; i<4; i++){
    if(log.point[i] === 0){ color[i] = "#000"; }
    if(log.point[i] > 0){ color[i] = "#00f"; }
    if(log.point[i] < 0){ color[i] = "#f00"; }
  }
  return (
    <div className={`${style.listitem} ${viewLogListStyle.viewLogList}`} >
      <p>
        1: {log.player[0]} <span className={viewLogListStyle.score_point} style={{color:color[0]}}>{log.point[0]}</span><br />
        2: {log.player[1]} <span className={viewLogListStyle.score_point} style={{color:color[1]}}>{log.point[1]}</span><br />
        3: {log.player[2]} <span className={viewLogListStyle.score_point} style={{color:color[2]}}>{log.point[2]}</span><br />
        4: {log.player[3]} <span className={viewLogListStyle.score_point} style={{color:color[3]}}>{log.point[3]}</span>
      </p>
    </div>
  );
}

export const ViewLogTable: React.FC = () => {
  const { uid } = useAuthContext();

  const [log, setLog] = useState<FireStoreMJpoint[]>([]);
  const [logDate, setLogDate] = useState<LogByDate[]>([]);
  const [showDate, setShowDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const log = (await firestoreGet('log', uid!)).data()?.log || [];
        setLog(log);

        let result = [{date: log[log.length-1].date_str, count: 1}];
        for (let i = log.length - 2; i >= 0; i--) {
          if (result[result.length-1].date !== log[i].date_str){
            result.push({
              date: log[i].date_str,
              count: 1
            });
          }
          else{
            result[result.length-1].count++;
          }
        }
        setLogDate(result);
      } catch (e) {
        console.log((e as Error).message);
      }
    })()
  }, [uid]);
  
  return (
    <>
      { showDate && <ListTitle>{showDate}</ListTitle> }
      <ListGroup>
        { showDate === "" ?
            logDate.map((item) => (
              <ListItem key={item.date} onClick={() => { setShowDate(item.date) }}>{`${item.date}(${item.count})`}</ListItem>
            ))
          :
          log.filter((item) => item.date_str === showDate).map((item) => (
            <LogItem key={item.date} log={item} />
          ))
        }
      </ListGroup>
      { showDate && (
        <ListGroup>
          <ListItem onClick={() => setShowDate("")}>戻る</ListItem>
        </ListGroup>
      )}
    </>
  );
};
