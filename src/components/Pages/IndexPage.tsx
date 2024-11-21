import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './IndexPage.module.css';

export const IndexPage: React.FC = () => {
	const [pwaOption, setPwaOption] = useState<string | undefined>(undefined);

	useEffect(() => {
		if ('ontouchstart' in window) {
			if (navigator.userAgent.includes('Android')) {
				setPwaOption('Android');
			} else {
				setPwaOption('iPhone');
			}
		} else {
			setPwaOption('');
		}
	}, []);

	return (
		<div className={style.indexPage}>
			<header>
				<Link to="/" className={style.sitename}>
					<img src="/icon.png" alt="sitelogo" />
					麻雀戦績共有アプリ
				</Link>
			</header>
			<div className={style.header_buttom}>
				<p>
					<span style={{ background: '#ddd' }}>
						麻雀の対局記録をオンラインで管理できるWebアプリです。
						<br />
						ID・パスワードを知っている仲間内でデータを共有できます。
					</span>
				</p>
				{pwaOption === '' && (
					<Link to="/app" className={style.download_button}>
						<i className="fa-solid fa-arrow-up-right-from-square" />
						アプリを開く
					</Link>
				)}
			</div>
			<main>
				{pwaOption !== '' && (
					<>
						<h2>使用方法</h2>
						<div className={style.pwa_recommend}>
							{pwaOption === 'iPhone' && (
								<ol>
									<li>Safariで開く</li>
									<li>
										メニューバーの{' '}
										<span>
											<i className="fa-solid fa-arrow-up-from-bracket" />
										</span>{' '}
										をタップ
									</li>
									<li>
										<span>
											ホーム画面に追加{' '}
											<i className="fa-regular fa-square-plus" />
										</span>{' '}
										を選択
									</li>
								</ol>
							)}
							{pwaOption === 'Android' && (
								<ol>
									<li>Chromeで開く</li>
									<li>
										アドレスバーの{' '}
										<span>
											<i className="fa-solid fa-ellipsis-vertical" />
										</span>{' '}
										をタップ
									</li>
									<li>
										<span>ホーム画面に追加</span> を選択
									</li>
								</ol>
							)}
						</div>
						<p style={{ margin: '-8px 0 0 20px' }}>
							または{' '}
							<Link to="/app">
								<i className="fa-solid fa-arrow-up-right-from-square" />
								この画面で開く
							</Link>
						</p>
					</>
				)}
				<h2>本アプリについて</h2>
				<p>
					リポジトリ:{' '}
					<a href="https://github.com/k7ubb/mahjonglog-react" target="_blank">
						https://github.com/k7ubb/mahjonglog-react
					</a>
				</p>
				<h2>更新履歴</h2>
				<p>
					2024-11-21 UX改善 (ローディング表示)・ログ削除機能を追加
					<br />
					2023-10-18 Node.js, Firebaseを導入・アカウント作成機能追加
					<br />
					2023-08-20 React (Node.jsなし) を導入
					<br />
					2019-11-23 canvas → DOMに変更
					<br />
					2019-07-16 ライブラリを更新
					<br />
					2019-05-25 ログ表示を日付別に変更
					<br />
					2019-04-15 URLを変更
					<br />
					2018-10-31 作成
				</p>
			</main>
			<footer>
				© 2023{' '}
				<a href="https://bb.xrea.jp/" target="_blank" className={style.icon}>
					bb.xrea.jp
				</a>
			</footer>
		</div>
	);
};
