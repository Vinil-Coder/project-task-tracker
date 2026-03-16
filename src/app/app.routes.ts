import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { UserNotLoggedInGuard } from './core/guards/user-loggedIn.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(c => c.Login),
        canActivate: [UserNotLoggedInGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then(c => c.Register),
        canActivate: [UserNotLoggedInGuard]
    },
    {
        path: 'landing',
        loadComponent: () => import('./pages/landing-page/landing-page').then(c => c.LandingPage),
        canActivate: [UserNotLoggedInGuard]
    },
    {
        path: '',
        loadComponent: () => import('./layout/layout').then(c => c.Layout),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'projects',
                loadComponent: () => import('./pages/project/project').then(c => c.Project)
            },
            {
                path: 'tasks',
                loadComponent: () => import('./pages/task/task').then(c => c.Task)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard').then(c => c.Dashboard)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile').then(c => c.Profile)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
