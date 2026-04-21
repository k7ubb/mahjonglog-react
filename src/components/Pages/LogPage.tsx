import { AppWindow, ListGroup, ListLinkItem } from '@/components/Templates';
import { type Log, useAppData } from '@/contexts/useAppData';
import { formatDate } from '@/utils/formatDate';

export const LogPage = () => {
	const { filteredLogs, deletedLogs } = useAppData();
	const logsByDate: { date: string; logs: Log[] }[] = [];

	for (const log of filteredLogs) {
		const date = formatDate(new Date(log.date));
		const element = logsByDate.find((log) => log.date === date);
		if (element) {
			element.logs.push(log);
		} else {
			logsByDate.push({
				date,
				logs: [log],
			});
		}
	}

	return (
		<AppWindow title='対局ログ一覧'>
			<ListGroup>
				<ListLinkItem to={'/log/all'}>
					全てのログ ({filteredLogs.length})
				</ListLinkItem>
			</ListGroup>
			<ListGroup>
				{logsByDate.map((logs) => (
					<ListLinkItem key={logs.date} to={`/log/${logs.date}`}>
						{logs.date} ({logs.logs.length})
					</ListLinkItem>
				))}
			</ListGroup>
			<div style={{ height: '64px' }} />
			<ListGroup>
				<ListLinkItem to={'/log/deleted'}>
					削除したログを表示 ({deletedLogs.length})
				</ListLinkItem>
			</ListGroup>
		</AppWindow>
	);
};
