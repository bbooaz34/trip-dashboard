// Flights — boarding-pass cards (iOS 26)
export default function FlightsPage() {
  return (
    <>
      <div className="large-title">
        <h1>Flights</h1>
        <div className="lt-sub">EL AL · 2 travellers + kids</div>
      </div>

      <div style={{ marginTop: 8 }}>
        {/* Outbound */}
        <div className="pass">
          <div className="pass-top">
            <div className="pass-head">
              <span className="pass-airline">EL AL · LY357</span>
              <span className="pass-dir">Outbound</span>
            </div>
            <div className="pass-route">
              <div>
                <div className="pass-iata">TLV</div>
                <div className="pass-city">Tel Aviv</div>
                <div className="pass-time">09:30</div>
              </div>
              <div className="pass-arc">
                <div className="pass-arc-line">
                  <span className="dot" /><span className="dash" />
                </div>
                <i className="ti ti-plane" />
                <div className="pass-arc-line">
                  <span className="dash" /><span className="dot" />
                </div>
                <div className="pass-arc-dur tnum">4h 35m</div>
              </div>
              <div className="pass-col-r">
                <div className="pass-iata">FRA</div>
                <div className="pass-city">Frankfurt</div>
                <div className="pass-time">13:05</div>
              </div>
            </div>
          </div>

          <div className="pass-tear"><div className="tear-line" /></div>

          <div className="pass-meta">
            <div>
              <div className="pm-label">Date</div>
              <div className="pm-value">Mon 6 Jul</div>
            </div>
            <div>
              <div className="pm-label">Confirmation</div>
              <div className="pm-value">YRNFPK</div>
            </div>
          </div>
          <div className="pass-cta">
            <a
              className="btn btn-tinted btn-sm"
              href="https://www.elal.com/en/PassengersInfo/managebooking/Pages/default.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage booking
            </a>
          </div>
        </div>

        {/* Return */}
        <div className="pass">
          <div className="pass-top">
            <div className="pass-head">
              <span className="pass-airline">EL AL · LY358</span>
              <span className="pass-dir">Return</span>
            </div>
            <div className="pass-route">
              <div>
                <div className="pass-iata">FRA</div>
                <div className="pass-city">Frankfurt</div>
                <div className="pass-time">14:40</div>
              </div>
              <div className="pass-arc">
                <div className="pass-arc-line">
                  <span className="dot" /><span className="dash" />
                </div>
                <i className="ti ti-plane" />
                <div className="pass-arc-line">
                  <span className="dash" /><span className="dot" />
                </div>
                <div className="pass-arc-dur tnum">4h 50m</div>
              </div>
              <div className="pass-col-r">
                <div className="pass-iata">TLV</div>
                <div className="pass-city">Tel Aviv</div>
                <div className="pass-time">19:30</div>
              </div>
            </div>
          </div>

          <div className="pass-tear"><div className="tear-line" /></div>

          <div className="pass-meta">
            <div>
              <div className="pm-label">Date</div>
              <div className="pm-value">Mon 13 Jul</div>
            </div>
            <div>
              <div className="pm-label">Confirmation</div>
              <div className="pm-value">YRNFPK</div>
            </div>
          </div>
          <div className="pass-cta">
            <a
              className="btn btn-tinted btn-sm"
              href="https://www.elal.com/en/PassengersInfo/managebooking/Pages/default.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage booking
            </a>
          </div>
        </div>
      </div>

      <div className="group-footer">
        Confirmation code <strong>YRNFPK</strong> covers both legs.
        Online check-in opens 48 h before departure on elal.com — do it the night before to pick your seats.
      </div>
    </>
  );
}
