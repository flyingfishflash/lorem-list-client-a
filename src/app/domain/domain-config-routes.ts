export const domainRoutes = {
  itemCreate: 'item-create',
  itemsManage: 'items-manage',
  listCreate: 'list-create',
  listsManage: 'lists-manage',
} as const;

export const domainApiRoutes = {
  items: '/items',
  lists: '/lists',
  managementHealth: '/management/health',
  managementInfo: '/management/info',
  publicLists: '/public/lists',
} as const;
