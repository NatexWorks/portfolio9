(function () {
      const button = document.getElementById('servicesScrollNext');
      if (!button) return;
      const label = button.querySelector('span');
      const arrow = button.querySelector('b');
      const sections = Array.from(document.querySelectorAll('main > section'))
        .filter(section => section.getBoundingClientRect().height > 0);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const isAtPageEnd = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        return scrollY + window.innerHeight >= pageHeight - 36;
      };

      const syncButton = () => {
        const backMode = isAtPageEnd();
        button.classList.toggle('is-back-top', backMode);
        label.textContent = backMode ? 'BACK TO TOP' : 'NEXT SECTION';
        arrow.textContent = backMode ? '↑' : '↓';
        button.setAttribute('aria-label', backMode ? 'Back to top' : 'Scroll to next section');
        button.title = backMode ? 'Back to top' : 'Scroll to next section';
      };

      button.addEventListener('click', () => {
        if (isAtPageEnd()) {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
          return;
        }
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const threshold = scrollY + Math.max(110, window.innerHeight * .16);
        const next = sections.find(section => section.getBoundingClientRect().top + scrollY > threshold);
        if (next) next.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        else {
          const pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          window.scrollTo({ top: pageHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });

      window.addEventListener('scroll', syncButton, { passive: true });
      window.addEventListener('resize', syncButton);
      syncButton();
    })();

    /* Motion enhancements run on desktop/tablet only; reduced-motion users see static content. */
    (function () {
      const desktopOrTablet = window.matchMedia('(min-width: 761px)');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const targets = document.querySelectorAll('[data-services-motion]');
      if (!desktopOrTablet.matches || reducedMotion || !('IntersectionObserver' in window) || !targets.length) return;
      document.documentElement.classList.add('services-motion-on');
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in-view');
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
      targets.forEach((target) => observer.observe(target));
    })();