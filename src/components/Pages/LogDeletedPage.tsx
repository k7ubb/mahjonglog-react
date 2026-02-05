import { useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup, ListItem, ListButtonItem } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';

export const LogDeletedPage = () => {
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
							<LogItem
								showDate={true}
								key={log.id}
								log={log}
								buttonElement={
									<FaArrowCircleLeft
										size={21}
										color="#007aff"
										className='hover:opacity-50'
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
						<ListButtonItem
							onClick={() => {
								if (
									confirm(
										'削除したログを完全に削除します。この操作は取り消せません。\n本当によろしいですか?',
									)
								) {
									void deleteLogCompletely();
								}
							}}
							className='text-red-600 hover:bg-red-50'
						>
							全ての削除したログを完全に削除
						</ListButtonItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
