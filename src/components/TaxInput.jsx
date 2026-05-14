import { useEffect, useState } from 'react';

const STORAGE_KEY = 'moncton-taxes:taxPaid';

export default function TaxInput({ value, onChange }) {
  const [raw, setRaw] = useState(value > 0 ? String(value) : '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && !value) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed > 0) {
        setRaw(stored);
        onChange(parsed);
      }
    }
  }, []);

  function handleChange(e) {
    const next = e.target.value.replace(/[^0-9.]/g, '');
    setRaw(next);
    const parsed = Number(next);
    const numeric = Number.isFinite(parsed) ? parsed : 0;
    onChange(numeric);
    if (typeof window !== 'undefined') {
      if (numeric > 0) {
        window.localStorage.setItem(STORAGE_KEY, String(numeric));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  return (
    <div className="tax-input-card">
      <label htmlFor="tax-amount" className="tax-input-label">
        Enter your annual City of Moncton property tax
      </label>
      <div className="tax-input-wrap">
        <span className="tax-input-prefix" aria-hidden="true">$</span>
        <input
          id="tax-amount"
          className="tax-input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="4,084"
          value={raw}
          onChange={handleChange}
          aria-label="Annual property tax paid, in Canadian dollars"
        />
      </div>
      <p className="tax-input-hint">
        Use the &ldquo;Total Tax&rdquo; line from your annual NB property-tax bill.{' '}
        Owner-occupied residential bills are 100% the municipal portion.{' '}
        Not sure?{' '}
        <a href="/methodology">See methodology</a>.
      </p>
    </div>
  );
}
