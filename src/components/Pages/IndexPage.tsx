import { Link } from 'react-router-dom';
import '../Presenter/IndexPage.css';

export const IndexPage: React.FC = () => {
	return (
		<>
			<header>
				<Link to="/" className="sitename">
					<img src="/icon.png" alt="sitelogo" />
					麻雀戦績共有アプリ
				</Link>
			</header>
			<main>
				<p>
					<Link to="/app" className="download_button">
						<i className="fa-solid fa-map"></i>アプリを開く
					</Link>
				</p>
			</main>
			<footer>
				© 2023 <a href="https://bb.xrea.jp/">bb.xrea.jp</a>
			</footer>
		</>
	);
};
