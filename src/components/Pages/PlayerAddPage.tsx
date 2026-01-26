import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandlePlayer } from '../../usecase/useHandlePlayer';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '../Templates';

export const PlayerAddPage = () => {
	const navigate = useNavigate();
	const { addPlayer } = useHandlePlayer();
	const [newPlayer, setNewPlayer] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);

	return (
		<AppWindow
			title="プレイヤーを追加"
			backTo="/app/player"
			authOnly={true}
			loading={addLoading}
		>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setError('');
					setAddLoading(true);
					try {
						await addPlayer(newPlayer);
						setNewPlayer('');
						navigate('/app/player');
					} catch (e) {
						setError((e as Error).message);
					} finally {
						setAddLoading(false);
					}
				}}
			>
				<ListGroup title="プレイヤー名">
					<ListInputItem
						required
						type="text"
						placeholder="名前"
						pattern="^[^\s\/]+$"
						value={newPlayer}
						onChange={(e) => setNewPlayer(e.target.value)}
					/>
				</ListGroup>
				<ListGroup {...(error && { error })}>
					<ListButtonItem type="submit" disabled={addLoading}>追加</ListButtonItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
