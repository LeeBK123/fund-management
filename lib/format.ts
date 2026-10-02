export const money = (v: number) => new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
export const pct = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
export const month = (v: string) => new Date(`${v.slice(0,7)}-01T00:00:00Z`).toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'});
