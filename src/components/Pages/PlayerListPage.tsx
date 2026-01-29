import { useState, useEffect } from 'react';
import { MdSort } from 'react-icons/md';
import colors from 'tailwindcss/colors';
import { match } from 'ts-pattern';
import { ColoredNumber } from '@/components/Presenter/ColoredNumber';
import { AppWindow, ListGroup, ListLinkItem } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';
import { useHandlePlayer } from '@/usecase/useHandlePlayer';
import {
	type PersonalScore,
	calculatePersonalScore,
} from '@/utils/personalScore';

type SortKey = null | 'count' | 'average_rank' | 'score' | 'average_score';

const getNextSortKey = (previousKey: SortKey): SortKey => match(previousKey)
	.with(null, () => 'count')
	.with('count', () => 'average_rank')
	.with('average_rank', () => 'score')
	.with('score', () => 'average_score')
	.otherwise(() => null) as SortKey;

export const PlayerListPage = () => {
	const { players, loading } = useHandlePlayer();
	const { logs, loading: logLoading } = useHandleLog();
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
			loading={loading || logLoading}
			extraButtons={[
				{
					icon: MdSort,
					iconColor: sortKey ? colors.green[600] : colors.stone[600],
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
							? players.toSorted(
								(a, b) =>
									personalScores[b][sortKey] - personalScores[a][sortKey],
							)
							: players.toSorted(
								(a, b) =>
									personalScores[a][sortKey] - personalScores[b][sortKey],
							)
					).map((player) => (
						<ListLinkItem key={player} to={`/app/player/${player}`}>
							<div className='w-50'>{player}</div>
							{sortKey &&
								Object.keys(personalScores).length !== 0 &&
								(['score', 'average_score'].includes(sortKey) ? (
									<ColoredNumber point={personalScores[player][sortKey]} />
								) : (
									personalScores[player][sortKey]
								))}
						</ListLinkItem>
					))}
				</ListGroup>
			)}

			<ListGroup>
				<ListLinkItem to="/app/player/add">プレイヤーを追加</ListLinkItem>
			</ListGroup>
		</AppWindow>
	);
};
