import { Activity, Leaf, MapPinned, Sprout } from 'lucide-react';
import { DashboardData } from '../api';

interface DashboardProps {
  data?: DashboardData;
  loading?: boolean;
}

export function Dashboard({ data, loading }: DashboardProps) {
  const maxState = Math.max(1, ...(data?.farmsByState.map((item) => item.count) ?? [1]));
  const maxCrop = Math.max(1, ...(data?.farmsByCrop.map((item) => item.count) ?? [1]));
  const agricultural = data?.landUse.agriculturalArea ?? 0;
  const vegetation = data?.landUse.vegetationArea ?? 0;
  const landTotal = Math.max(1, agricultural + vegetation);

  return (
    <section className="dashboard">
      <div className="metric">
        <MapPinned size={22} />
        <span>Fazendas</span>
        <strong>{loading ? '-' : data?.totalFarms ?? 0}</strong>
      </div>
      <div className="metric">
        <Activity size={22} />
        <span>Hectares</span>
        <strong>{loading ? '-' : data?.totalHectares ?? 0}</strong>
      </div>
      <div className="metric">
        <Sprout size={22} />
        <span>Área agricultável</span>
        <strong>{agricultural}</strong>
      </div>
      <div className="metric">
        <Leaf size={22} />
        <span>Vegetação</span>
        <strong>{vegetation}</strong>
      </div>

      <div className="chartPanel">
        <h3>Distribuição por estado</h3>
        {(data?.farmsByState ?? []).map((item) => (
          <div className="barRow" key={item.state}>
            <span>{item.state}</span>
            <div className="barTrack">
              <div style={{ width: `${(item.count / maxState) * 100}%` }} />
            </div>
            <strong>{item.count}</strong>
          </div>
        ))}
        {!data?.farmsByState.length && <p className="muted">Sem dados.</p>}
      </div>

      <div className="chartPanel">
        <h3>Distribuição por cultura</h3>
        {(data?.farmsByCrop ?? []).map((item) => (
          <div className="barRow" key={item.crop}>
            <span>{item.crop}</span>
            <div className="barTrack crop">
              <div style={{ width: `${(item.count / maxCrop) * 100}%` }} />
            </div>
            <strong>{item.count}</strong>
          </div>
        ))}
        {!data?.farmsByCrop.length && <p className="muted">Sem dados.</p>}
      </div>

      <div className="chartPanel landUse">
        <h3>Uso do solo</h3>
        <div className="stackedBar">
          <div className="agri" style={{ width: `${(agricultural / landTotal) * 100}%` }} />
          <div className="veg" style={{ width: `${(vegetation / landTotal) * 100}%` }} />
        </div>
        <div className="legend">
          <span><i className="agriDot" />Agricultável</span>
          <span><i className="vegDot" />Vegetação</span>
        </div>
      </div>
    </section>
  );
}
