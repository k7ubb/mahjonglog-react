import { useState, useEffect } from 'react';
import { MdSort } from 'react-icons/md';
import { match } from 'ts-pattern';
import { useHandleLog } from '../../usecase/useHandleLog';
import { useHandlePlayer } from '../../usecase/useHandlePlayer';
import {
	type PersonalScore,
	calculatePersonalScore,
} from '../../utils/personalScore';
import { AppWindow, ListGroup, ListLinkItem, ListButtonItem, ListInputItem } from '../Templates';
import { Dialog } from '../Templates/Dialog';

type SortKey = null | 'count' | 'average_rank' | 'score' | 'average_score';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

const getNextSortKey = (previousKey: SortKey): SortKey => {
	return match(previousKey)
		.with(null, () => 'count')
		.with('count', () => 'average_rank')
		.with('average_rank', () => 'score')
		.with('score', () => 'average_score')
		.otherwise(() => null) as SortKey;
};

export const PlayerListPage: React.FC = () => {
	const { players, loading, addPlayer } = useHandlePlayer();
	const { logs, loading: logLoading } = useHandleLog();
	const [open, setOpen] = useState(false);
	const [newPlayer, setNewPlayer] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);
	const [personalScores, setPersonalScores] = useState<{
		[key: string]: PersonalScore;
	}>({});
	const [sortKey, setSortKey] = useState<SortKey>(null);

	useEffect(() => {
		if (logs && players) {
			const personalScores_: { [key: string]: PersonalScore } = {};
			players.forEach(
				(player) =>
					(personalScores_[player] = calculatePersonalScore(logs, player)),
			);
			setPersonalScores(personalScores_);
		}
	}, [logs, players]);

	return (
		<AppWindow
			title={match(sortKey)
				.with('count', () => '試合数')
				.with('average_rank', () => '平均順位')
				.with('score', () => '累計得点')
				.with('average_score', () => '平均得点')
				.otherwise(() => 'プレイヤー成績')}
			backTo="/app"
			authOnly={true}
			loading={loading || logLoading || addLoading}
			extraButtons={[
				{
					icon: MdSort,
					iconColor: sortKey ? 'green' : undefined,
					onClick: () => {
						setSortKey(getNextSortKey(sortKey));
					}
				}
			]}
		>
			{players && logs && (
				<ListGroup>
					{(!sortKey || Object.keys(personalScores).length === 0
						? players
						: ['count', 'score', 'average_score'].includes(sortKey)
							? players.sort(
								(a, b) =>
									personalScores[b][sortKey] - personalScores[a][sortKey],
							)
							: players.sort(
								(a, b) =>
									personalScores[a][sortKey] - personalScores[b][sortKey],
							)
					).map((player) => (
						<ListLinkItem key={player} to={`/app/player/${player}`}>
							<div className='w-50'>{player}</div>
							{sortKey &&
								Object.keys(personalScores).length !== 0 &&
								(['score', 'average_score'].includes(sortKey) ? (
									<PointView point={personalScores[player][sortKey]} />
								) : (
									personalScores[player][sortKey]
								))}
						</ListLinkItem>
					))}
				</ListGroup>
			)}

			<ListGroup>
				<ListButtonItem onClick={() => setOpen(true)}>プレイヤーを追加</ListButtonItem>
			</ListGroup>

			<Dialog
				open={open}
				onClose={() => {
					setNewPlayer('');
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
							await addPlayer(newPlayer);
							setNewPlayer('');
							setOpen(false);
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
						<ListButtonItem type="submit" disabled={addLoading} value="追加" />
					</ListGroup>
				</form>
			</Dialog>
		</AppWindow>
	);
};
