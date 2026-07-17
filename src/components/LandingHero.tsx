function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

export function LandingHero() {
  return (
    <section className="landing-hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="section-eyebrow">Consenza / Built on GenLayer</p>
        <h1 id="hero-title">Onchain decisions for claims, tasks, and disputes.</h1>
        <p className="hero-description">
          Submit evidence, review completed work, and resolve disputes through wallet-signed
          GenLayer workflows.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#workspace">
            Launch Consenza
            <ArrowIcon />
          </a>
          <span className="hero-network-label">
            <span className="status-light" aria-hidden="true" />
            GenLayer Studionet
          </span>
        </div>
      </div>

      <div className="consensus-scene" role="img" aria-label="Claim, Task, and Dispute evidence converging into a GenLayer decision core">
        <span className="scene-coordinate scene-coordinate-top">CONSENSUS / 03</span>
        <span className="scene-coordinate scene-coordinate-bottom">VALIDATOR SIGNAL: STABLE</span>
        <span className="scene-line scene-line-horizontal" aria-hidden="true" />
        <span className="scene-line scene-line-vertical" aria-hidden="true" />
        <span className="signal-path signal-path-claim" aria-hidden="true" />
        <span className="signal-path signal-path-task" aria-hidden="true" />
        <span className="signal-path signal-path-dispute" aria-hidden="true" />

        <div className="verdict-node verdict-node-claim">
          <span className="node-index">01</span>
          <strong>Claim</strong>
          <small>Evidence linked</small>
        </div>
        <div className="verdict-node verdict-node-task">
          <span className="node-index">02</span>
          <strong>Task</strong>
          <small>Proof verified</small>
        </div>
        <div className="verdict-node verdict-node-dispute">
          <span className="node-index">03</span>
          <strong>Dispute</strong>
          <small>Sides compared</small>
        </div>

        <div className="decision-core">
          <span className="core-ring" aria-hidden="true" />
          <span className="core-signal" aria-hidden="true" />
          <small>GenLayer</small>
          <strong>DECISION</strong>
          <span className="core-status">Accepted</span>
        </div>

        <div className="validator-row" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span className={index < 5 ? "is-active" : ""} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
