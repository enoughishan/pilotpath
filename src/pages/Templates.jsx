import { Icon } from '../components/Icons.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { fmtDate } from '../utils/format.js';

export default function Templates() {
  const templates = useAppStore(s => s.templates);
  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Template Library</h1>
          <p>Standard templates for problem statements, contracts, IP clauses and validation</p>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Template</th><th>Category</th><th>Version</th><th>Owner</th><th>Last updated</th><th>Status</th></tr></thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.id}>
                <td><b>{t.name}</b></td>
                <td><Badge status={t.category} /></td>
                <td className="mono small">{t.version}</td>
                <td className="muted small">{t.owner}</td>
                <td className="muted small">{fmtDate(t.updated)}</td>
                <td><Badge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}