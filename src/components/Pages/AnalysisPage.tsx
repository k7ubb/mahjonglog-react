import { useState } from 'react';
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { AppWindow, ListGroup, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';

export const AnalysisPage = () => {
	const { players } = useAppData();
	const [ selectedPlayers, setSelectedPlayers ] = useState<string[]>([]);
	const navigate = useNavigate();

	return (
		<AppWindow title='詳細分析'>
			<ListGroup>
				{players.map((player) => (
					<ListButtonItem
						key={player}
						icon={selectedPlayers.includes(player) ? IoIosCheckmarkCircle : IoIosCheckmarkCircleOutline}
						iconColor={selectedPlayers.includes(player) ? colors.green[500] : colors.stone[300]}
						onClick={() => {
							if (selectedPlayers.includes(player)) {
								setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
							} else {
								setSelectedPlayers([...selectedPlayers, player]);
							}
						}}
					>
						<div className='w-50 text-black'>{player}</div>
					</ListButtonItem>
				))}
			</ListGroup>
			<ListGroup>
				<ListButtonItem
					onClick={() => navigate(`/analysis/graph/${selectedPlayers.join(',')}`)}
					disabled={selectedPlayers.length < 2}
					className={`justify-center ${selectedPlayers.length < 2 && 'text-stone-500 line-through'}`}
				>
					グラフで比較
				</ListButtonItem>
				<ListButtonItem
					onClick={() => navigate(`/analysis/matrix/${selectedPlayers.join(',')}`)}
					disabled={selectedPlayers.length < 2}
					className={`justify-center ${selectedPlayers.length < 2 && 'text-stone-500 line-through'}`}
				>
					マトリクスで比較
				</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
