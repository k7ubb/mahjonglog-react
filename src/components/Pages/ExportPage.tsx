import { useHandleLog } from '../../usecase/useHandleLog';
import { AppWindow, ListGroup, ListButtonItem } from '../Templates';

export const ExportPage = () => {
	const { logs, loading } = useHandleLog();

	const handleExport = () => {
		const convertedLog = [...logs]
			.reverse()
			.map((log) => ({ date: log.date, score: log.score }));
		const json = JSON.stringify(convertedLog)
			.replace(/\{"date/g, '\n  {"date')
			.replace(/]$/, '\n]');
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `logs_${new Date().toISOString().slice(0, 10)}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<AppWindow
			title="エクスポート"
			backTo="/app"
			authOnly={true}
			loading={loading}
		>
			<ListGroup title={`${logs.length}件のログがあります`}>
				<ListButtonItem onClick={handleExport}>ログファイルをエクスポート</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
