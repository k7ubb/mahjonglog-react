import { Link } from 'react-router-dom';
import style from './IndexPage.module.css';

export const IndexPage: React.FC = () => {
	return (
		<div className={style.indexPage}>
			<header>
				<Link to="/" className={style.sitename}>
					<img src="/icon.png" alt="sitelogo" />
					麻雀戦績共有アプリ
				</Link>
			</header>
			<main>
				<p>
					<Link to="/app" className={style.download_button}>
						<i className="fa-solid fa-map"></i>アプリを開く
					</Link>
				</p>
			</main>
			<footer>
				© 2023 <a href="https://bb.xrea.jp/">bb.xrea.jp</a>
			</footer>
		</div>
	);
};
