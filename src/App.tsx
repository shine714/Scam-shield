import { useEffect, useState } from 'react';
import type { Language, PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { MessageScannerPage } from './pages/MessageScannerPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { ScamAwarenessSection } from './components/ScamAwarenessSection';
import { AboutPage } from './pages/AboutPage';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'message-scanner',
  'url-scanner',
  'awareness',
  'about',
];

function getInitialRoute(): PageRoute {
  const hash = window.location.hash.replace('#', '') as PageRoute;
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

function getInitialLang(): Language {
  try {
    const saved = window.localStorage.getItem('scamshield-lang');
    return saved === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialRoute);
  const [lang, setLang] = useState<Language>(getInitialLang);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getInitialRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem('scamshield-lang', lang);
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [lang]);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#040914] text-slate-100 cyber-grid">
      <div className="pointer-events-none fixed inset-0 cyber-radial" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          lang={lang}
          onToggleLang={setLang}
        />

        <main className="flex-1">
          <div key={currentPage} className="animate-fade-in-up">
            {currentPage === 'home' && (
              <LandingPage lang={lang} onNavigate={navigateTo} />
            )}
            {currentPage === 'message-scanner' && (
              <MessageScannerPage lang={lang} />
            )}
            {currentPage === 'url-scanner' && <UrlScannerPage lang={lang} />}
            {currentPage === 'awareness' && (
              <div className="pt-4">
                <ScamAwarenessSection lang={lang} />
              </div>
            )}
            {currentPage === 'about' && (
              <AboutPage lang={lang} onNavigate={navigateTo} />
            )}
          </div>
        </main>

        <Footer lang={lang} onNavigate={navigateTo} />
      </div>
    </div>
  );
}

export default App;
