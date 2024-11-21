import { useState, useEffect } from 'react';
import { Log, useHandleLog } from '../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

export const LogListPage: React.FC = () => {
	const { logs, loading } = useHandleLog();
	const [logsByDate, setLogsByDate] = useState<{ date: string; logs: Log[] }[]>(
		[]
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
		<AppWindow title="ログ表示" backTo="/app" authOnly={true} loading={loading}>
			{!loading && (
				<>
					<ListGroup>
						<ListItem linkTo={`/app/log/all`}>
							全てのログ ({logs.length})
						</ListItem>
					</ListGroup>
					<ListGroup>
						{logsByDate.map((logs) => (
							<ListItem key={logs.date} linkTo={`/app/log/${logs.date}`}>
								{logs.date} ({logs.logs.length})
							</ListItem>
						))}
					</ListGroup>
					<ListGroup>
						<ListItem linkTo={`/app/log/deleted`}>
							削除したログを表示
						</ListItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
