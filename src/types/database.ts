export interface Resolution {
  id: string;
  user_id: string;
  description: string;
  wager_amount: number;
  start_date: string;
  end_date: string;
  wallet_address: string;
  status: 'active' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

export interface DailyUpdate {
  id: string;
  resolution_id: string;
  date: string;
  completed: boolean;
  created_at?: string;
}