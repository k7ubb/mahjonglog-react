import { FaArrowCircleLeft } from 'react-icons/fa';
import { useHandleLog } from '../../usecase/useHandleLog';
import { LogRow } from '../Presenter/LogRow';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const LogDeletedPage: React.FC = () => {
	const { deletedLogs, loading, restoreLog } = useHandleLog();

	return (
		<AppWindow
			title="削除したログ"
			backTo="/app/log"
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{!loading && deletedLogs.length === 0 ? (
					<ListItem>削除したログはありません</ListItem>
				) : (
					deletedLogs.map((log) => (
						<LogRow
							showDate={true}
							key={log.id}
							log={log}
							buttonElement={
								<FaArrowCircleLeft
									size={21}
									color="#007aff"
									style={{ marginTop: '4px', marginRight: '4px' }}
								/>
							}
							onClick={async () => {
								await restoreLog(log.id);
							}}
						/>
					))
				)}
			</ListGroup>
		</AppWindow>
	);
};
