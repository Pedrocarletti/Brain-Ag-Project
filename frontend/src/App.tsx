import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Database, ExternalLink, LayoutDashboard } from 'lucide-react';
import { api, Crop, DashboardData, Farm, Harvest, PlantedCrop, Producer } from './api';
import { CrudPanel } from './components/CrudPanel';
import { Dashboard } from './components/Dashboard';
import { FieldConfig } from './types';

type Tab = 'dashboard' | 'producers' | 'farms' | 'harvests' | 'crops' | 'plantedCrops';

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'producers', label: 'Produtores' },
  { id: 'farms', label: 'Fazendas' },
  { id: 'harvests', label: 'Safras' },
  { id: 'crops', label: 'Culturas' },
  { id: 'plantedCrops', label: 'Plantios' },
];

function numberValue(value: string) {
  return Number(value.replace(',', '.'));
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Erro inesperado.';
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [dashboard, setDashboard] = useState<DashboardData>();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [plantedCrops, setPlantedCrops] = useState<PlantedCrop[]>([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, producersData, farmsData, harvestsData, cropsData, plantedCropsData] = await Promise.all([
        api.dashboard(),
        api.producers.list(search),
        api.farms.list(search),
        api.harvests.list(search),
        api.crops.list(search),
        api.plantedCrops.list(),
      ]);
      setDashboard(dashboardData);
      setProducers(producersData.data);
      setFarms(farmsData.data);
      setHarvests(harvestsData.data);
      setCrops(cropsData.data);
      setPlantedCrops(plantedCropsData.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function mutate(action: () => Promise<unknown>, success: string) {
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(success);
      await loadAll();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const producerOptions = useMemo(() => producers.map((item) => ({ value: item.id, label: `${item.name} (${item.documentType})` })), [producers]);
  const farmOptions = useMemo(() => farms.map((item) => ({ value: item.id, label: `${item.farmName} - ${item.state}` })), [farms]);
  const harvestOptions = useMemo(() => harvests.map((item) => ({ value: item.id, label: `${item.name} (${item.year})` })), [harvests]);
  const cropOptions = useMemo(() => crops.map((item) => ({ value: item.id, label: item.name })), [crops]);

  const farmFields: FieldConfig[] = [
    { name: 'producerId', label: 'Produtor', type: 'select', required: true, options: producerOptions },
    { name: 'farmName', label: 'Fazenda', required: true },
    { name: 'city', label: 'Cidade', required: true },
    { name: 'state', label: 'UF', required: true, placeholder: 'MG' },
    { name: 'totalArea', label: 'Área total', type: 'number', required: true },
    { name: 'agriculturalArea', label: 'Área agricultável', type: 'number', required: true },
    { name: 'vegetationArea', label: 'Área vegetação', type: 'number', required: true },
  ];

  return (
    <main className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <Database size={26} />
          <div>
            <strong>Rural API</strong>
            <span>Console de endpoints</span>
          </div>
        </div>
        <nav>
          {tabs.map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              {tab.id === 'dashboard' && <LayoutDashboard size={17} />}
              {tab.label}
            </button>
          ))}
        </nav>
        <a className="swaggerLink" href="http://localhost:3000/docs" target="_blank" rel="noreferrer">
          Swagger <ExternalLink size={15} />
        </a>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <h1>Visualizador da API</h1>
            <p>Gerencie registros e confira as respostas reais do backend NestJS.</p>
          </div>
          <button className="secondaryButton" type="button" onClick={() => void loadAll()}>
            Atualizar
          </button>
        </header>

        {error && (
          <div className="alert error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {notice && <div className="alert success">{notice}</div>}

        {activeTab === 'dashboard' && <Dashboard data={dashboard} loading={loading} />}

        {activeTab === 'producers' && (
          <CrudPanel
            title="Produtores"
            description="Crie, edite, liste e exclua produtores rurais."
            items={producers}
            loading={loading}
            search={search}
            onSearch={setSearch}
            getInitialForm={() => ({ document: '', name: '' })}
            toForm={(item) => ({ document: item.document, name: item.name })}
            fields={[
              { name: 'document', label: 'CPF/CNPJ', required: true, placeholder: '123.456.789-09' },
              { name: 'name', label: 'Nome', required: true },
            ]}
            columns={[
              { header: 'Nome', render: (item) => item.name },
              { header: 'Documento', render: (item) => item.document },
              { header: 'Tipo', render: (item) => item.documentType },
            ]}
            onRefresh={loadAll}
            onCreate={(values) => mutate(() => api.producers.create({ document: values.document, name: values.name }), 'Produtor criado.')}
            onUpdate={(id, values) => mutate(() => api.producers.update(id, { document: values.document, name: values.name }), 'Produtor atualizado.')}
            onDelete={(id) => mutate(() => api.producers.remove(id), 'Produtor excluído.')}
          />
        )}

        {activeTab === 'farms' && (
          <CrudPanel
            title="Fazendas"
            description="Cadastre propriedades rurais vinculadas a produtores."
            items={farms}
            loading={loading}
            search={search}
            onSearch={setSearch}
            getInitialForm={() => ({
              producerId: producerOptions[0]?.value ?? '',
              farmName: '',
              city: '',
              state: '',
              totalArea: '',
              agriculturalArea: '',
              vegetationArea: '',
            })}
            toForm={(item) => ({
              producerId: item.producerId,
              farmName: item.farmName,
              city: item.city,
              state: item.state,
              totalArea: String(item.totalArea),
              agriculturalArea: String(item.agriculturalArea),
              vegetationArea: String(item.vegetationArea),
            })}
            fields={farmFields}
            columns={[
              { header: 'Fazenda', render: (item) => item.farmName },
              { header: 'Cidade', render: (item) => `${item.city}/${item.state}` },
              { header: 'Total ha', render: (item) => item.totalArea },
              { header: 'Uso', render: (item) => `${item.agriculturalArea} agri / ${item.vegetationArea} veg` },
            ]}
            onRefresh={loadAll}
            onCreate={(values) =>
              mutate(
                () =>
                  api.farms.create({
                    producerId: values.producerId,
                    farmName: values.farmName,
                    city: values.city,
                    state: values.state,
                    totalArea: numberValue(values.totalArea),
                    agriculturalArea: numberValue(values.agriculturalArea),
                    vegetationArea: numberValue(values.vegetationArea),
                  }),
                'Fazenda criada.',
              )
            }
            onUpdate={(id, values) =>
              mutate(
                () =>
                  api.farms.update(id, {
                    producerId: values.producerId,
                    farmName: values.farmName,
                    city: values.city,
                    state: values.state,
                    totalArea: numberValue(values.totalArea),
                    agriculturalArea: numberValue(values.agriculturalArea),
                    vegetationArea: numberValue(values.vegetationArea),
                  }),
                'Fazenda atualizada.',
              )
            }
            onDelete={(id) => mutate(() => api.farms.remove(id), 'Fazenda excluída.')}
          />
        )}

        {activeTab === 'harvests' && (
          <CrudPanel
            title="Safras"
            description="Gerencie safras por nome e ano."
            items={harvests}
            loading={loading}
            search={search}
            onSearch={setSearch}
            getInitialForm={() => ({ name: '', year: String(new Date().getFullYear()) })}
            toForm={(item) => ({ name: item.name, year: String(item.year) })}
            fields={[
              { name: 'name', label: 'Nome', required: true, placeholder: 'Safra 2026' },
              { name: 'year', label: 'Ano', type: 'number', required: true },
            ]}
            columns={[
              { header: 'Nome', render: (item) => item.name },
              { header: 'Ano', render: (item) => item.year },
            ]}
            onRefresh={loadAll}
            onCreate={(values) => mutate(() => api.harvests.create({ name: values.name, year: numberValue(values.year) }), 'Safra criada.')}
            onUpdate={(id, values) => mutate(() => api.harvests.update(id, { name: values.name, year: numberValue(values.year) }), 'Safra atualizada.')}
            onDelete={(id) => mutate(() => api.harvests.remove(id), 'Safra excluída.')}
          />
        )}

        {activeTab === 'crops' && (
          <CrudPanel
            title="Culturas"
            description="Gerencie culturas como soja, milho e café."
            items={crops}
            loading={loading}
            search={search}
            onSearch={setSearch}
            getInitialForm={() => ({ name: '' })}
            toForm={(item) => ({ name: item.name })}
            fields={[{ name: 'name', label: 'Nome', required: true, placeholder: 'Soja' }]}
            columns={[{ header: 'Nome', render: (item) => item.name }]}
            onRefresh={loadAll}
            onCreate={(values) => mutate(() => api.crops.create({ name: values.name }), 'Cultura criada.')}
            onUpdate={(id, values) => mutate(() => api.crops.update(id, { name: values.name }), 'Cultura atualizada.')}
            onDelete={(id) => mutate(() => api.crops.remove(id), 'Cultura excluída.')}
          />
        )}

        {activeTab === 'plantedCrops' && (
          <CrudPanel
            title="Culturas plantadas"
            description="Vincule uma cultura a uma fazenda e safra."
            items={plantedCrops}
            loading={loading}
            getInitialForm={() => ({
              farmId: farmOptions[0]?.value ?? '',
              cropId: cropOptions[0]?.value ?? '',
              harvestId: harvestOptions[0]?.value ?? '',
            })}
            toForm={(item) => ({ farmId: item.farmId, cropId: item.cropId, harvestId: item.harvestId })}
            fields={[
              { name: 'farmId', label: 'Fazenda', type: 'select', required: true, options: farmOptions },
              { name: 'cropId', label: 'Cultura', type: 'select', required: true, options: cropOptions },
              { name: 'harvestId', label: 'Safra', type: 'select', required: true, options: harvestOptions },
            ]}
            columns={[
              { header: 'Fazenda', render: (item) => item.farm?.farmName ?? farms.find((farm) => farm.id === item.farmId)?.farmName ?? item.farmId },
              { header: 'Cultura', render: (item) => item.crop?.name ?? crops.find((crop) => crop.id === item.cropId)?.name ?? item.cropId },
              { header: 'Safra', render: (item) => item.harvest?.name ?? harvests.find((harvest) => harvest.id === item.harvestId)?.name ?? item.harvestId },
            ]}
            onRefresh={loadAll}
            onCreate={(values) =>
              mutate(() => api.plantedCrops.create({ farmId: values.farmId, cropId: values.cropId, harvestId: values.harvestId }), 'Plantio criado.')
            }
            onDelete={(id) => mutate(() => api.plantedCrops.remove(id), 'Plantio excluído.')}
          />
        )}
      </section>
    </main>
  );
}
