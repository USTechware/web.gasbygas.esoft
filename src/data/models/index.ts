import { Models } from '@rematch/core';
import { auth } from './auth';
import { deliveries } from './deliveries';
import { outlets } from './outlets';
import { inventory } from './inventory';
import { requests } from './requests';
import { dashboard } from './dashboard';

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  deliveries: typeof deliveries;
  outlets: typeof outlets;
  inventory: typeof inventory;
  requests: typeof requests;
  dashboard: typeof dashboard;
}

export const models: RootModel = { auth, dashboard, deliveries, outlets, inventory, requests };