import { TiDelete } from 'react-icons/ti';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { useLoading } from '@/contexts/useLoading';

export const LogAllPage = () => {
	const { filteredLogs, deleteLog } = useAppData();
	const { startLoading, endLoading } = useLoading();

	return (
		<AppWindow title='全てのログ'>
			<ListGroup>
				{filteredLogs.map((log) => (
					<LogItem
						showDate={true}
						key={log.id}
						log={log}
						buttonElement={<TiDelete size={30} color='#f00' className='hover:opacity-50' />}
						onClick={async () => {
							if (confirm('ログを削除します。よろしいですか?')) {
								startLoading();
								try {
									await deleteLog(log.id);
								} finally {
									endLoading();
								}
							}
						}}
					/>
				))}
			</ListGroup>
		</AppWindow>
	);
};
