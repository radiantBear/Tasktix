import Assignee from '@/lib/model/assignee';

import { DB_User, extractUserFromRow } from './user';

export interface DB_Assignee extends DB_User {
  ia_u_id: string;
  ia_i_id: string;
  ia_role: string;
}

export function extractAssigneeFromRow(row: DB_Assignee): Assignee {
  const user = extractUserFromRow(row);

  return new Assignee(user, row.ia_role);
}
