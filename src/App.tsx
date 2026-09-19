import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { About } from './components/About';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { Archive } from './components/Archive';
import { Honors } from './components/Honors';
import { Footer } from './components/Footer';
import { CreditsModal } from './components/CreditsModal';
import { LoginModal } from './components/LoginModal';
import { StudyDashboard } from './components/study/StudyDashboard';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

export const App: React.FC = () => {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rituraj_study_authenticated') === 'true';
  });
  const [currentView, setCurrentView] = useState<'portfolio' | 'study'>('portfolio');

  // Check Supabase session on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setIsAuthenticated(true);
          sessionStorage.setItem('rituraj_study_authenticated', 'true');
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          sessionStorage.setItem('rituraj_study_authenticated', 'true');
        } else {
          setIsAuthenticated(false);
          sessionStorage.removeItem('rituraj_study_authenticated');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis smooth kinetic scroll only for portfolio view
    if (currentView === 'portfolio') {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false
      });

      let animationFrameId: number;

      function raf(time: number) {
        lenis.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      }

      animationFrameId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(animationFrameId);
        lenis.destroy();
      };
    }
  }, [currentView]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setCurrentView('study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('rituraj_study_authenticated');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentView('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Preloader />
      <CustomCursor />
      <Navbar
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isAuthenticated={isAuthenticated}
        onToggleStudyTools={() => {
          setCurrentView(currentView === 'study' ? 'portfolio' : 'study');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isStudyView={currentView === 'study'}
      />

      {currentView === 'portfolio' ? (
        <>
          <main>
            <Hero />
            <Ticker />
            <About />
            <Education />
            <Projects />
            <Archive />
            <Honors />
          </main>
          <Footer onOpenCredits={() => setIsCreditsOpen(true)} />
        </>
      ) : (
        <main className="study-main-wrapper">
          <StudyDashboard
            onBackToPortfolio={() => {
              setCurrentView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleLogout}
          />
        </main>
      )}

      {/* Modals */}
      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
