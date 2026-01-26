import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useHandleLog } from '../../usecase/useHandleLog';
import { useHandlePersonalScore } from '../../usecase/useHandlePersonalScore';
import { formatDate } from '../../utils/formatDate';
import { AppWindow } from '../Templates';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

export const PlayerGraphPage = () => {
	const { player } = useParams<{ player: string }>();
	const { allLogs, loading } = useHandleLog();
	const { personalScore, loading: personalScoreLoading } =
		useHandlePersonalScore(player || '');
	const graphData: {
		label: string;
		score: number;
	}[] = [];

	for (const log of [...allLogs].reverse()) {
		for (let i = 0; i < 4; i++) {
			if (log.score[i].player === player) {
				graphData.push({
					label: formatDate(new Date(log.date)),
					score:
						log.score[i].point +
						(graphData.length > 0 ? graphData[graphData.length - 1].score : 0),
				});
			}
		}
	}

	const chartOptions = {
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: '点数推移',
			},
		},
		elements: {
			point: {
				radius: 0,
				hoverRadius: 0,
				hitRadius: 0,
			},
		},
	};

	return (
		<AppWindow
			title={`${player}の点数推移`}
			backTo={`/app/player/${player}`}
			authOnly={true}
			loading={personalScoreLoading || loading}
		>
			{personalScore && (
				<Line
					options={chartOptions}
					data={{
						// アプリ以降前のデータを除外
						labels: graphData
							.filter((data) => data.label !== '1970-01-01')
							.map((data) => data.label),
						datasets: [
							{
								data: graphData
									.filter((data) => data.label !== '1970-01-01')
									.map((data) => data.score),
								borderColor: '#007aff',
								borderWidth: 3,
							},
						],
					}}
				/>
			)}
		</AppWindow>
	);
};
