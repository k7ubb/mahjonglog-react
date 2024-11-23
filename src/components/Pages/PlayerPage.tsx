import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandlePlayer } from '../../usecase/useHandlePlayer';
import { useHandlePersonalScore } from '../../usecase/useHandlePersonalScore';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

const PointView = ({ point }: { point: number }) => {
	const color = point > 0 ? '#00f' : point < 0 ? '#f00' : '#000';
	return <span style={{ color }}>{point}</span>;
};

const ScoreRow = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<ListItem>
			<div style={{ display: 'flex' }}>
				<div style={{ width: '200px' }}>{title}</div>
				{children}
			</div>
		</ListItem>
	);
};

export const PlayerPage: React.FC = () => {
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
						<ScoreRow title="1位">{personalScore.rank[0]}</ScoreRow>
						<ScoreRow title="2位">{personalScore.rank[1]}</ScoreRow>
						<ScoreRow title="3位">{personalScore.rank[2]}</ScoreRow>
						<ScoreRow title="4位">{personalScore.rank[3]}</ScoreRow>
						<ScoreRow title="試合数">{personalScore.count}</ScoreRow>
						<ScoreRow title="平均順位">{personalScore.average_rank}</ScoreRow>
						<ScoreRow title="累計得点">
							<PointView point={personalScore.score} />
						</ScoreRow>
						<ScoreRow title="平均得点">
							<PointView point={personalScore.average_score} />
						</ScoreRow>
					</ListGroup>
					<ListGroup>
						<ListItem
							linkTo={`/app/player/${player}/logs`}
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
