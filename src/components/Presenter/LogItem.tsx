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
				<ol className='list-decimal'>
					{new Array(4).fill(null).map((_, i) => (
						<li key={i} className='ml-4'>
							<div className='flex mb-1'>
								<span className='block w-40'>{log.score[i].player}</span>
								<span className='block w-20 text-right'>
									<ColoredNumber point={log.score[i].point} />
								</span>
							</div>
						</li>
					))}
				</ol>
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
