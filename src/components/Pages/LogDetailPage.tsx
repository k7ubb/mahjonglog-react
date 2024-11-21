import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleLog } from '../../usecase/useHandleLog';
import { LogRow } from '../Presenter/LogRow';
import { AppWindow, ListGroup } from '../Templates/AppWindow';
import type { Log } from '../../usecase/useHandleLog';

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

export const LogDetailPage: React.FC = () => {
	const { date } = useParams<{ date: string }>();
	const { logs, loading } = useHandleLog();
	const [dayLogs, setDayLogs] = useState<Log[]>([]);

	useEffect(() => {
		setDayLogs(logs.filter((log) => formatDate(new Date(log.date)) === date));
	}, [logs]);

	return (
		<AppWindow
			title={date!}
			backTo="/app/log"
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{dayLogs.map((log) => (
					<LogRow key={log.id} log={log} />
				))}
			</ListGroup>
		</AppWindow>
	);
};
