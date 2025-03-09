import { generateId } from '@/lib/generateId';

export default class Session {
  id: string;
  userId: string | null;
  dateExpire: Date | null;

  constructor(id?: string) {
    if (!id) id = generateId(128);

    this.id = id;
    this.userId = null;
    this.dateExpire = null;
  }
}
