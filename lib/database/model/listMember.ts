import ListMember from '@/lib/model/listMember';
import { DB_User, extractUserFromRow } from './user';

export interface DB_ListMember extends DB_User {
  lm_l_id: string;
  lm_u_id: string;
  lm_canAdd: boolean;
  lm_canRemove: boolean;
  lm_canComplete: boolean;
  lm_canAssign: boolean;
}

export function extractListMemberFromRow(row: DB_ListMember): ListMember {
  const user = extractUserFromRow(row);
  return new ListMember(
    user,
    row.lm_canAdd,
    row.lm_canRemove,
    row.lm_canComplete,
    row.lm_canRemove
  );
}
