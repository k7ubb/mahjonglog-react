import { useHandleLog } from '../../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../../Templates/AppWindow';

export const LogListPage: React.FC = () => {
	const { logs, loading } = useHandleLog();

	return (
		<AppWindow title="表示" backTo="/app" authOnly={true} loading={loading}>
			{logs.length > 0 && (
				<ListGroup>
					{logs.map((log) => (
						<ListItem key={log.date}>{log.date}</ListItem>
					))}
				</ListGroup>
			)}
		</AppWindow>
	);
};
