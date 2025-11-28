import useOnlineStatus from '../hooks/useOnlineStatus';

const OfflineRibbon = () => {
  const online = useOnlineStatus();
  if (online) return null;
  return <div className="offline-banner">Offline mode — using cached sports tasks</div>;
};

export default OfflineRibbon;

