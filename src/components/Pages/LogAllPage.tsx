import { TiDelete } from 'react-icons/ti';
import { useHandleLog } from '../../usecase/useHandleLog';
import { LogRow } from '../Presenter/LogRow';
import { AppWindow, ListGroup } from '../Templates/AppWindow';

export const LogAllPage: React.FC = () => {
	const { logs, loading, deleteLog } = useHandleLog();

	return (
		<AppWindow
			title="全てのログ"
			backTo="/app/log"
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{logs.map((log) => (
					<LogRow
						key={log.id}
						log={log}
						buttonElement={<TiDelete />}
						onClick={async () => {
							if (confirm('ログを削除します。よろしいですか?')) {
								await deleteLog(log.id);
							}
						}}
					/>
				))}
			</ListGroup>
		</AppWindow>
	);
};
