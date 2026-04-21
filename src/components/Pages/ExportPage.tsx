import { AppWindow, ListGroup, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';

export const ExportPage = () => {
	const { logs } = useAppData();

	const handleExport = () => {
		const convertedLog = logs
			.toReversed()
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
		<AppWindow title='エクスポート'>
			<ListGroup title={`${logs.length}件のログがあります`}>
				<ListButtonItem onClick={handleExport}>ログファイルをエクスポート</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
