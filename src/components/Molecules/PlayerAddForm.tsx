import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTitle, ListGroup, ListItem } from 'components/Atoms/List';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreGet, firestoreSet } from 'lib/firebase/firestore';

export const PlayerAddForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [playerName, setPlayerName] = useState('');
  const [playerNameInvalid, setPlayerNameInvalid] = useState(false);
  const [error, setError] = useState('');

  const playerNameUniqueCheck = async (playerName: string) => {
    if (playerName !== "") {
      setPlayerNameInvalid((await firestoreGet('players', user?.uid!)).data()?.players.includes(playerName));
    }
  };

  const addPlayer = async (event: any) => {
    event.preventDefault();
    try {
      if (!playerNameInvalid) {
        const players = (await firestoreGet('players', user?.uid!)).data()?.players || [];
        await firestoreSet("players", user?.uid!, {
          players: [...players, playerName]
        });
        navigate("/app/player");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <form onSubmit={addPlayer}>
      <ListTitle>
        プレイヤー名
        {playerNameInvalid && (<span style={{color:"red"}}>
          この名前は使われています
        </span>)}
      </ListTitle>
      <ListGroup>
        <ListItem>
          <input 
            required
            type="text"
            placeholder="名前"
            value={playerName} 
            onChange={(e) => {setPlayerName(e.target.value); playerNameUniqueCheck(e.target.value); }} 
          />
        </ListItem>
      </ListGroup>

      { error && (
        <ListTitle>
          <span style={{color:"red"}}>{error}</span>
        </ListTitle>
      )}
      <ListGroup>
        <ListItem><button type="submit">アカウント登録</button></ListItem>
      </ListGroup>
    </form>
  );
};
