import { Models } from '@rematch/core';
import { auth } from './auth';
import { deliveries } from './deliveries';
import { outlets } from './outlets';
import { inventory } from './inventory';
import { requests } from './requests';
import { dashboard } from './dashboard';
import { products } from './products';
import { customers } from './customers';

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  deliveries: typeof deliveries;
  outlets: typeof outlets;
  inventory: typeof inventory;
  requests: typeof requests;
  dashboard: typeof dashboard;
  products: typeof products;
  customers: typeof customers;
}

export const models: RootModel = {
  auth, products, dashboard, customers,
  deliveries, outlets, inventory, requests
};