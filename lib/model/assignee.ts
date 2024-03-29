import User from './user';
import Color from './color';

export default interface Assignee {
  user: User;
  role: string;
  color: Color;
}