type Props = {
  label: string;
  value: string;
  sublabel?: string;
};

const StatCard = ({ label, value, sublabel }: Props) => (
  <div className="stat-card">
    <p>{label}</p>
    <h2>{value}</h2>
    {sublabel && <span>{sublabel}</span>}
  </div>
);

export default StatCard;

