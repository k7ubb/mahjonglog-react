import { useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useHandleLog } from '../../usecase/useHandleLog';
import { LogRow } from '../Presenter/LogRow';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const LogDeletedPage: React.FC = () => {
	const { deletedLogs, loading, restoreLog, deleteLogCompletely } =
		useHandleLog();
	const [actionLoading, setActionLoading] = useState(false);

	return (
		<AppWindow
			title="削除したログ"
			backTo="/app/log"
			authOnly={true}
			loading={loading || actionLoading}
		>
			{!loading && deletedLogs.length === 0 && (
				<ListGroup>
					<ListItem>削除したログはありません</ListItem>
				</ListGroup>
			)}
			{deletedLogs.length !== 0 && (
				<>
					<ListGroup>
						{deletedLogs.map((log) => (
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
									if (confirm('ログを復元します。よろしいですか?')) {
										setActionLoading(true);
										await restoreLog(log.id);
										setActionLoading(false);
									}
								}}
							/>
						))}
					</ListGroup>
					<ListGroup>
						<ListItem
							onClick={async () => {
								if (
									confirm(
										'削除したログを完全に削除します。この操作は取り消せません。\n本当によろしいですか?'
									)
								) {
									await deleteLogCompletely();
								}
							}}
						>
							全ての削除したログを完全に削除
						</ListItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
