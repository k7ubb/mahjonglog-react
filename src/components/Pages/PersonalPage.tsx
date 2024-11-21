import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandlePlayer } from '../../usecase/useHandlePlayer';
import { useHandlePersonalScore } from '../../usecase/useHandlePersonalScore';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import style from './personalPage.module.css';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

export const PersonalPage: React.FC = () => {
	const navigate = useNavigate();
	const { player } = useParams<{ player: string }>();
	const { deletePlayer } = useHandlePlayer();
	const { personalScore, loading: personalScoreLoading } =
		useHandlePersonalScore(player || '');
	const [loading, setLoading] = useState(false);

	return (
		<AppWindow
			title={player!}
			backTo="/app/player"
			authOnly={true}
			loading={personalScoreLoading || loading}
		>
			{personalScore && (
				<>
					<ListGroup>
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
					</ListGroup>
					<ListGroup>
						<ListItem
							linkTo={`/app/player/${player}/log`}
						>{`${player}の対局記録を表示`}</ListItem>
					</ListGroup>
					<div style={{ height: '64px' }} />
					<ListGroup>
						<ListItem
							disabled={loading}
							onClick={async () => {
								if (personalScore.count !== 0) {
									alert('対局記録があるプレイヤーは削除できません');
								} else if (confirm(`'${player}' を削除してもよろしいですか?`)) {
									setLoading(true);
									await deletePlayer(player!);
									navigate('/app/player');
									setLoading(false);
								}
							}}
						>
							プレイヤーを削除
						</ListItem>
					</ListGroup>
				</>
			)}
		</AppWindow>
	);
};
