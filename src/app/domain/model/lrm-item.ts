import { LrmListSuccinct } from './lrm-list-succinct';

export interface LrmItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
  lists: LrmListSuccinct[];
}
