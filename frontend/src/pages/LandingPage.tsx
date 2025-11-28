import PageShell from '../components/PageShell';
import useAddToHomeScreen from '../hooks/useAddToHomeScreen';

const LandingPage = () => {
  const { isInstallable, install } = useAddToHomeScreen();

  const hero = (
    <div className="landing-hero">
      <div className="landing-brand">
        <h1 className="landing-title">Swyn Sports</h1>
        <p className="landing-tagline">Manage your sports rituals with real-time sync</p>
      </div>
    </div>
  );

  return (
    <PageShell hero={hero}>
      {isInstallable && (
        <div className="landing-install">
          <button className="ghost-btn" onClick={install} style={{ fontSize: '0.9rem' }}>
            Install App
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default LandingPage;

