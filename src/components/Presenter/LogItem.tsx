import { useState } from 'react';
import { ColoredNumber } from '@/components/Presenter/ColoredNumber';
import { ListItem } from '@/components/Templates';
import { type Log } from '@/usecase/useHandleLog';
import { formatDate } from '@/utils/formatDate';

export const LogItem = ({
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
						<ColoredNumber point={log.score[i].point} />
					</div>
				))}
			</div>
			{buttonElement && (
				<div className='ml-auto h-full'>
					<button
						disabled={loading}
						onClick={() => {
							setLoading(true);
							void onClick?.()
								.then(() => setLoading(false));
						}}
					>
						{buttonElement}
					</button>
				</div>
			)}
		</ListItem>
	);
};
