import { LrmItem } from "./lrm-item";

export interface LrmList {
  id: string;
  name: string;
  description: string;
  public: boolean;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
  items: LrmItem[];
}
