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
import { FaCircle } from 'react-icons/fa';
import { TfiArrowsVertical } from 'react-icons/tfi';
import { useParams } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { AppWindow, ListGroup, ListItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
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

type Params = {
	players: string;
};

export const AnalysisGraphPage = () => {
	const { players } = useParams<Params>() as Params;
	const playerList = players.split(',');
	const [isNormalize, setIsNormalize] = useState(false);
	const { logs, filterFrom, filterTo } = useAppData();
	const graphData = calculateRelativeGraphData(logs, playerList, filterFrom, filterTo, isNormalize);

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
				display: !isNormalize,
			},
		},
	};
	
	return (
		<AppWindow
			title='グラフで比較'
			backTo='/analysis'
			extraButtons={[
				{
					icon: TfiArrowsVertical,
					iconColor: isNormalize ? colors.green[600] : colors.stone[600],
					onClick: () => setIsNormalize(!isNormalize)
				}
			]}
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
