import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleLog } from '../../usecase/useHandleLog';
import { LogRow } from '../Presenter/LogRow';
import { AppWindow, ListGroup } from '../Templates/AppWindow';
import type { Log } from '../../usecase/useHandleLog';

export const PlayerLogPage: React.FC = () => {
	const { player } = useParams<{ player: string }>();
	const { logs, loading } = useHandleLog();
	const [playerLogs, setPlayerLogs] = useState<Log[]>([]);

	useEffect(() => {
		setPlayerLogs(
			logs.filter((log) => log.score.find((sc) => sc.player === player))
		);
	}, [logs]);

	return (
		<AppWindow
			title={`${player}の対局記録`}
			backTo={`/app/player/${player}`}
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{playerLogs.map((log) => (
					<LogRow showDate={true} key={log.id} log={log} />
				))}
			</ListGroup>
		</AppWindow>
	);
};
