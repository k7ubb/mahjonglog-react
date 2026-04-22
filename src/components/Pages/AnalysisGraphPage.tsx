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
	ids: string;
};

export const AnalysisGraphPage = () => {
	const { ids } = useParams<Params>() as Params;
	const [isNormalize, setIsNormalize] = useState(false);
	const { players, logs, filterFrom, filterTo } = useAppData();
	const targetPlayers = ids.split(',').map((id) => players.find((p) => p.id === id)).filter((p) => !!p);
	const graphData = calculateRelativeGraphData(logs, targetPlayers.map(player => player.id), filterFrom, filterTo, isNormalize);

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
				{targetPlayers.map((player, i) => (
					<ListItem
						key={player.id}
						icon={FaCircle}
						iconColor={colors[colorKeys[i % colorKeys.length] as keyof typeof colors][500]}
					>
						{player.name}
					</ListItem>
				))}
			</ListGroup>
			<Line
				options={chartOptions}
				data={{
					labels: graphData.map((data) => data.label),
					datasets: targetPlayers.map((player, i) => ({
						data: graphData.map((data) => data.score[player.id]),
						borderColor: colors[colorKeys[i % colorKeys.length] as keyof typeof colors][500],
						borderWidth: 3,
					})),
				}}
			/>
		</AppWindow>
	);
};
