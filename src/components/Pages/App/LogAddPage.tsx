import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandlePlayer } from '../../../usecase/useHandlePlayer';
import { useHandleLog } from '../../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../../Templates/AppWindow';

export const LogAddPage: React.FC = () => {
	const navigate = useNavigate();
	const { players, loading } = useHandlePlayer();
	const { addLog } = useHandleLog();
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);
	const playerName: string[] = [];
	const setPlayerName: React.Dispatch<React.SetStateAction<string>>[] = [];
	const scoreString: string[] = [];
	const setScoreString: React.Dispatch<React.SetStateAction<string>>[] = [];

	for (let i = 0; i < 4; i++) {
		[playerName[i], setPlayerName[i]] = useState('');
		[scoreString[i], setScoreString[i]] = useState('250');
	}

	return (
		<AppWindow
			title="対局記録を登録"
			backTo="/app"
			authOnly={true}
			loading={loading || addLoading}
		>
			{!loading && (
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setAddLoading(true);
						try {
							await addLog(playerName, scoreString);
							navigate('/app');
						} catch (e) {
							setError((e as Error).message);
						} finally {
							setAddLoading(false);
						}
					}}
				>
					<ListGroup>
						{new Array(4).fill(null).map((_, i) => (
							<ListItem key={i}>
								<select
									value={playerName[i]}
									onChange={(e) => setPlayerName[i](e.target.value)}
								>
									<option disabled value="">
										名前を選択
									</option>
									{players.map((player) => (
										<option key={player} value={player}>
											{player}
										</option>
									))}
								</select>
								<input
									id="point0"
									type="text"
									pattern="^-?\d+$"
									value={scoreString[i]}
									required
									onChange={(e) => setScoreString[i](e.target.value)}
									style={{ width: '60px' }}
								/>
								<span
									style={{
										marginRight: '32px',
										fontFamily: 'Arial',
										paddingTop: '1px',
									}}
								>
									00
								</span>
							</ListItem>
						))}
					</ListGroup>
					<ListGroup {...(error && { error })}>
						<ListItem>
							<button type="submit" disabled={loading}>
								対局結果を保存
							</button>
						</ListItem>
					</ListGroup>
				</form>
			)}
		</AppWindow>
	);
};
