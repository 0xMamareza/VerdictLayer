import { genLayerLinks } from "./AboutGenLayerMenu";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <strong>VerdictLayer</strong>
          <p>Built on GenLayer Studionet</p>
        </div>
        <nav className="footer-links" aria-label="GenLayer links">
          {genLayerLinks.map((link) => (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label}, opens in a new tab`}
              key={link.href}
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
