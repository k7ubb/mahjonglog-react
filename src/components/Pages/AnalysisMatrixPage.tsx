import { useParams } from 'react-router-dom';
import { AppWindow } from '@/components/Templates';
import { useHandleLog } from '@/usecase/useHandleLog';
import { calculateMatrixData } from '@/utils/calculateMatrixData';
import { round } from '@/utils/round';

const MatrixCell = (props: {score?: number}) => {
	const color = !props.score ? 'white' :
		'oklch(' + (0.8 - 0.1 * Math.abs(props.score)) + ' ' + (0.1 + 0.03 * Math.abs(props.score)) + ' ' +
		(props.score > 0 ? 254.128 : 18.334) + ')';
	return <td className='min-w-30 text-center' style={{backgroundColor: color}}>{props.score !== undefined ? round(props.score, 2): '-'}</td>;
};

const holdedCellClassName = 'min-w-30 p-4 text-left sticky left-0 bg-white border-r-2 border-r-red-300';

export const AnalysisMatrixPage = () => {
	const { players } = useParams<{ players: string }>();
	const playerList = players!.split(',');
	const { logs, loading } = useHandleLog();
	const matrixData = calculateMatrixData(logs, playerList);

	return (
		<AppWindow
			title='マトリクスで比較'
			backTo='/app/analysis'
			authOnly={true}
			loading={loading}
		>
			<p className='mb-8'>
				<span className='bg-blue-200'>横軸</span>の順位 ー <span className='bg-red-200'>縦軸</span>の順位 の平均値を表示しています。
			</p>

			{matrixData && 
				<div className='overflow-x-scroll relative'>
					<table className={'w-full bg-white border-separate border-spacing-0'}>
						<tbody>
							<tr>
								<th className={holdedCellClassName} />
								{playerList.map((player) => (
									<th key={player} className='px-4 py-2 text-center border-b-2 border-b-blue-300'>{player}</th>
								))}
							</tr>
							{playerList.map((playerA, i) => (
								<tr key={playerA}>
									<th className={holdedCellClassName}>{playerA}</th>
									{playerList.map((_, j) => (
										<MatrixCell key={j} score={matrixData[i][j]} />
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			}
		</AppWindow>
	);
};
