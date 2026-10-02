# Fund Management — Test Plan

## v1 success scenario (manual)
1. Open app → Dashboard renders with 5 seeded funds, each showing latest-month data.
2. Click "Growth Capital Fund" → fund detail shows seeded monthly entries sorted by period desc.
3. Click "New entry" → form opens.
4. Enter: period 2024-12-01, opening 10,350,000, closing 10,800,000, inflow 200,000, outflow 100,000, key_contributors "Year-end rebalancing; gains in energy sector", notes "Final month".
5. Submit → row appears in fund detail table; net_return = 350,000, return_pct ≈ 3.30%.
6. Go to Dashboard → GCF card shows Dec 2024 values + key-contributors snippet.
7. Verify top-fund highlight updates if GCF is now ranked highest.

## Duplicate entry prevention
8. Try to create a second entry for GCF period 2024-12-01 → friendly error, no duplicate row.

## Empty state
9. Delete all entries for one fund → fund detail shows "No entries yet" empty state with "New entry" CTA.

## Error state
10. Temporarily break Supabase URL → dashboard shows error state with retry button, not a blank screen.

## Loading state
11. Throttle network → entry table shows skeleton rows before data arrives.

## Edit / delete
12. Edit an existing entry's closing_value → net_return + return_pct recalculate and persist on refresh.
13. Delete an entry → row removed from table and dashboard updates.

## Responsive
14. Resize to mobile width → sidebar collapses to hamburger; fund cards stack vertically.

## Computed-field integrity
15. Create entry with opening=0, inflow=0 → return_pct handled (no divide-by-zero crash; shown as 0 or N/A).
