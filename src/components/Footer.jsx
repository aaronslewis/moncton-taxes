import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div>
              <p className="footer-heading">Quick Links</p>
              <nav className="footer-links" aria-label="Footer navigation">
                <Link to="/">Home</Link>
                <Link to="/methodology">Methodology</Link>
                <Link to="/about">About</Link>
                <a href="https://monctonvotes.ca" target="_blank" rel="noopener noreferrer">
                  Moncton Votes &rarr;
                </a>
              </nav>
            </div>

            <div>
              <p className="footer-heading">About This Site</p>
              <p className="footer-text">
                Moncton Taxes is an independent civic project that breaks down where the City of
                Moncton's annual operating budget goes. Enter your property tax bill, see your
                personal contribution to each spending category.
              </p>
            </div>

            <div>
              <p className="footer-heading">Source</p>
              <p className="footer-text">
                Figures are transcribed from the City of Moncton's published budget documents.
                See the{' '}
                <Link to="/methodology" style={{ color: '#93c5fd' }}>Methodology</Link>
                {' '}page for sources, caveats, and the data freshness date.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              &copy; {currentYear} Moncton Taxes &mdash; A civic transparency project.
            </p>
            <p className="footer-disclaimer">
              This site is independently produced and is not affiliated with the City of Moncton.
              Figures are best-effort transcriptions of published budget documents and may contain
              errors. Always verify with the original City of Moncton sources.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
