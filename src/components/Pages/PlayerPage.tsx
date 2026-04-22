import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { ColoredNumber } from '@/components/Presenter/ColoredNumber';
import { AppWindow, ListGroup, ListItem, ListLinkItem, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';
import { calculatePersonalScore } from '@/utils/calculatePersonalScore';
import { round } from '@/utils/round';

const ScoreRow = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<ListItem>
		<div className='w-50'>{title}</div>
		{children}
	</ListItem>
);

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

type Params = {
	id: string;
};

export const PlayerPage = () => {
	const navigate = useNavigate();
	const { id } = useParams<Params>() as Params;
	const { players, logs, filteredLogs, deletePlayer } = useAppData();
	const { loading, startLoading, endLoading } = useLoading();
	const player = players.find((p) => p.id === id);
	if (!player) {
		throw new Error('プレイヤーが見つかりません');
	}
	const personalScore = calculatePersonalScore(filteredLogs, player.id);
	
	const recentRecords = [];
	for (const log of filteredLogs) {
		const index = log.playerIDs.findIndex((id) => id === player.id);
		if (index > -1) {
			recentRecords.push(index + 1);
			if (recentRecords.length == 10) {
				break;
			}
		}
	}

	const recentAverage = recentRecords.length > 0 ?
		recentRecords.reduce((acc, cur) => acc + cur, 0) / recentRecords.length
		: '-';

	while (recentRecords.length < 10) {
		recentRecords.push(null);
	}
	recentRecords.reverse();

	const chartOptions = {
		plugins: {
			title: {
				display: true,
				text: `直近10試合: 平均順位 ${recentAverage === '-' ? '-' : round(recentAverage, 2)}`,
			},
		},
		scales: {
			x: {
				display: false,
			},
			y: {
				min: 1,
				max: 4,
				reverse: true,
				ticks: {
					count: 4,
				},
			},
		},
	};

	return (
		<AppWindow title={player.name}>
			{personalScore && (
				<>
					<ListGroup>
						<ScoreRow title='1位'>{personalScore.rank[0]}</ScoreRow>
						<ScoreRow title='2位'>{personalScore.rank[1]}</ScoreRow>
						<ScoreRow title='3位'>{personalScore.rank[2]}</ScoreRow>
						<ScoreRow title='4位'>{personalScore.rank[3]}</ScoreRow>
						<ScoreRow title='試合数'>{personalScore.count}</ScoreRow>
						<ScoreRow title='平均順位'>{personalScore.average_rank}</ScoreRow>
						<ScoreRow title='累計得点'>
							<ColoredNumber point={personalScore.score} />
						</ScoreRow>
						<ScoreRow title='平均得点'>
							<ColoredNumber point={personalScore.average_score} />
						</ScoreRow>
					</ListGroup>

					<ListGroup>
						<ListLinkItem to={`/player/${id}/logs`}>
							対局記録を表示
						</ListLinkItem>
						<ListLinkItem to={`/player/${id}/graph`}>
							点数推移を表示
						</ListLinkItem>
					</ListGroup>

					<Line
						options={chartOptions}
						data={{
							labels: new Array(10).fill(''),
							datasets: [
								{
									data: recentRecords,
									borderColor: colors.blue[500],
									borderWidth: 3,
								},
							],
						}}
					/>

					<div style={{ height: '64px' }} />
					<ListGroup>
						<ListButtonItem
							disabled={loading}
							onClick={() => {
								if (logs.some((log) => log.playerIDs.some((id) => id === player.id))) {
									alert('対局記録があるプレイヤーは削除できません');
								} else if (confirm(`'${player.name}' を削除してもよろしいですか?`)) {
									startLoading();
									void deletePlayer(player.id)
										.then(() => {
											navigate('/player');
											endLoading();
										});
								}
							}}
						>
							プレイヤーを削除
						</ListButtonItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
