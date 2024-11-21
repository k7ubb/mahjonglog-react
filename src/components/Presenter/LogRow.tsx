import { useState } from 'react';
import { ListItem } from '../Templates/AppWindow';
import { Log } from '../../usecase/useHandleLog';
import style from './LogRow.module.css';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

export const LogRow = ({
	log,
	buttonElement,
	onClick,
}: {
	log: Log;
	buttonElement?: JSX.Element;
	onClick?: () => Promise<void>;
}) => {
	const [loading, setLoading] = useState(false);

	return (
		<ListItem>
			<div className={style.log}>
				1: {log.score[0].player} <PointView point={log.score[0].point} />
				<br />
				2: {log.score[1].player} <PointView point={log.score[1].point} />
				<br />
				3: {log.score[2].player} <PointView point={log.score[2].point} />
				<br />
				4: {log.score[3].player} <PointView point={log.score[3].point} />
			</div>
			{buttonElement && (
				<button
					className={style.deleteButton}
					disabled={loading}
					onClick={async () => {
						setLoading(true);
						await onClick?.();
						setLoading(false);
					}}
				>
					{buttonElement}
				</button>
			)}
		</ListItem>
	);
};
