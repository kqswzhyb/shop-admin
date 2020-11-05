export interface LoginConfig {
  userName: string;
  password: string;
}

export interface Page {
  current: number;
  pageSize: number;
  total: number;
}
