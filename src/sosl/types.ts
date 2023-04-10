import { OPERATORS } from './enum';

export type Condition = {
  x: string | Condition;
  op: OPERATORS;
  y: string | Condition;
};
