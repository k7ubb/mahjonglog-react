import { AppWindow, ListGroup, ListButtonItem } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { formatDate } from '@/utils/formatDate';

export const ExportPage = () => {
	const { players, filteredLogs } = useAppData();

	const handleExport = () => {
		let result = `\t${players.map((player) => player.name).join('\t')}\n`;
		for (const log of filteredLogs.toReversed()) {
			const playerScores = players.map((player) => {
				const index = log.playerIDs.findIndex((id) => id === player.id);
				return index !== -1 ? log.scores[index].point : '';
			});
			result += `${formatDate(new Date(log.date))}\t${playerScores.join('\t')}\n`;
		}
		const blob = new Blob([result], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `logs_${new Date().toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<AppWindow title='エクスポート'>
			<ListGroup title={`${filteredLogs.length}件のログがあります`}>
				<ListButtonItem onClick={handleExport}>CSVをエクスポート</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
