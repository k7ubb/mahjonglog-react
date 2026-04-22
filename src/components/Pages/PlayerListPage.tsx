import { useState } from 'react';
import { MdSort } from 'react-icons/md';
import colors from 'tailwindcss/colors';
import { match } from 'ts-pattern';
import { ColoredNumber } from '@/components/Presenter/ColoredNumber';
import { AppWindow, ListGroup, ListLinkItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import {
	type PersonalScore,
	calculatePersonalScore,
} from '@/utils/calculatePersonalScore';

type SortKey = null | 'count' | 'average_rank' | 'score' | 'average_score';

const getNextSortKey = (previousKey: SortKey): SortKey => match(previousKey)
	.with(null, () => 'count')
	.with('count', () => 'average_rank')
	.with('average_rank', () => 'score')
	.with('score', () => 'average_score')
	.otherwise(() => null) as SortKey;

export const PlayerListPage = () => {
	const { players, filteredLogs } = useAppData();
	const [sortKey, setSortKey] = useState<SortKey>(null);

	const personalScores: { [key: string]: PersonalScore } = {};
	players.forEach(
		(player) =>
			(personalScores[player.id] = calculatePersonalScore(filteredLogs, player.id)),
	);

	return (
		<AppWindow
			title={match(sortKey)
				.with('count', () => '試合数')
				.with('average_rank', () => '平均順位')
				.with('score', () => '累計得点')
				.with('average_score', () => '平均得点')
				.otherwise(() => 'プレイヤー成績')}
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
			{players && filteredLogs && (
				<ListGroup>
					{(!sortKey || Object.keys(personalScores).length === 0
						? players
						: ['count', 'score', 'average_score'].includes(sortKey)
							? players.toSorted(
								(a, b) =>
									personalScores[b.id][sortKey] - personalScores[a.id][sortKey],
							)
							: players.toSorted(
								(a, b) =>
									personalScores[a.id][sortKey] - personalScores[b.id][sortKey],
							)
					).map((player) => (
						<ListLinkItem key={player.id} to={`/player/${player.id}`}>
							<div className='w-50'>{player.name}</div>
							{sortKey &&
								Object.keys(personalScores).length !== 0 &&
								(['score', 'average_score'].includes(sortKey) ? (
									<ColoredNumber point={personalScores[player.id][sortKey]} />
								) : (
									personalScores[player.id][sortKey]
								))}
						</ListLinkItem>
					))}
				</ListGroup>
			)}

			<ListGroup>
				<ListLinkItem to='/player/add'>プレイヤーを追加</ListLinkItem>
			</ListGroup>
		</AppWindow>
	);
};
