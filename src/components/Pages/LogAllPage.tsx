import { useHandleLog } from '../../usecase/useHandleLog';
import { LogRow } from '../Presenter/LogRow';
import { AppWindow, ListGroup } from '../Templates/AppWindow';

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
					<LogRow key={log.id} log={log} />
				))}
			</ListGroup>
		</AppWindow>
	);
};
