import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';
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

export const LogDailyPage: React.FC = () => {
	const { date } = useParams<{ date: string }>();
	const { logs, loading, deleteLog } = useHandleLog();
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
					<LogRow
						key={log.id}
						log={log}
						buttonElement={<TiDelete size={30} color="#f00" />}
						onClick={async () => {
							if (confirm('ログを削除します。よろしいですか?')) {
								await deleteLog(log.id);
							}
						}}
					/>
				))}
			</ListGroup>
		</AppWindow>
	);
};
