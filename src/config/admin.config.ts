// import { ResourceWithOptions } from 'adminjs';
import { Comments } from '../comments/entities/comment.entity';
import { Event } from '../events/entities/event.entity';
import {
  NewProposal,
  UpdateProposal,
} from '../schools/entities/proposal.entity';
import { School } from '../schools/entities/school.entity';
import { User } from '../users/entities/user.entity';

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

export const AdminResources = [
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
