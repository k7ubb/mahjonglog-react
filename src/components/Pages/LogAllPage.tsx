import { useHandleLog } from '../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
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

export const LogAllPage: React.FC = () => {
	const { logs, loading } = useHandleLog();

	return (
		<AppWindow
			title="全てのログ"
			backTo="/app/log"
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{logs.map((log) => (
					<ListItem key={log.id}>
						<div className={style.log}>
							{formatDate(new Date(log.date))}
							<br />
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
