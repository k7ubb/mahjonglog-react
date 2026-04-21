import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppWindow, ListGroup, ListItem, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';

export const LogAddPage = () => {
	const navigate = useNavigate();
	const { loading, startLoading, endLoading } = useLoading();
	const { players, addLog } = useAppData();
	const [error, setError] = useState<string | null>(null);
	const playerName: string[] = [];
	const setPlayerName: React.Dispatch<React.SetStateAction<string>>[] = [];
	const scoreString: string[] = [];
	const setScoreString: React.Dispatch<React.SetStateAction<string>>[] = [];

	for (let i = 0; i < 4; i++) {
		[playerName[i], setPlayerName[i]] = useState('');
		[scoreString[i], setScoreString[i]] = useState('250');
	}

	return (
		<AppWindow title='新規ログ作成'>
			<form onSubmit={(e) => {
				e.preventDefault();
				startLoading();
				addLog(playerName, scoreString)
					.then(() => navigate('/'))
					.catch((e) => {
						setError((e as Error).message);
					})
					.finally(() => endLoading());
			}}>
				<ListGroup
					description={
						<>
							同点の場合、上に記載した人が高順位となります。
							<br />
							25000点30000点返し / 順位点10 - 30
						</>
					}
				>
					{new Array(4).fill(null).map((_, i) => (
						<ListItem key={i}>
							<select
								value={playerName[i]}
								onChange={(e) => setPlayerName[i](e.target.value)}
								className='w-50'
							>
								<option disabled value=''>
									名前を選択
								</option>
								{players.map((player) => (
									<option key={player} value={player}>
										{player}
									</option>
								))}
							</select>
							<input
								type='text'
								pattern='^-?\d+$'
								value={scoreString[i]}
								required
								onChange={(e) => setScoreString[i](e.target.value)}
								className='ml-auto mr-4 pr-4 w-20 text-right'
							/>
							00
						</ListItem>
					))}
				</ListGroup>
				<ListGroup {...(error && { error })}>
					<ListButtonItem type='submit' disabled={loading}>
						対局結果を保存
					</ListButtonItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
