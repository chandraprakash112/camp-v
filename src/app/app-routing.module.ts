import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'setting',
        loadComponent: () => import('./demo/pages/setting/setting').then((c) => c.Setting)
      },
      {
        path: 'email-template',
        loadComponent: () => import('./demo/pages/email-template/email-template').then((c) => c.EmailTemplate)
      },
      {
        path: 'organisation',
        loadComponent: () => import('./demo/pages/organisation/organisation').then((c) => c.Organisation)
      },
      {
        path: 'department',
        loadComponent: () => import('./demo/pages/department/department').then((c) => c.Department)
      },
      {
        path: 'role',
        loadComponent: () => import('./demo/pages/role/role').then((c) => c.Role)
      },
      {
        path: 'role-access',
        loadComponent: () => import('./demo/pages/role-access/role-access').then((c) => c.RoleAccess)
      },
      {
        path: 'user',
        loadComponent: () => import('./demo/pages/users/users').then((c) => c.Users)
      },
      {
        path: 'category',
        loadComponent: () => import('./demo/pages/category/category').then((c) => c.Category)
      },
      {
        path: 'subcategory',
        loadComponent: () => import('./demo/pages/subcategory/subcategory').then((c) => c.Subcategory)
      },
      {
        path: 'notification',
        loadComponent: () => import('./demo/pages/notification/notification').then((c) => c.Notification)
      },
      {
        path: 'profile',
        loadComponent: () => import('./demo/pages/profile/profile').then((c) => c.Profile)
      },


      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component').then((c) => c.ElementColorComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/register/register.component').then((c) => c.RegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
