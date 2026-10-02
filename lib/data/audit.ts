import 'server-only';
import { db,databaseError } from './db';
export type AuditEvent = { id:string; action:string; target_table:string; target_id:string; created_at:string; detail:{ before?:{name?:string;period?:string}; after?:{name?:string;period?:string} } };
export async function recentActivity(): Promise<AuditEvent[] | null> {
  const {data,error} = await db().from('audit_log').select('id,action,target_table,target_id,created_at,detail').order('created_at',{ascending:false}).limit(15);
  // The original provisioned schema predates audit logging. Core CRUD works
  // while the additive audit migration is being applied.
  if (error?.code === '42P01' || error?.code === 'PGRST205') return null;
  if (error) databaseError(error);
  return data as AuditEvent[];
}
