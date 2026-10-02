import { listFunds } from '@/lib/data/funds';
import { Shell } from '@/components/shell';
export const dynamic = 'force-dynamic';
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const funds = await listFunds().catch(() => []);
  return <Shell funds={funds}>{children}</Shell>;
}
