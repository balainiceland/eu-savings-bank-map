import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import MapContainer from './components/Map/MapContainer';
import FilterPanel from './components/Filters/FilterPanel';
import BankDetail from './components/Bank/BankDetail';
import RankingsPanel from './components/Rankings/RankingsPanel';
import ComparePanel from './components/Compare/ComparePanel';
import BenchmarksPanel from './components/Benchmarks/BenchmarksPanel';
import ScatterPanel from './components/Scatter/ScatterPanel';
import DistributionPanel from './components/Distribution/DistributionPanel';
import AdminPage from './components/Admin/AdminPage';
import LoginGate from './components/Auth/LoginGate';
import PrivacyPolicy from './components/PrivacyPolicy';
import { useStore } from './hooks/useStore';

function MapPage() {
  const loadBanks = useStore(state => state.loadBanks);
  const banks = useStore(state => state.banks);
  const setSelectedBank = useStore(state => state.setSelectedBank);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  useEffect(() => {
    const bankId = searchParams.get('bank');
    if (bankId && banks.length > 0) {
      const bank = banks.find(b => b.id === bankId);
      if (bank) setSelectedBank(bank);
    }
  }, [searchParams, banks, setSelectedBank]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <MapContainer />
        <FilterPanel />
        <BankDetail />
        <RankingsPanel />
        <ComparePanel />
        <BenchmarksPanel />
        <ScatterPanel />
        <DistributionPanel />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginGate><MapPage /></LoginGate>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
