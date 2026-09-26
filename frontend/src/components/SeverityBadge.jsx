const SeverityBadge = ({ severity }) => {
  const styles = {
    high: 'bg-red-500/20 text-red-300',
    medium: 'bg-amber-500/20 text-amber-300',
    low: 'bg-green-500/20 text-green-300',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[severity] || styles.medium}`}>
      {severity?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};

export default SeverityBadge;