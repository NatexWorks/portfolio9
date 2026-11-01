"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const navigation = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Selected work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const menuOpen = openAtPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setOpenAtPath(null);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="wordmark" href="/">
            <span className="wordmark__mark" aria-hidden="true">N<span>×</span></span>
            <span className="wordmark__name">NatexWorks</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className="header-cta" href="/start-project">
            <span>Start a project</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setOpenAtPath(menuOpen ? null : pathname)}
          >
            <span />
            <span />
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={"mobile-nav" + (menuOpen ? " is-open" : "")}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
              onClick={() => setOpenAtPath(null)}
            >
              <span className="mobile-nav__number">0{index + 1}</span>
              <span>{item.label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link className="mobile-nav__project" href="/start-project" tabIndex={menuOpen ? 0 : -1} onClick={() => setOpenAtPath(null)}>
            <span className="mobile-nav__number">↗</span>
            <span>Start a project</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main id="main-content">{children}</main>

      <footer className="site-footer">
        <div className="site-footer__top">
          <div>
            <p className="eyebrow">A practical next step</p>
            <h2>Have a useful problem<br /><em>worth solving?</em></h2>
          </div>
          <Link className="round-link" href="/start-project" aria-label="Start a project enquiry">
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="site-footer__bottom">
          <Link className="wordmark wordmark--footer" href="/">
            <span className="wordmark__mark" aria-hidden="true">N<span>×</span></span>
            <span className="wordmark__name">NatexWorks</span>
          </Link>
          <p>Thoughtful websites. Useful digital tools.</p>
          <a href="mailto:natexworks@gmail.com">natexworks@gmail.com</a>
          <span className="footer-copyright">© {new Date().getFullYear()} NatexWorks</span>
        </div>
      </footer>
    </>
  );
}
