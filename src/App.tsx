import '@/env';
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { AccountPage } from '@/components/Pages/AccountPage';
import { AnalysisGraphPage } from '@/components/Pages/AnalysisGraphPage';
import { AnalysisMatrixPage } from '@/components/Pages/AnalysisMatrixPage';
import { AnalysisPage } from '@/components/Pages/AnalysisPage';
import { ExportPage } from '@/components/Pages/ExportPage';
import { HomePage } from '@/components/Pages/HomePage';
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
import { AppDataProvider } from '@/contexts/useAppData';
import { LoadingProvider } from '@/contexts/useLoading';
import { UserProvider, useUserData } from '@/contexts/useUserData';
import '@/index.css';

const basename = import.meta.env.VITE_BASE_PATH;

const AuthGuard = () => {
	const { status } = useUserData();
	return status === 'login' ? <Outlet /> : <Navigate to='/' />;
};

function App() {
	return (
		<LoadingProvider>
			<UserProvider>
				<AppDataProvider>
					<BrowserRouter
						future={{
							v7_startTransition: true,
							v7_relativeSplatPath: true,
						}}
						basename={basename}
					>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/register' element={<RegisterPage />} />
							<Route element={<AuthGuard />}>
								<Route path='/account' element={<AccountPage />} />
								<Route path='/log' element={<LogPage />} />
								<Route path='/log/add' element={<LogAddPage />} />
								<Route path='/log/all' element={<LogAllPage />} />
								<Route path='/log/:date' element={<LogDailyPage />} />
								<Route path='/log/deleted' element={<LogDeletedPage />} />
								<Route path='/player' element={<PlayerListPage />} />
								<Route path='/player/add' element={<PlayerAddPage />} />
								<Route path='/player/:id' element={<PlayerPage />} />
								<Route
									path='/player/:id/logs'
									element={<PlayerLogPage />}
								/>
								<Route
									path='/player/:id/graph'
									element={<PlayerGraphPage />}
								/>
								<Route path='/analysis' element={<AnalysisPage />} />
								<Route
									path='/analysis/graph/:ids'
									element={<AnalysisGraphPage />}
								/>
								<Route
									path='/analysis/matrix/:ids'
									element={<AnalysisMatrixPage />}
								/>
								<Route path='/export' element={<ExportPage />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</AppDataProvider>
			</UserProvider>
		</LoadingProvider>
	);
}

export default App;
