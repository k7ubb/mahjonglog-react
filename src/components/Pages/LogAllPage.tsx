import { useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { LogItem } from '@/components/Presenter/LogItem';
import { AppWindow, ListGroup } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';

export const LogAllPage = () => {
	const { logs, loading, deleteLog } = useHandleLog();
	const [actionLoading, setActionLoading] = useState(false);

	return (
		<AppWindow
			title="全てのログ"
			backTo="/app/log"
			authOnly={true}
			loading={loading || actionLoading}
		>
			<ListGroup>
				{logs.map((log) => (
					<LogItem
						showDate={true}
						key={log.id}
						log={log}
						buttonElement={<TiDelete size={30} color="#f00" />}
						onClick={async () => {
							if (confirm('ログを削除します。よろしいですか?')) {
								setActionLoading(true);
								await deleteLog(log.id);
								setActionLoading(false);
							}
						}}
					/>
				))}
			</ListGroup>
		</AppWindow>
	);
};
