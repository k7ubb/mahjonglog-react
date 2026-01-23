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
import { AppWindow } from '../Templates';

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

export const PlayerGraphPage: React.FC = () => {
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
