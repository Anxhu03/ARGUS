import React from 'react';

export default function StatusBadge({ status = 'New', size = 'md', className = '' }) {
  const norm = (status || '').toLowerCase().replace(/[\s_]+/g, '-');

  let badgeType = 'badge-waiting';
  let label = status;

  if (norm.includes('investigat')) {
    badgeType = 'badge-investigating';
    label = 'Investigating';
  } else if (norm.includes('resolv') || norm.includes('complet') || norm.includes('verifi')) {
    badgeType = 'badge-completed';
    label = norm.includes('verifi') ? 'Verified' : norm.includes('complet') ? 'Completed' : 'Resolved';
  } else if (norm.includes('contradict')) {
    badgeType = 'badge-contradiction';
    label = 'Contradiction';
  } else if (norm.includes('escalat') || norm.includes('human') || norm.includes('fail')) {
    badgeType = 'badge-escalated';
    label = norm.includes('human') ? 'Human Review' : norm.includes('fail') ? 'Failed' : 'Escalated';
  } else if (norm.includes('evidence')) {
    badgeType = 'badge-waiting';
    label = 'Evidence Req';
  } else if (norm.includes('wait') || norm.includes('pend')) {
    badgeType = 'badge-waiting';
    label = norm.includes('pend') ? 'Pending' : 'Waiting';
  } else if (norm.includes('coordinator') || norm.includes('root')) {
    badgeType = 'badge-coordinator';
    label = status;
  }

  const padding = size === 'sm' ? '2px 7px' : '4px 10px';
  const fontSize = size === 'sm' ? '10px' : '11px';

  return (
    <span
      className={`badge ${badgeType} ${className}`}
      style={{ padding, fontSize }}
    >
      <span className="badge-dot" />
      <span>{label}</span>
    </span>
  );
}
