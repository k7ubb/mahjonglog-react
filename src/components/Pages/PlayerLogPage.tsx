import { useParams } from 'react-router-dom';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';

type Params = {
	id: string;
};

export const PlayerLogPage = () => {
	const { id } = useParams<Params>() as Params;
	const { players, filteredLogs } = useAppData();
	const player = players.find((p) => p.id === id);
	if (!player) {
		throw new Error('プレイヤーが見つかりません');
	}
	const playerLogs = filteredLogs.filter((log) => log.playerIDs.includes(player.id));

	return (
		<AppWindow title={`${player.name}の対局記録`}>
			<ListGroup>
				{playerLogs.map((log) => (
					<LogItem showDate={true} key={log.id} log={log} />
				))}
			</ListGroup>
		</AppWindow>
	);
};
