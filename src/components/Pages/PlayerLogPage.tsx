import { useParams } from 'react-router-dom';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';

type Params = {
	player: string;
};

export const PlayerLogPage = () => {
	const { player } = useParams<Params>() as Params;
	const { filteredLogs } = useAppData();
	const playerLogs = filteredLogs.filter((log) => log.score.find((sc) => sc.player === player));

	return (
		<AppWindow title={`${player}の対局記録`}>
			<ListGroup>
				{playerLogs.map((log) => (
					<LogItem showDate={true} key={log.id} log={log} />
				))}
			</ListGroup>
		</AppWindow>
	);
};
