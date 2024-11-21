import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleLog } from '../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import type { Log } from '../../usecase/useHandleLog';
import style from './LogDetailPage.module.css';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

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
					<ListItem key={log.id}>
						<div className={style.log}>
							1: {log.score[0].player} <PointView point={log.score[0].point} />
							<br />
							2: {log.score[1].player} <PointView point={log.score[1].point} />
							<br />
							3: {log.score[2].player} <PointView point={log.score[2].point} />
							<br />
							4: {log.score[3].player} <PointView point={log.score[3].point} />
						</div>
					</ListItem>
				))}
			</ListGroup>
		</AppWindow>
	);
};
