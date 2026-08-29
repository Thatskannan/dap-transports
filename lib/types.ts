export type Trip = {
  id: string;
  trip_date: string;
  vehicle_number: string;
  company_name: string;
  destination_from: string;
  destination_to: string;
  rent: number;
  advance_from_company: number;
  balance_from_company: number;
  driver_name: string;
  driver_salary: number;
  driver_advance: number;
  driver_balance: number;
  diesel_cost: number;
  fasttag: number;
  net_profit: number;
  created_at: string;
};

export type TripFormInput = {
  trip_date: string;
  vehicle_number: string;
  company_name: string;
  destination_from: string;
  destination_to: string;
  rent: string;
  advance_from_company: string;
  driver_name: string;
  driver_salary: string;
  driver_advance: string;
  diesel_cost: string;
  fasttag: string;
};
