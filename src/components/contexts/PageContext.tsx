import { createContext, useContext, useState } from 'react';
import { IndexPage } from '../Pages/IndexPage';
import { LoginPage } from '../Pages/LoginPage';
import { RegisterPage } from '../Pages/RegisterPage';
import { ConfigPage } from '../Pages/ConfigPage';
import { LogPage } from '../Pages/LogPage';
import { LogAddPage } from '../Pages/LogAddPage';
import { LogAllPage } from '../Pages/LogAllPage';
import { LogDailyPage } from '../Pages/LogDailyPage';
import { LogDeletedPage } from '../Pages/LogDeletedPage';
import { PlayerListPage } from '../Pages/PlayerListPage';
import { PlayerPage } from '../Pages/PlayerPage';
import { PlayerLogPage } from '../Pages/PlayerLogPage';
import { ExportPage } from '../Pages/ExportPage';

export const pageComponents = {
  index: { component: IndexPage, props: {} },
  login: { component: LoginPage, props: {} },
  register: { component: RegisterPage, props: {} },
  config: { component: ConfigPage, props: {} },
  log: { component: LogPage, props: {} },
  logAdd: { component: LogAddPage, props: {} },
  logAll: { component: LogAllPage, props: {} },
  logDaily: { component: LogDailyPage, props: {} as { date: string } },
  logDeleted: { component: LogDeletedPage, props: {} },
  playerList: { component: PlayerListPage, props: {} },
  player: { component: PlayerPage, props: {} as { player: string } },
  playerLog: { component: PlayerLogPage, props: {} as { player: string } },
  export: { component: ExportPage, props: {} },
} as const;

type PageKey = keyof typeof pageComponents;

type PageTypeMap = {
  [K in PageKey]: typeof pageComponents[K]['props'] extends Record<string, never>
    ? { type: K }
    : { type: K } & typeof pageComponents[K]['props'];
};

export type PageType = PageTypeMap[PageKey];

const PageContext = createContext<{
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
  canGoBack: boolean;
  goBack: () => void;
  history: PageType[];  
}>({
  currentPage: { type: 'index' },
  navigateTo: () => {},
  canGoBack: false,
  goBack: () => {},
  history: [{ type: 'index' }],
});

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<PageType>({ type: 'index' });
  const [history, setHistory] = useState<PageType[]>([{ type: 'index' }]);
  const [canGoBack, setCanGoBack] = useState(false);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setHistory(prev => [...prev, page]);
    setCanGoBack(true);
  };

  const goBack = () => {
    if (canGoBack) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
      setCanGoBack(newHistory.length > 1);
    }
  };

  return (
    <PageContext.Provider value={{ currentPage, history, canGoBack, navigateTo, goBack  }}>
      {children}
    </PageContext.Provider>
  );
}

export const useNavigation = () => useContext(PageContext);
