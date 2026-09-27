import { Icon } from '../Icons.jsx';

const STATUS_MAP = {
  Verified:'success', Approved:'success', PAID:'success', Paid:'success', Completed:'success', Validated:'success',
  ACHIEVED:'success', Achieved:'success', Active:'success', 'On track':'success', 'Eligible':'success', Cleared:'success',
  Pending:'warning', 'Needs action':'warning', 'Under review':'warning', NEAR:'warning', 'Near target':'warning',
  'Awaiting validation':'warning', AWAITING_VALIDATION:'warning', AWAITING_PAYMENT:'warning', PENDING_EVIDENCE:'warning',
  'Conditionally eligible':'warning', 'Awaiting evidence':'warning', 'In progress':'warning', IN_PROGRESS:'warning',
  'Decision pending':'warning', Discovering:'info', BELOW:'danger',
  Rejected:'danger', Blocked:'danger', Overdue:'danger', Failed:'danger', 'Not eligible':'danger',
  Draft:'neutral', Scheduled:'info', LOCKED:'neutral', Submitted:'info', Screening:'info', Shortlisted:'purple',
  Evaluation:'purple', Pilot:'purple', Contract:'info', Monitoring:'info', Payment:'info', Validation:'info',
  'Scale-up':'info', SCALE_UP:'info', CHALLENGE:'neutral', DISCOVERY:'info', SCREENING:'info',
  EVALUATION:'purple', PILOT_DESIGN:'purple', CONTRACT:'info', MONITORING:'info', PAYMENT:'info',
  VALIDATION:'info', 'Not started':'neutral',
  Challenge:'info', Evaluation:'purple', Contract:'info', Compliance:'warning', 'Scale-up':'info'
};

export function Badge({ status, icon }) {
  const tone = STATUS_MAP[status] || 'neutral';
  return (
    <span className={`badge badge-${tone}`}>
      {icon && <Icon name={icon} />}
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const tone = priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'success';
  return <span className={`badge badge-${tone}`}>{priority}</span>;
}