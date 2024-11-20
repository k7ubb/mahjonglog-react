import { useState } from 'react';
import { useHandlePlayer } from '../../../usecase/useHandlePlayer';
import { AppWindow, ListGroup, ListItem } from '../../Templates/AppWindow';
import { Dialog } from '../../Templates/Dialog';

export const PlayerListPage: React.FC = () => {
	const { players, loading, addPlayer } = useHandlePlayer();
	const [open, setOpen] = useState(false);
	const [newPlayerName, setNewPlayerName] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);

	return (
		<AppWindow
			title="個人記録"
			backTo="/app"
			authOnly={true}
			loading={loading || addLoading}
		>
			{players.length > 0 && (
				<ListGroup>
					{players.map((player) => (
						<ListItem key={player}>{player}</ListItem>
					))}
				</ListGroup>
			)}
			<ListGroup>
				<ListItem onClick={() => setOpen(true)}>プレイヤーを追加</ListItem>
			</ListGroup>

			<Dialog
				open={open}
				onClose={() => {
					setNewPlayerName('');
					setError('');
					setOpen(false);
				}}
			>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setError('');
						setAddLoading(true);
						try {
							await addPlayer(newPlayerName);
							setNewPlayerName('');
							setOpen(false);
						} catch (e) {
							setError((e as Error).message);
						} finally {
							setAddLoading(false);
						}
					}}
				>
					<ListGroup title="プレイヤー名">
						<ListItem>
							<input
								required
								type="text"
								placeholder="名前"
								value={newPlayerName}
								onChange={(e) => setNewPlayerName(e.target.value)}
							/>
						</ListItem>
					</ListGroup>
					<ListGroup {...(error && { error })}>
						<ListItem>
							<button type="submit" disabled={addLoading}>
								追加
							</button>
						</ListItem>
					</ListGroup>
				</form>
			</Dialog>
		</AppWindow>
	);
};
