import { LrmListItem } from './lrm-list-item';

export interface LrmList {
  id: string;
  name: string;
  description: string;
  public: boolean;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
  items: LrmListItem[];
}
