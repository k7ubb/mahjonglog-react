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
	id: string;
};

export const PlayerGraphPage = () => {
	const { id } = useParams<Params>() as Params;
	const { players, logs, filterFrom, filterTo } = useAppData();
	const player = players.find((p) => p.id === id);
	if (!player) {
		throw new Error('プレイヤーが見つかりません');
	}
	const graphData = calculateGraphData(logs, player.id, filterFrom, filterTo);

	return (
		<AppWindow title={`${player.name}の点数推移`}>
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
