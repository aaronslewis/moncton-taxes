export default function About() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>About</h1>
          <p>
            An independent civic project to help Moncton residents see where their
            property tax dollars actually go.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2>Why this exists</h2>
          <p>
            Most of us pay property tax once or twice a year, see the total, and have no
            idea what we got for it. The City of Moncton publishes a comprehensive
            budget document, but it's a 300-page PDF that almost nobody reads. This site
            takes that document and answers one question: <em>where did my money
            actually go?</em>
          </p>
          <p>
            It's modeled after{' '}
            <a href="https://wherethefuckdidmytaxesgo.com/" target="_blank" rel="noopener noreferrer">
              wherethefuckdidmytaxesgo.com
            </a>, which does the same thing for U.S. federal taxes.
          </p>

          <h2 className="mt-8">Who runs this</h2>
          <p>
            Moncton Taxes is a sibling project to{' '}
            <a href="https://monctonvotes.ca" target="_blank" rel="noopener noreferrer">
              Moncton Votes
            </a>, an independent civic resource for Moncton residents. Neither site is
            affiliated with the City of Moncton, any political party, or any campaign.
          </p>

          <h2 className="mt-8">What's next</h2>
          <p>
            <strong>Coming soon:</strong> enter your address and we'll look up your
            assessed value and estimated tax automatically &mdash; no need to dig out
            your bill. That phase is in planning.
          </p>

          <h2 className="mt-8">Get in touch</h2>
          <p>
            Found an error? Have a suggestion? Want to help? Reach out via the{' '}
            <a href="https://monctonvotes.ca" target="_blank" rel="noopener noreferrer">
              Moncton Votes contact page
            </a>{' '}
            and mention Moncton Taxes.
          </p>
        </div>
      </section>
    </>
  );
}
