import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import { ColoredNumber } from '@/components/Presenter/ColoredNumber';
import { AppWindow, ListGroup, ListItem, ListLinkItem, ListButtonItem } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';
import { useHandlePersonalScore } from '@/usecase/useHandlePersonalScore';
import { useHandlePlayer } from '@/usecase/useHandlePlayer';

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

export const PlayerPage = () => {
	const navigate = useNavigate();
	const { player } = useParams<{ player: string }>();
	const { allLogs } = useHandleLog();
	const { deletePlayer } = useHandlePlayer();
	const { personalScore, loading: personalScoreLoading } =
		useHandlePersonalScore(player || '');
	const [loading, setLoading] = useState(false);

	const recentRecords = [];
	for (const log of allLogs) {
		for (let i = 0; i < 4; i++) {
			if (log.score[i].player === player) {
				recentRecords.push(i + 1);
			}
		}
		if (recentRecords.length == 10) {
			break;
		}
	}

	const recentAverage =
		recentRecords.reduce((acc, cur) => acc + cur, 0) / recentRecords.length;

	while (recentRecords.length < 10) {
		recentRecords.push(null);
	}
	recentRecords.reverse();

	const chartOptions = {
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: `直近10試合: 平均順位 ${Math.floor(recentAverage * 100) / 100}`,
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
		<AppWindow
			title={player!}
			backTo="/app/player"
			authOnly={true}
			loading={personalScoreLoading || loading}
		>
			{personalScore && (
				<>
					<ListGroup>
						<ScoreRow title="1位">{personalScore.rank[0]}</ScoreRow>
						<ScoreRow title="2位">{personalScore.rank[1]}</ScoreRow>
						<ScoreRow title="3位">{personalScore.rank[2]}</ScoreRow>
						<ScoreRow title="4位">{personalScore.rank[3]}</ScoreRow>
						<ScoreRow title="試合数">{personalScore.count}</ScoreRow>
						<ScoreRow title="平均順位">{personalScore.average_rank}</ScoreRow>
						<ScoreRow title="累計得点">
							<ColoredNumber point={personalScore.score} />
						</ScoreRow>
						<ScoreRow title="平均得点">
							<ColoredNumber point={personalScore.average_score} />
						</ScoreRow>
					</ListGroup>

					<ListGroup>
						<ListLinkItem to={`/app/player/${player}/logs`}>
							対局記録を表示
						</ListLinkItem>
						<ListLinkItem to={`/app/player/${player}/graph`}>
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
									borderColor: '#007aff',
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
								if (
									allLogs.some((log) =>
										log.score.some(({ player: player_ }) => player === player_),
									)
								) {
									alert('対局記録があるプレイヤーは削除できません');
								} else if (confirm(`'${player}' を削除してもよろしいですか?`)) {
									setLoading(true);
									void deletePlayer(player!)
										.then(() => {
											navigate('/app/player');
											setLoading(false);
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
