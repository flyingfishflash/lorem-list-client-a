import { LrmListSuccinct } from './lrm-list-succinct';

export interface LrmListItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  isSuppressed: boolean;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
  lists: LrmListSuccinct[];
}
