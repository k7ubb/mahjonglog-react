import { useHandleLog } from '../../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListItem } from '../../Templates/AppWindow';

export const LogListPage: React.FC = () => {
	const { logs, loading } = useHandleLog();

	return (
		<AppWindow title="ログ表示" backTo="/app" authOnly={true} loading={loading}>
			<ListGroup>
				{logs.map((log) => (
					<ListItem key={log.date} linkTo={`/app/log/${log.date}`}>
						{log.date} ({log.scores.length})
					</ListItem>
				))}
			</ListGroup>
		</AppWindow>
	);
};
