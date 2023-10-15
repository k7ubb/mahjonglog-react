import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet, firestoreSet } from 'lib/firebase/firestore';

import style from 'components/Atoms/List.module.css';
import viewLogListStyle from 'components/Molecules/AddLogList.module.css';

type Log = {
  date: string;
  value: any;
};

type LogByDate = {
  date: string;
  count: number;
};

export const ViewLogTable: React.FC = () => {
  const navigate = useNavigate();
  const { uid } = useAuthContext();

  const [log, setLog] = useState<Log[]>([]);
  const [logDate, setLogDate] = useState<LogByDate[]>([]);
  const [showDate, setShowDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const log = (await firestoreGet('log', uid!)).data()?.log.map((x:any) => JSON.parse(x));
        let result = [{date: log[log.length-1].date, count: 1}];
        for (let i = log.length - 2; i >= 0; i--) {
          if (result[result.length-1].date !== log[i].date){
            result.push({
              date: log[i].date,
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
    <ListGroup>
      { showDate === "" && logDate.map((item) => (
          <ListItem onClick={() => { setShowDate(item.date) }}>{`${item.date}(${item.count})`}</ListItem>
        ))
      }
    </ListGroup>
  );
};
