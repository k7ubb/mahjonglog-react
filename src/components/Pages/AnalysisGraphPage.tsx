import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { AppWindow, ListGroup, ListItem } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';
import { calculateRelativeGraphData } from '@/utils/calculateGraphData';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

const colorKeys = [
	'blue',
	'red',
	'green',
	'yellow',
	'purple',
	'pink',
	'indigo',
	'teal',
	'cyan',
	'emerald'
];

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
	scales: {
		y: {
			display: false,
		},
	},
};

export const AnalysisGraphPage = () => {
	const { players } = useParams<{ players: string }>();
	const playerList = players!.split(',');
	const { allLogs, filter, loading } = useHandleLog();
	const graphData = calculateRelativeGraphData(allLogs, playerList, filter);

	return (
		<AppWindow
			title='グラフで比較'
			backTo='/app/analysis'
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{playerList.map((player, i) => (
					<ListItem
						key={player}
						icon={FaCircle}
						iconColor={colors[colorKeys[i % colorKeys.length] as keyof typeof colors][500]}
					>
						{player}
					</ListItem>
				))}
			</ListGroup>
			<Line
				options={chartOptions}
				data={{
					labels: graphData.map((data) => data.label),
					datasets: playerList.map((player, i) => ({
						data: graphData.map((data) => data.score[player]),
						borderColor: colors[colorKeys[i % colorKeys.length] as keyof typeof colors][500],
						borderWidth: 3,
					})),
				}}
			/>
		</AppWindow>
	);
};
