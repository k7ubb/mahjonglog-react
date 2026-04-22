import { useParams } from 'react-router-dom';
import { AppWindow } from '@/components/Templates';
import { useAppData } from '@/contexts/useAppData';
import { calculateMatrixData } from '@/utils/calculateMatrixData';
import { round } from '@/utils/round';

const MatrixCell = (props: {score?: number}) => {
	const color = !props.score ? 'white' :
		'oklch(' + (0.8 - 0.1 * Math.abs(props.score)) + ' ' + (0.1 + 0.03 * Math.abs(props.score)) + ' ' +
		(props.score > 0 ? 254.128 : 18.334) + ')';
	return <td className='min-w-30 text-center' style={{backgroundColor: color}}>{props.score !== undefined ? round(props.score, 2): '-'}</td>;
};

const holdedCellClassName = 'min-w-30 p-4 text-left sticky left-0 bg-white border-r-2 border-r-red-300';

type Params = {
	ids: string;
};

export const AnalysisMatrixPage = () => {
	const { ids } = useParams<Params>() as Params;
	const { players, filteredLogs } = useAppData();
	const targetPlayers = ids.split(',').map((id) => players.find((p) => p.id === id)).filter((p) => !!p);
	const matrixData = calculateMatrixData(filteredLogs, targetPlayers.map(player => player.id));
	return (
		<AppWindow title='マトリクスで比較' backTo='/analysis'>
			<p className='mb-8'>
				<span className='bg-blue-200'>横軸</span>の順位 ー <span className='bg-red-200'>縦軸</span>の順位 の平均値を表示しています。
			</p>

			<div className='overflow-x-scroll relative'>
				<table className={'w-full bg-white border-separate border-spacing-0'}>
					<tbody>
						<tr>
							<th className={holdedCellClassName} />
							{targetPlayers.map((player) => (
								<th key={player.id} className='px-4 py-2 text-center border-b-2 border-b-blue-300'>{player.name}</th>
							))}
						</tr>
						{targetPlayers.map((playerA, i) => (
							<tr key={playerA.id}>
								<th className={holdedCellClassName}>{playerA.name}</th>
								{targetPlayers.map((_, j) => (
									<MatrixCell key={j} score={matrixData[i][j]} />
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</AppWindow>
	);
};
