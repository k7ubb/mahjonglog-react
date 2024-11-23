import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IndexPage } from './components/Pages/IndexPage';
import { HomePage } from './components/Pages/HomePage';
import { LoginPage } from './components/Pages/LoginPage';
import { RegisterPage } from './components/Pages/RegisterPage';
import { AccountPage } from './components/Pages/AccountPage';
import { LogPage } from './components/Pages/LogPage';
import { LogAddPage } from './components/Pages/LogAddPage';
import { LogAllPage } from './components/Pages/LogAllPage';
import { LogDailyPage } from './components/Pages/LogDailyPage';
import { LogDeletedPage } from './components/Pages/LogDeletedPage';
import { PlayerListPage } from './components/Pages/PlayerListPage';
import { PlayerPage } from './components/Pages/PlayerPage';
import { PlayerLogPage } from './components/Pages/PlayerLogPage';
import { AuthProvider } from './usecase/useHandleUser';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/app" element={<HomePage />} />
					<Route path="/app/login" element={<LoginPage />} />
					<Route path="/app/register" element={<RegisterPage />} />
					<Route path="/app/account" element={<AccountPage />} />
					<Route path="/app/log" element={<LogPage />} />
					<Route path="/app/log/add" element={<LogAddPage />} />
					<Route path="/app/log/all" element={<LogAllPage />} />
					<Route path="/app/log/:date" element={<LogDailyPage />} />
					<Route path="/app/log/deleted" element={<LogDeletedPage />} />
					<Route path="/app/player" element={<PlayerListPage />} />
					<Route path="/app/player/:player" element={<PlayerPage />} />
					<Route path="/app/player/:player/logs" element={<PlayerLogPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
