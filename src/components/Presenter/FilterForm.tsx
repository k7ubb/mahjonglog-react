import { useState } from 'react';
import { useHandleLog } from '../../usecase/useHandleLog';
import styles from './FilterForm.module.css';

export const FilterForm = () => {
	const { filter, setFilter } = useHandleLog();
	const [from, setFrom] = useState(filter.from || '');
	const [to, setTo] = useState(filter.to || '');

	return (
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
	);
};
