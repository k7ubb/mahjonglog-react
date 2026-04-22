import { useState } from 'react';
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { AppWindow, ListGroup, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';

export const AnalysisPage = () => {
	const { players } = useAppData();
	const [ targetPids, setTargetPids ] = useState<string[]>([]);
	const navigate = useNavigate();

	return (
		<AppWindow title='詳細分析'>
			<ListGroup>
				{players.map((player) => (
					<ListButtonItem
						key={player.id}
						icon={targetPids.includes(player.id) ? IoIosCheckmarkCircle : IoIosCheckmarkCircleOutline}
						iconColor={targetPids.includes(player.id) ? colors.green[500] : colors.stone[300]}
						onClick={() => {
							if (targetPids.includes(player.id)) {
								setTargetPids(targetPids.filter((p) => p !== player.id));
							} else {
								setTargetPids([...targetPids, player.id]);
							}
						}}
					>
						<div className='w-50 text-black'>{player.name}</div>
					</ListButtonItem>
				))}
			</ListGroup>
			<ListGroup>
				<ListButtonItem
					onClick={() => navigate(`/analysis/graph/${targetPids.join(',')}`)}
					disabled={targetPids.length < 2}
					className={`justify-center ${targetPids.length < 2 && 'text-stone-500 line-through'}`}
				>
					グラフで比較
				</ListButtonItem>
				<ListButtonItem
					onClick={() => navigate(`/analysis/matrix/${targetPids.join(',')}`)}
					disabled={targetPids.length < 2}
					className={`justify-center ${targetPids.length < 2 && 'text-stone-500 line-through'}`}
				>
					マトリクスで比較
				</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
