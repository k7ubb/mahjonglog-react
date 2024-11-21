import { useParams } from 'react-router-dom';
import { useHandlePersonalScore } from '../../usecase/useHandlePersonalScore';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import style from './PersonalScorePage.module.css';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

export const PersonalScorePage: React.FC = () => {
	const { player } = useParams<{ player: string }>();
	const { personalScore, loading } = useHandlePersonalScore(player || '');

	return (
		<AppWindow
			title={player!}
			backTo="/app/player"
			authOnly={true}
			loading={loading}
		>
			<ListGroup>
				{personalScore && (
					<div className={style.personal}>
						<ListItem>
							1位<span>{personalScore.rank[0]}</span>
						</ListItem>
						<ListItem>
							2位<span>{personalScore.rank[1]}</span>
						</ListItem>
						<ListItem>
							3位<span>{personalScore.rank[2]}</span>
						</ListItem>
						<ListItem>
							4位<span>{personalScore.rank[3]}</span>
						</ListItem>
						<ListItem>
							試合数<span>{personalScore.count}</span>
						</ListItem>
						<ListItem>
							平均順位<span>{personalScore.average_rank}</span>
						</ListItem>
						<ListItem>
							累計得点
							<PointView point={personalScore.score} />
						</ListItem>
						<ListItem>
							平均得点
							<PointView point={personalScore.average_score} />
						</ListItem>
					</div>
				)}
			</ListGroup>
		</AppWindow>
	);
};
