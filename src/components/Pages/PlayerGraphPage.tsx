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
import colors from 'tailwindcss/colors';
import { AppWindow } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { calculateGraphData } from '@/utils/calculateGraphData';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

const chartOptions = {
	plugins: {
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

type Params = {
	player: string;
};

export const PlayerGraphPage = () => {
	const { player } = useParams<Params>() as Params;
	const { logs, filterFrom, filterTo } = useAppData();
	const graphData = calculateGraphData(logs, player, filterFrom, filterTo);

	return (
		<AppWindow title={`${player}の点数推移`}>
			<Line
				options={chartOptions}
				data={{
					labels: graphData.map((data) => data.label),
					datasets: [
						{
							data: graphData.map((data) => data.score),
							borderColor: colors.blue[500],
							borderWidth: 3,
						},
					],
				}}
			/>
		</AppWindow>
	);
};
