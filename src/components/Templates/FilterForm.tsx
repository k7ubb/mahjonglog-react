import { useState } from 'react';
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md';
import styles from './AppWindow.module.css';

export const FilterForm = ({
	filter,
	setFilter,
}: {
	filter: { from?: string; to?: string };
	setFilter: (filter: { from?: string; to?: string }) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [from, setFrom] = useState(filter.from ?? '');
	const [to, setTo] = useState(filter.to ?? '');

	return (
		<>
			<button onClick={() => setOpen(!open)}>
				{filter.from && filter.to ? (
					<MdFilterAlt className={styles.accent} />
				) : (
					<MdFilterAltOff />
				)}
			</button>
			{open && (
				<div className={styles.filterForm}>
					<form
						onSubmit={(e) => {
							setFilter({ from, to });
							e.preventDefault();
						}}
					>
						<input
							type="date"
							value={from}
							required
							onChange={(e) => setFrom(e.target.value)}
						/>{' '}
						から
						<input
							type="date"
							value={to}
							required
							onChange={(e) => setTo(e.target.value)}
						/>{' '}
						まで
						<br />
						<button type="submit">適用</button>
						<button
							type="button"
							onClick={() => {
								setFrom('');
								setTo('');
								setFilter({});
							}}
						>
							クリア
						</button>
					</form>
				</div>
			)}
		</>
	);
};
