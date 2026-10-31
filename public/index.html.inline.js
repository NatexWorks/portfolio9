(function () {
      const nextButton = document.getElementById('portfolioScrollNext');
      const nextLabel = nextButton.querySelector('span');
      const nextArrow = nextButton.querySelector('b');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const getSections = () => Array.from(document.querySelectorAll('main > section, main > .feature-band'))
        .filter(section => section.getBoundingClientRect().height > 0);

      let cachedPageHeight = 0;
      // ResizeObserver supplies the body's already-calculated content height without a synchronous layout read.
      if ('ResizeObserver' in window) {
        const pageSizeObserver = new ResizeObserver(entries => {
          const contentHeight = entries[0]?.contentRect?.height || window.innerHeight;
          cachedPageHeight = Math.max(contentHeight, window.innerHeight);
          syncNavigationButton();
        });
        pageSizeObserver.observe(document.body);
      } else {
        // Older-browser fallback: one measurement after load and on viewport changes, never per scroll.
        const measurePageHeight = () => {
          cachedPageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          syncNavigationButton();
        };
        window.addEventListener('resize', measurePageHeight, { passive: true });
        window.addEventListener('load', measurePageHeight, { once: true });
      }

      const isAtPageEnd = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        return scrollY + window.innerHeight >= cachedPageHeight - 36;
      };
      let previousBackMode = null;
      const syncNavigationButton = () => {
        if (!cachedPageHeight) return;
        const backMode = isAtPageEnd();
        if (backMode === previousBackMode) return;
        previousBackMode = backMode;
        nextButton.classList.toggle('is-back-top', backMode);
        nextLabel.textContent = backMode ? 'BACK TO TOP' : 'NEXT SECTION';
        nextArrow.textContent = backMode ? '↑' : '↓';
        nextButton.setAttribute('aria-label', backMode ? 'Back to top' : 'Scroll to next section');
        nextButton.setAttribute('title', backMode ? 'Back to top' : 'Scroll to next section');
      };

      nextButton.addEventListener('click', function () {
        if (isAtPageEnd()) {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
          return;
        }
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const threshold = scrollY + Math.max(110, window.innerHeight * .16);
        const next = getSections().find(section => section.getBoundingClientRect().top + scrollY > threshold);
        if (next) {
          next.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: cachedPageHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });
      window.addEventListener('scroll', syncNavigationButton, { passive: true });
      window.addEventListener('resize', syncNavigationButton, { passive: true });
      syncNavigationButton();

      // Two-panel horizontal showcase: native touch scrolling plus explicit project arrows.
      const track = document.getElementById('heroProjectTrack');
      if (track) {
        const slides = Array.from(track.querySelectorAll('.hero-project-slide'));
        const projectButtons = Array.from(track.querySelectorAll('[data-project-target]'));
        projectButtons.forEach(button => {
          button.addEventListener('click', () => {
            const targetIndex = Number(button.dataset.projectTarget);
            const target = slides[targetIndex];
            if (target) track.scrollTo({ left: slideOffsets[targetIndex] || targetIndex * trackWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
          });
        });
        // Keep the active project slide announced without reading layout/scroll geometry on every swipe.
        if ('IntersectionObserver' in window) {
          const slideObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
              slides.forEach(slide => slide.setAttribute('aria-current', slide === entry.target ? 'true' : 'false'));
            });
          }, { root: track, threshold: [0.55, 0.8] });
          slides.forEach(slide => slideObserver.observe(slide));
        }
      }
    })();