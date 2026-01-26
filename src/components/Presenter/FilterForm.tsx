import { useState } from 'react';
import { useHandleLog } from '../../usecase/useHandleLog';

const dateInputClass = 'px-4 py-2 border border-stone-400 rounded-xl bg-white';
const buttonClass = 'mx-2 px-4 py-2 border border-stone-400 rounded-xl hover:bg-stone-300';

export const FilterForm = () => {
	const { filter, setFilter, setFilterDialogOpen } = useHandleLog();
	const [from, setFrom] = useState(filter.from || '');
	const [to, setTo] = useState(filter.to || '');

	return (
		<form
			className='absolute top-14 left-1/2 -translate-x-1/2 w-full max-w-100 rounded-2xl p-4
								 shadow-md bg-black/20 backdrop-blur-sm'
			onSubmit={(e) => {
				setFilter({ from, to });
				setFilterDialogOpen(false);
				e.preventDefault();
			}}
		>
			<div className='flex gap-4 items-center justify-center mb-4'>
				<input
					type="date"
					value={from}
					required
					onChange={(e) => setFrom(e.target.value)}
					className={dateInputClass}
				/>
				-
				<input
					type="date"
					value={to}
					required
					onChange={(e) => setTo(e.target.value)}
					className={dateInputClass}
				/>
			</div>
			<div className='flex justify-center'>
				<button type="submit" className={buttonClass}>適用</button>
				<button
					type="button"
					onClick={() => {
						setFrom('');
						setTo('');
						setFilter({});
					}}
					className={buttonClass}
				>
					クリア
				</button>
			</div>
		</form>
	);
};
