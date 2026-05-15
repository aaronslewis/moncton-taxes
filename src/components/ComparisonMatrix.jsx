import { Fragment, useState } from 'react';
import { formatShare } from '../lib/comparison.js';

const MONCTON_ID = 'moncton';

function MatrixCell({ entry, color, isMoncton }) {
  if (!entry || entry.share == null) {
    return <span className="matrix-cell-empty" aria-label="No data">—</span>;
  }
  const widthPct = Math.max(0, Math.min(100, entry.share * 100));
  return (
    <div className={`matrix-cell${isMoncton ? ' matrix-cell-moncton' : ''}`}>
      <div className="matrix-cell-bar" aria-hidden="true">
        <div
          className="matrix-cell-bar-fill"
          style={{ width: `${widthPct.toFixed(2)}%`, background: color }}
        />
      </div>
      <span className="matrix-cell-value tabular">{formatShare(entry.share)}</span>
    </div>
  );
}

function CityHeader({ city }) {
  const isMoncton = city.cityId === MONCTON_ID;
  return (
    <th scope="col" className={`matrix-city-header${isMoncton ? ' matrix-city-header-moncton' : ''}`}>
      <div className="matrix-city-name">{city.displayName}</div>
      <div className="matrix-city-meta tabular">
        {city.province || city.country} · FY{city.fiscalYear}
      </div>
    </th>
  );
}

function NativeDepartmentsList({ entry, currency }) {
  if (!entry || !entry.nativeDepartments || entry.nativeDepartments.length === 0) return null;
  return (
    <ul className="matrix-native-list">
      {entry.nativeDepartments.map((d, i) => (
        <li key={i}>
          <span className="matrix-native-name">{d.name}</span>
          {d.amount > 0 && (
            <span className="matrix-native-amount tabular">
              {currency === 'CAD' ? '$' : ''}{d.amount.toLocaleString('en-CA')}{currency && currency !== 'CAD' ? ` ${currency}` : ''}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function ComparisonMatrix({ cities, rows }) {
  const [expandedBucket, setExpandedBucket] = useState(null);

  return (
    <div className="comparison-matrix-wrap">
      <table className="comparison-matrix">
        <thead>
          <tr>
            <th scope="col" className="matrix-bucket-header">Category</th>
            {cities.map((c) => <CityHeader key={c.cityId} city={c} />)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = expandedBucket === row.taxonomyId;
            return (
              <Fragment key={row.taxonomyId}>
                <tr className={`matrix-row${isOpen ? ' matrix-row-open' : ''}`}>
                  <th scope="row" className="matrix-bucket-cell">
                    <button
                      type="button"
                      className="matrix-bucket-button"
                      onClick={() => setExpandedBucket(isOpen ? null : row.taxonomyId)}
                      aria-expanded={isOpen}
                      aria-controls={`bucket-detail-${row.taxonomyId}`}
                    >
                      <span
                        className="matrix-bucket-dot"
                        style={{ background: row.color }}
                        aria-hidden="true"
                      />
                      <span className="matrix-bucket-name">
                        {row.name}
                        {row.footnote && <span className="matrix-bucket-asterisk" aria-hidden="true">*</span>}
                      </span>
                      <svg className="matrix-bucket-chevron" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </th>
                  {cities.map((city) => (
                    <td key={city.cityId} className={`matrix-data-cell${city.cityId === MONCTON_ID ? ' matrix-data-cell-moncton' : ''}`}>
                      <MatrixCell
                        entry={row.byCity[city.cityId]}
                        color={row.color}
                        isMoncton={city.cityId === MONCTON_ID}
                      />
                    </td>
                  ))}
                </tr>
                {isOpen && (
                  <tr className="matrix-detail-row" id={`bucket-detail-${row.taxonomyId}`}>
                    <td colSpan={cities.length + 1} className="matrix-detail-cell">
                      <div className="matrix-detail-inner">
                        <p className="matrix-detail-description">{row.description}</p>
                        {row.footnote && (
                          <p className="matrix-detail-footnote">
                            <strong>* </strong>{row.footnote}
                          </p>
                        )}
                        <div className="matrix-detail-grid">
                          {cities.map((city) => (
                            <div key={city.cityId} className="matrix-detail-city">
                              <h4 className="matrix-detail-city-name">
                                {city.displayName}
                                <span className="matrix-detail-city-share tabular">
                                  {formatShare(row.byCity[city.cityId]?.share)}
                                </span>
                              </h4>
                              <NativeDepartmentsList
                                entry={row.byCity[city.cityId]}
                                currency={city.currency}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
