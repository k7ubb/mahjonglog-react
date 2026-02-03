import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AccountPage } from '@/components/Pages/AccountPage';
import { AnalysisGraphPage } from '@/components/Pages/AnalysisGraphPage';
import { AnalysisListPage } from '@/components/Pages/AnalysisListPage';
import { AnalysisMatrixPage } from '@/components/Pages/AnalysisMatrixPage';
import { ExportPage } from '@/components/Pages/ExportPage';
import { HomePage } from '@/components/Pages/HomePage';
import { IndexPage } from '@/components/Pages/IndexPage';
import { LogAddPage } from '@/components/Pages/LogAddPage';
import { LogAllPage } from '@/components/Pages/LogAllPage';
import { LogDailyPage } from '@/components/Pages/LogDailyPage';
import { LogDeletedPage } from '@/components/Pages/LogDeletedPage';
import { LoginPage } from '@/components/Pages/LoginPage';
import { LogPage } from '@/components/Pages/LogPage';
import { PlayerAddPage } from '@/components/Pages/PlayerAddPage';
import { PlayerGraphPage } from '@/components/Pages/PlayerGraphPage';
import { PlayerListPage } from '@/components/Pages/PlayerListPage';
import { PlayerLogPage } from '@/components/Pages/PlayerLogPage';
import { PlayerPage } from '@/components/Pages/PlayerPage';
import { RegisterPage } from '@/components/Pages/RegisterPage';
import { LogProvider } from '@/usecase/useHandleLog';
import { AuthProvider } from '@/usecase/useHandleUser';
import '@/index.css';

function App() {
	return (
		<AuthProvider>
			<LogProvider>
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
						<Route path="/app/player/add" element={<PlayerAddPage />} />
						<Route path="/app/player/:player" element={<PlayerPage />} />
						<Route
							path="/app/player/:player/logs"
							element={<PlayerLogPage />}
						/>
						<Route
							path="/app/player/:player/graph"
							element={<PlayerGraphPage />}
						/>
						<Route path="/app/analysis" element={<AnalysisListPage />} />
						<Route
							path="/app/analysis/graph/:players"
							element={<AnalysisGraphPage />}
						/>
						<Route
							path="/app/analysis/matrix/:players"
							element={<AnalysisMatrixPage />}
						/>
						<Route path="/app/export" element={<ExportPage />} />
					</Routes>
				</BrowserRouter>
			</LogProvider>
		</AuthProvider>
	);
}

export default App;
