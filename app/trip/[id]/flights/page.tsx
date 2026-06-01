// Flights — static boarding-pass cards, same as v3.1
export default function FlightsPage() {
  return (
    <section>
      <div className="section-title">My flights · EL AL</div>

      {/* Outbound */}
      <div className="flight-card">
        <div className="flight-header">
          <div>
            <div className="flight-route">Tel Aviv → Frankfurt</div>
            <div className="flight-date">Mon 6 Jul · LY357</div>
          </div>
          <div className="flight-airline-pill">Outbound</div>
        </div>

        <div className="flight-route-vis">
          <div className="flight-airport">
            <div className="airport-code">TLV</div>
            <div className="airport-time">06:05</div>
            <div className="airport-city">Tel Aviv</div>
          </div>
          <div className="flight-arc">
            <svg width="70" height="40" viewBox="0 0 70 40" aria-hidden="true">
              <path d="M 5 32 Q 35 -6 65 32" stroke="#4A6B3A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
              <g transform="translate(35 10)">
                <path d="M -8 0 L 8 0 M 4 -3 L 8 0 L 4 3" stroke="#4A6B3A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <div className="flight-arc-duration">4h 35m</div>
          </div>
          <div className="flight-airport">
            <div className="airport-code">FRA</div>
            <div className="airport-time">09:40</div>
            <div className="airport-city">Frankfurt</div>
          </div>
        </div>

        <div className="flight-details">
          <div className="flight-detail-block">
            <div className="flight-detail-icon"><i className="ti ti-hash" /></div>
            <div className="flight-detail-info">
              <div className="flight-detail-label">Confirmation</div>
              <div className="flight-detail-value">YRNFPK</div>
            </div>
          </div>
          <div className="flight-detail-block">
            <div className="flight-detail-icon"><i className="ti ti-plane-departure" /></div>
            <div className="flight-detail-info">
              <div className="flight-detail-label">Airline</div>
              <div className="flight-detail-value">EL AL · LY357</div>
            </div>
          </div>
        </div>

        <a
          className="flight-manage-btn"
          href="https://www.elal.com/en/PassengersInfo/managebooking/Pages/default.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ti ti-settings" />
          Manage booking
        </a>
      </div>

      {/* Return */}
      <div className="flight-card">
        <div className="flight-header">
          <div>
            <div className="flight-route">Frankfurt → Tel Aviv</div>
            <div className="flight-date">Mon 13 Jul · LY358</div>
          </div>
          <div className="flight-airline-pill" style={{ background: 'var(--peach)', color: 'var(--peach-ink)' }}>
            Return
          </div>
        </div>

        <div className="flight-route-vis">
          <div className="flight-airport">
            <div className="airport-code">FRA</div>
            <div className="airport-time">10:55</div>
            <div className="airport-city">Frankfurt</div>
          </div>
          <div className="flight-arc">
            <svg width="70" height="40" viewBox="0 0 70 40" aria-hidden="true">
              <path d="M 5 32 Q 35 -6 65 32" stroke="#4A6B3A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
              <g transform="translate(35 10)">
                <path d="M -8 0 L 8 0 M 4 -3 L 8 0 L 4 3" stroke="#4A6B3A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <div className="flight-arc-duration">4h 5m</div>
          </div>
          <div className="flight-airport">
            <div className="airport-code">TLV</div>
            <div className="airport-time">16:00</div>
            <div className="airport-city">Tel Aviv</div>
          </div>
        </div>

        <div className="flight-details">
          <div className="flight-detail-block">
            <div className="flight-detail-icon"><i className="ti ti-hash" /></div>
            <div className="flight-detail-info">
              <div className="flight-detail-label">Confirmation</div>
              <div className="flight-detail-value">YRNFPK</div>
            </div>
          </div>
          <div className="flight-detail-block">
            <div className="flight-detail-icon"><i className="ti ti-plane-arrival" /></div>
            <div className="flight-detail-info">
              <div className="flight-detail-label">Airline</div>
              <div className="flight-detail-value">EL AL · LY358</div>
            </div>
          </div>
        </div>

        <a
          className="flight-manage-btn"
          href="https://www.elal.com/en/PassengersInfo/managebooking/Pages/default.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ti ti-settings" />
          Manage booking
        </a>
      </div>

      <div className="tip-card" style={{ background: 'var(--sky)', color: 'var(--sky-ink)' }}>
        <i className="ti ti-info-circle" />
        <span>
          Confirmation code <strong>YRNFPK</strong> works for both flights.
          Online check-in opens 24h before departure on the EL AL app.
        </span>
      </div>
    </section>
  );
}
