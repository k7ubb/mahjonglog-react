import { useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppWindow, ListGroup, ListItem, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';

export const LogAddPage = () => {
	const navigate = useNavigate();
	const { loading, startLoading, endLoading } = useLoading();
	const { players, addLog } = useAppData();
	const [error, setError] = useState<string | null>(null);
	const playerIDs: string[] = [];
	const setPlayerIDs: Dispatch<SetStateAction<string>>[] = [];
	const rawPoints: string[] = [];
	const setRawPoints: Dispatch<SetStateAction<string>>[] = [];

	for (let i = 0; i < 4; i++) {
		[playerIDs[i], setPlayerIDs[i]] = useState('');
		[rawPoints[i], setRawPoints[i]] = useState('250');
	}

	return (
		<AppWindow title='新規ログ作成'>
			<form onSubmit={(e) => {
				e.preventDefault();
				startLoading();
				addLog(playerIDs, rawPoints.map(Number))
					.then(() => navigate('/'))
					.catch((e) => {
						setError((e as Error).message);
					})
					.finally(() => endLoading());
			}}>
				<ListGroup description='同点の場合、上に記載した人が高順位となります。\n25000点30000点返し / 順位点10 - 30'>
					{new Array(4).fill(null).map((_, i) => (
						<ListItem key={i}>
							<select
								value={playerIDs[i]}
								onChange={(e) => setPlayerIDs[i](e.target.value)}
								className='w-50'
							>
								<option disabled value=''>
									名前を選択
								</option>
								{players.map((player) => (
									<option key={player.id} value={player.id}>
										{player.name}
									</option>
								))}
							</select>
							<input
								type='text'
								pattern='^-?\d+$'
								value={rawPoints[i]}
								required
								onChange={(e) => setRawPoints[i](e.target.value)}
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
