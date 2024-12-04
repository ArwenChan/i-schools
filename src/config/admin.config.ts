// import { ResourceWithOptions } from 'adminjs';
import { Comments } from '../comments/entities/comment.entity';
import { Event } from '../events/entities/event.entity';
import {
  NewProposal,
  UpdateProposal,
} from '../schools/entities/proposal.entity';
import { School } from '../schools/entities/school.entity';
import { User } from '../users/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-function
let importExportFeature = (options: any) => (option1: any, option2: any) => {};
let componentLoader: any = null;

export async function getAdminComponentLoader() {
  if (componentLoader === null) {
    const ComponentLoader = (await import('adminjs')).ComponentLoader;
    componentLoader = new ComponentLoader();
    importExportFeature = (await import('@adminjs/import-export')).default;
  }
  return componentLoader;
}

const adminNavigation = {
  usersNavigation: {
    name: 'Users',
    icon: 'User',
  },
  dataNavigation: {
    name: 'Data',
    icon: 'Database',
  },
};

export function getAdminResources() {
  return [
    {
      resource: User,
      options: {
        listProperties: ['name', 'openid', 'phone', 'platform', 'roles'],
        navigation: adminNavigation.dataNavigation,
      },
    },
    {
      resource: School,
      options: {
        listProperties: ['name', 'category', 'stage', 'create_time'],
        navigation: adminNavigation.dataNavigation,
      },
      features: [importExportFeature({ componentLoader })],
    },
    {
      resource: NewProposal,
      options: {
        listProperties: ['name', 'region_code', 'processed', 'create_time'],
        navigation: adminNavigation.dataNavigation,
      },
    },
    {
      resource: UpdateProposal,
      options: {
        listProperties: ['school.id', 'processed', 'create_time'],
        navigation: adminNavigation.dataNavigation,
      },
    },
    {
      resource: Event,
      options: {
        listProperties: ['type', 'create_time', 'target.id'],
        navigation: adminNavigation.dataNavigation,
      },
    },
    {
      resource: Comments,
      options: {
        // listProperties: ['name', 'category', 'stage', 'create_time'],
        navigation: adminNavigation.dataNavigation,
        // properties: {
        //   anonymous: {
        //     props: {
        //       checked: false,
        //     },
        //   },
        // },
      },
    },
  ];
}
