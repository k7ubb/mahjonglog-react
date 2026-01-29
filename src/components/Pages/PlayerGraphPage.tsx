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
import { AppWindow } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';
import { calculateGraphData } from '@/utils/calculateGraphData';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

export const PlayerGraphPage = () => {
	const { player } = useParams<{ player: string }>();
	const { allLogs, filter, loading } = useHandleLog();
	const graphData = calculateGraphData(allLogs, player!, filter);

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
			loading={loading}
		>
			<Line
				options={chartOptions}
				data={{
					labels: graphData.map((data) => data.label),
					datasets: [
						{
							data: graphData.map((data) => data.score),
							borderColor: '#007aff',
							borderWidth: 3,
						},
					],
				}}
			/>
		</AppWindow>
	);
};
