import { useState, useEffect } from 'react';
import { TiDelete } from 'react-icons/ti';
import { useParams } from 'react-router-dom';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup } from '@/components/Templates';
import { type Log } from '@/usecase/useHandleLog';
import { useHandleLog } from '@/usecase/useHandleLog';
import { formatDate } from '@/utils/formatDate';

export const LogDailyPage = () => {
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
					<LogItem
						key={log.id}
						log={log}
						buttonElement={<TiDelete size={30} color="#f00" className='hover:opacity-50' />}
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
