export const domainRoutes = {
  itemCreate: 'item-create',
  itemsManage: 'items-manage',
  listsManage: 'lists-manage',
} as const;

export const domainApiRoutes = {
  items: '/items',
  lists: '/lists',
  listsCount: '/lists/count',
  managementHealth: '/management/health',
  managementInfo: '/management/info',
  publicLists: '/public/lists',
} as const;
