import { FaArrowCircleLeft } from 'react-icons/fa';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup, ListItem, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';

export const LogDeletedPage = () => {
	const { deletedLogs, restoreLog, deleteLogCompletely } = useAppData();
	const { startLoading, endLoading } = useLoading();

	return (
		<AppWindow title='削除したログ'>
			{deletedLogs.length ? (
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
										color='#007aff'
										className='hover:opacity-50'
									/>
								}
								onClick={async () => {
									if (confirm('ログを復元します。よろしいですか?')) {
										startLoading();
										try {
											await restoreLog(log.id);
										} finally {
											endLoading();
										}
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
			) : (
				<ListGroup>
					<ListItem>削除したログはありません</ListItem>
				</ListGroup>
			)}
		</AppWindow>
	);
};
