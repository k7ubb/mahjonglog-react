import { TiDelete } from 'react-icons/ti';
import { useParams } from 'react-router-dom';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';
import { formatDate } from '@/utils/formatDate';

type Params = {
	date: string;
};

export const LogDailyPage = () => {
	const { date } = useParams<Params>() as Params;
	const { filteredLogs, deleteLog } = useAppData();
	const { startLoading, endLoading } = useLoading();
	const dayLogs = filteredLogs.filter((log) => formatDate(new Date(log.date)) === date);

	return (
		<AppWindow title={date}>
			<ListGroup>
				{dayLogs.map((log) => (
					<LogItem
						key={log.id}
						log={log}
						buttonElement={<TiDelete size={30} color='#f00' className='hover:opacity-50' />}
						onClick={async () => {
							if (confirm('ログを削除します。よろしいですか?')) {
								startLoading();
								try {
									await deleteLog(log.id);
								} finally {
									endLoading();
								}
							}
						}}
					/>
				))}
			</ListGroup>
		</AppWindow>
	);
};
