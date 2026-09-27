import { PublicValue } from '../components/widgets/PublicValue.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';

export default function PublicValuePage() {
  const state = useAppStore();
  const pilots = state.pilots.filter(p => p.status !== 'Pending');

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Public Value</h1>
          <p>Impact created by validated pilots — measured against declared baselines and targets</p>
        </div>
      </div>
      {pilots.length ? pilots.map(p => {
        const v = state.validations.find(x => x.pilotId === p.id);
        return <div key={p.id} style={{ marginBottom: 24 }}><PublicValue pilot={p} validation={v} /></div>;
      }) : <EmptyState icon="trendingUp" title="No pilots to report" />}
    </div>
  );
}