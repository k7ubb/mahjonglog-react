import { useState } from 'react';
import { type Log } from '../../usecase/useHandleLog';
import { ListItem } from '../Templates';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

export const LogRow = ({
	log,
	showDate,
	buttonElement,
	onClick,
}: {
	log: Log;
	showDate?: boolean;
	buttonElement?: JSX.Element;
	onClick?: () => Promise<void>;
}) => {
	const [loading, setLoading] = useState(false);

	return (
		<ListItem className='h-auto'>
			<div>
				{showDate && <p className='mb-2'>{formatDate(new Date(log.date))}</p>}
				{new Array(4).fill(null).map((_, i) => (
					<div className='flex mb-1'>
						<p className='w-50'>{i+1}: {log.score[i].player}</p>
						<PointView point={log.score[i].point} />
					</div>
				))}
			</div>
			{buttonElement && (
				<div className='ml-auto h-full'>
					<button
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await onClick?.();
							setLoading(false);
						}}
					>
						{buttonElement}
					</button>
				</div>
			)}
		</ListItem>
	);
};
