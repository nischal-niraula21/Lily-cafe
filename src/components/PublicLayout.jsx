import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function PublicLayout() {
  const location = useLocation();
  const forceDark = location.pathname === '/menu';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    const observeReveals = () => {
      document
        .querySelectorAll('.reveal:not([data-reveal-observed])')
        .forEach((element) => {
          element.dataset.revealObserved = 'true';
          observer.observe(element);
        });
    };

    observeReveals();

    const mutationObserver = new MutationObserver(observeReveals);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      document
        .querySelectorAll('[data-reveal-observed]')
        .forEach((element) => delete element.dataset.revealObserved);
    };
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('dark-page', forceDark);
    return () => document.body.classList.remove('dark-page');
  }, [forceDark]);

  return (
    <>
      <Header forceDark={forceDark} />
      <Outlet />
      <Footer />
    </>
  );
}
