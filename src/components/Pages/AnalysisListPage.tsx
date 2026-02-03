import { useState } from 'react';
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { AppWindow, ListGroup, ListButtonItem } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';
import { useHandlePlayer } from '@/usecase/useHandlePlayer';

export const AnalysisListPage = () => {
	const { players, loading } = useHandlePlayer();
	const { logs, loading: logLoading } = useHandleLog();
	const [ selectedPlayers, setSelectedPlayers ] = useState<string[]>([]);
	const navigate = useNavigate();

	return (
		<AppWindow
			title='詳細分析'
			backTo="/app"
			authOnly={true}
			loading={loading || logLoading}
		>
			{players && logs && (
				<>
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
							onClick={() => navigate(`/app/analysis/graph/${selectedPlayers.join(',')}`)}
							disabled={selectedPlayers.length < 2}
							className='justify-center'
						>
							グラフで比較
						</ListButtonItem>
						<ListButtonItem
							onClick={() => navigate(`/app/analysis/matrix/${selectedPlayers.join(',')}`)}
							disabled={selectedPlayers.length < 2}
							className='justify-center'
						>
							マトリクスで比較
						</ListButtonItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
