const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '$0.00';
  if (amount < 0) return `-$${formatCurrency(-amount).replace('$', '')}`;

  if (amount < 1000) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  let tier = 0;
  let reduced = amount;
  while (reduced >= 1000 && tier < suffixes.length - 1) {
    reduced /= 1000;
    tier++;
  }

  if (tier >= suffixes.length - 1 && reduced >= 1000) {
    return `$${amount.toExponential(2)}`;
  }

  return `$${reduced.toFixed(2)} ${suffixes[tier]}`;
}

export function formatHashrate(hps: number): string {
  if (hps < 1000) return `${hps.toFixed(1)} H/s`;
  if (hps < 1e6) return `${(hps / 1e3).toFixed(2)} KH/s`;
  if (hps < 1e9) return `${(hps / 1e6).toFixed(2)} MH/s`;
  if (hps < 1e12) return `${(hps / 1e9).toFixed(2)} GH/s`;
  if (hps < 1e15) return `${(hps / 1e12).toFixed(2)} TH/s`;
  if (hps < 1e18) return `${(hps / 1e15).toFixed(2)} PH/s`;
  return `${(hps / 1e18).toFixed(2)} EH/s`;
}
