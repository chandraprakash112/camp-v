export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  allowView?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  // {
  // id: 'dashboard',
  // title: 'Dashboard',
  // type: 'group',
  // icon: 'icon-navigation',
  // children: [
  {
    id: 'Ticket',
    title: 'Dashboard',
    type: 'item',
    classes: 'nav-item',
    url: '/dashboard',
    icon: 'bi bi-layout-wtf',
    breadcrumbs: false,
  },
  //   ],
  // },
  // {
  //   id: 'page',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  {
    id: 'Settings',
    title: 'Admin Settings',
    type: 'collapse',
    icon: 'bi bi-gear-wide',
    children: [
      {
        id: 'AppSetting',
        title: 'App Settings',
        type: 'item',
        url: '/setting',
        icon: 'bi-sliders2',
        breadcrumbs: false,
      },
      {
        id: 'EmailTemplates',
        title: 'Email Template',
        type: 'item',
        url: '/email-template',
        icon: 'bi-envelope-paper',
        // breadcrumbs: false,
      },
    ],
  },

  // {
  //   id: 'Organization',
  //   title: 'Organization',
  //   type: 'item',
  //   classes: 'nav-item',
  //   url: '/organisation',
  //   icon: 'bi-buildings',
  // },
  // {
  //   id: 'Department',
  //   title: 'Department',
  //   type: 'item',
  //   classes: 'nav-item',
  //   url: '/department',
  //   icon: 'bi-building',
  // },
  {
    id: 'Masters',
    title: 'Masters',
    type: 'collapse',
    icon: 'bi-card-list',
    children: [
      {
        id: 'BusinessCurd',
        title: 'Organization',
        type: 'item',
        url: '/organisation',
        icon: 'bi-buildings',
      },
      {
        id: 'DepartmentCurd',
        title: 'Department',
        type: 'item',
        url: '/department',
        icon: 'bi-building',
      },
      {
        id: 'Role',
        title: 'Roles',
        type: 'item',
        url: '/role',
        icon: 'bi-person-vcard',
      },
      {
        id: 'RoleAccess',
        title: 'Role Access',
        type: 'item',
        url: '/role-access',
        icon: 'bi-person-check',
      },
      {
        id: 'CategoryCurd',
        title: 'Category',
        type: 'item',
        url: '/category',
        icon: 'bi-clipboard-check',
      },
    ],
  },
  {
    id: 'User Management',
    title: 'User Management',
    type: 'collapse',
    icon: 'bi-person-gear',
    children: [
      {
        id: 'Agent',
        title: 'User List',
        type: 'item',
        url: '/user',
        icon: 'bi-person-lines-fill',
      },
    ],
  },
  // {
  //   id: 'Category',
  //   title: 'Category',
  //   type: 'item',
  //   classes: 'nav-item',
  //   url: '/category',
  //   icon: 'bi-clipboard-check',
  // },
  // {
  //   id: 'Authentication',
  //   title: 'Authentication',
  //   type: 'collapse',
  //   icon: 'bi bi-key',
  //   children: [
  //     {
  //       id: 'login',
  //       title: 'Login',
  //       type: 'item',
  //       url: '/login',
  //       target: true,
  //       breadcrumbs: false,
  //     },
  //     {
  //       id: 'register',
  //       title: 'Register',
  //       type: 'item',
  //       url: '/register',
  //       target: true,
  //       breadcrumbs: false,
  //     },
  //   ],
  // },
  //   ],
  // },
  // {
  //   id: 'elements',
  //   title: 'Elements',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/typography',
  //       icon: 'bi bi-typography',
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/color',
  //       icon: 'bi bi-brush',
  //     },
  //     {
  //       id: 'tabler',
  //       title: 'Tabler',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://tabler-icons.io/',
  //       icon: 'bi bi-plant-2',
  //       target: true,
  //       external: true,
  //     },
  //   ],
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'bi bi-brand-chrome',
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/berry-angular/',
  //       icon: 'bi bi-vocabulary',
  //       target: true,
  //       external: true,
  //     },
  //   ],
  // },
];
