export interface ItemCreateRequest {
  name: string;
  description: string | null;
  quantity: number;
  isSuppressed: boolean | false;
}
