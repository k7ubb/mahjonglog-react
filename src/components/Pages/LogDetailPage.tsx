import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleLog } from '../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import type { Score } from '../../usecase/useHandleLog';
import style from './LogDetailPage.module.css';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

export const LogDetailPage: React.FC = () => {
	const { date } = useParams<{ date: string }>();
	const { logs, loading } = useHandleLog();
	const [dayLog, setDayLog] = useState<Score[]>([]);

	useEffect(() => {
		setDayLog(logs.find((log) => log.date === date)?.scores || []);
	}, [logs]);

	return (
		<AppWindow
			title={date || ''}
			backTo="/app/log"
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{dayLog.map((log, i) => (
					<ListItem key={i}>
						<div className={style.log}>
							1: {log[0].player} <PointView point={log[0].point} />
							<br />
							2: {log[1].player} <PointView point={log[1].point} />
							<br />
							3: {log[2].player} <PointView point={log[2].point} />
							<br />
							4: {log[3].player} <PointView point={log[3].point} />
						</div>
					</ListItem>
				))}
			</ListGroup>
		</AppWindow>
	);
};
