create table if not exists funds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  code text not null unique,
  description text,
  created_at timestamptz not null default now()
);

alter table funds enable row level security;
drop policy if exists "funds_v1_read" on funds;
create policy "funds_v1_read" on funds for select using (true);
drop policy if exists "funds_v1_write" on funds;
create policy "funds_v1_write" on funds for all using (true) with check (true);

create table if not exists monthly_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  fund_id uuid not null references funds(id) on delete cascade,
  period date not null,
  opening_value numeric(18,2) not null default 0,
  closing_value numeric(18,2) not null default 0,
  inflow numeric(18,2) not null default 0,
  outflow numeric(18,2) not null default 0,
  net_return numeric(18,2) not null default 0,
  return_pct numeric(8,4) not null default 0,
  key_contributors text,
  performance_summary text,
  summary_source text,
  summary_confidence numeric,
  summary_review_status text default 'unreviewed',
  notes text,
  created_at timestamptz not null default now(),
  unique(fund_id, period)
);

alter table monthly_entries enable row level security;
drop policy if exists "monthly_entries_v1_read" on monthly_entries;
create policy "monthly_entries_v1_read" on monthly_entries for select using (true);
drop policy if exists "monthly_entries_v1_write" on monthly_entries;
create policy "monthly_entries_v1_write" on monthly_entries for all using (true) with check (true);

insert into funds (name, code, description) values
('Growth Capital Fund', 'GCF', 'Equity-focused growth portfolio targeting high-growth sectors.'),
('Income Stability Fund', 'ISF', 'Fixed-income and dividend portfolio for stable yield.'),
('Balanced Allocation Fund', 'BAF', 'Diversified balanced fund across equities and fixed income.'),
('Emerging Markets Fund', 'EMF', 'Emerging market equity and debt with higher volatility.'),
('Real Assets Fund', 'RAF', 'Infrastructure and real estate holdings for inflation protection.')
on conflict (code) do nothing;

insert into monthly_entries (fund_id, period, opening_value, closing_value, inflow, outflow, net_return, return_pct, key_contributors, notes)
select id, '2024-10-01'::date, 10000000, 10150000, 300000, 150000, 350000, 3.50, 'Tech equity rally; strong Q3 earnings from top 3 holdings.', 'Solid month.'
from funds where code = 'GCF'
union all
select id, '2024-11-01'::date, 10150000, 10350000, 500000, 200000, 350000, 3.30, 'Continued tech momentum; healthcare drag offset by consumer gains.', 'Year-end positioning.'
from funds where code = 'GCF'
union all
select id, '2024-10-01'::date, 8000000, 8060000, 0, 100000, 160000, 2.00, 'Stable coupon income; rate cut expectations supported bond prices.', 'Planned distribution.'
from funds where code = 'ISF'
union all
select id, '2024-11-01'::date, 8060000, 8100000, 100000, 100000, 140000, 1.72, 'Dividend income steady; slight duration extension added yield.', 'On track.'
from funds where code = 'ISF'
union all
select id, '2024-10-01'::date, 12000000, 12120000, 400000, 300000, 320000, 2.60, 'Equity sleeve outperformed; fixed-income sleeve flat.', 'Rebalanced weights.'
from funds where code = 'BAF'
union all
select id, '2024-11-01'::date, 12120000, 12000000, 200000, 500000, -300000, -2.52, 'Equity correction in late November; defensive repositioning underway.', 'Review allocation.'
from funds where code = 'BAF'
union all
select id, '2024-10-01'::date, 6000000, 6300000, 500000, 0, 300000, 5.00, 'EM equity surge led by India and Brazil; currency tailwinds.', 'High volatility month.'
from funds where code = 'EMF'
union all
select id, '2024-11-01'::date, 6300000, 6150000, 0, 300000, -150000, -2.38, 'Currency reversal; profit-taking in EM equities.', 'Watching flows.'
from funds where code = 'EMF'
union all
select id, '2024-10-01'::date, 9000000, 9180000, 200000, 0, 180000, 2.00, 'Infrastructure toll revenue beat; real estate occupancy up 1.5%.', 'Stable cash flows.'
from funds where code = 'RAF'
union all
select id, '2024-11-01'::date, 9180000, 9270000, 100000, 100000, 190000, 2.06, 'Rent reviews completed; inflation-linked contracts provided uplift.', 'Inflation hedge holding.'
from funds where code = 'RAF'
on conflict (fund_id, period) do nothing;