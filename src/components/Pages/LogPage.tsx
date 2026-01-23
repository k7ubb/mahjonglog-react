import { useState, useEffect } from 'react';
import { type Log, useHandleLog } from '../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListLinkItem } from '../Templates';

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

export const LogPage: React.FC = () => {
	const { logs, deletedLogs, loading } = useHandleLog();
	const [logsByDate, setLogsByDate] = useState<{ date: string; logs: Log[] }[]>(
		[],
	);

	useEffect(() => {
		const logsByDate_: { date: string; logs: Log[] }[] = [];
		for (const log of logs) {
			const date = formatDate(new Date(log.date));
			const element = logsByDate_.find((log) => log.date === date);
			if (element) {
				element.logs.push(log);
			} else {
				logsByDate_.push({
					date,
					logs: [log],
				});
			}
		}
		setLogsByDate(logsByDate_);
	}, [logs]);

	return (
		<AppWindow
			title="対局ログ一覧"
			backTo="/app"
			authOnly={true}
			loading={loading}
		>
			{!loading && (
				<>
					<ListGroup>
						<ListLinkItem to={'/app/log/all'}>
							全てのログ ({logs.length})
						</ListLinkItem>
					</ListGroup>
					<ListGroup>
						{logsByDate.map((logs) => (
							<ListLinkItem key={logs.date} to={`/app/log/${logs.date}`}>
								{logs.date} ({logs.logs.length})
							</ListLinkItem>
						))}
					</ListGroup>
					<div style={{ height: '64px' }} />
					<ListGroup>
						<ListLinkItem to={'/app/log/deleted'}>
							削除したログを表示 ({deletedLogs.length})
						</ListLinkItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
