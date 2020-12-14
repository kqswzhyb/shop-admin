export interface LoginConfig {
  userName: string;
  password: string;
  uid: string;
  x: number;
}

export interface Page {
  current: number;
  pageSize: number;
  total: number;
}

export interface DicData {
  value: string;
  name: string;
}
