import useAddToHomeScreen from '../hooks/useAddToHomeScreen';

const InstallBanner = () => {
  const { isInstallable, install } = useAddToHomeScreen();
  if (!isInstallable) return null;
  return (
    <div className="install-banner">
      <div>
        <strong>Install Swyn Sports</strong>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Pin this workspace for instant sideline access.</p>
      </div>
      <button className="ghost-btn" style={{ color: '#000000', borderColor: 'rgba(0,0,0,0.15)' }} onClick={install}>
        Install PWA
      </button>
    </div>
  );
};

export default InstallBanner;

