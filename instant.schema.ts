import { i } from '@instantdb/react-native';

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
      name: i.string().optional(),
      phone: i.string().optional(),
      createdAt: i.number().optional(),
      updatedAt: i.number().optional(),
    }),
    // Add other entities as needed
  },
  links: {},
  rooms: {},
});

export default _schema;
