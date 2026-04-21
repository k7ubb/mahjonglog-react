import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';

export const PlayerAddPage = () => {
	const navigate = useNavigate();
	const { addPlayer } = useAppData();
	const { loading, startLoading, endLoading } = useLoading();
	const [newPlayer, setNewPlayer] = useState('');
	const [error, setError] = useState<string | null>(null);

	return (
		<AppWindow title='プレイヤーを追加'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setError('');
					startLoading();
					addPlayer(newPlayer)
						.then(() => {
							setNewPlayer('');
							navigate('/player');
						}).catch((e) => {
							setError((e as Error).message);
						}).finally(() => {
							endLoading();
						});
				}}
			>
				<ListGroup title='プレイヤー名'>
					<ListInputItem
						required
						type='text'
						placeholder='名前'
						pattern='^[^\s\/]+$'
						value={newPlayer}
						onChange={(e) => setNewPlayer(e.target.value)}
					/>
				</ListGroup>
				<ListGroup {...(error && { error })}>
					<ListButtonItem type='submit' disabled={loading}>追加</ListButtonItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
