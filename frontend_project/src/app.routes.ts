import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { authGuard } from '@/gamification/componenets/auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('@/gamification/componenets/dashboard/gamification-dashboard').then((c) => c.GamificationDashboard),
                data: { breadcrumb: 'Tableau de bord' }
            },
            {
                path: 'cours',
                data: { breadcrumb: 'Cours' },
                loadComponent: () => import('@/gamification/componenets/cours/cours-list/cours-list').then((c) => c.CoursList)
            },
            {
                path: 'cours/:id',
                data: { breadcrumb: 'Detail du cours' },
                loadComponent: () => import('@/gamification/componenets/cours/cours-detail/cours-detail').then((c) => c.CoursDetail)
            },
            {
                path: 'lecons/:id',
                data: { breadcrumb: 'Lecon' },
                loadComponent: () => import('@/gamification/componenets/lecons/lecon-view').then((c) => c.LeconView)
            },
            {
                path: 'quiz/:id',
                data: { breadcrumb: 'Quiz' },
                loadComponent: () => import('@/gamification/componenets/quiz/quiz-play').then((c) => c.QuizPlay)
            },
            {
                path: 'classement',
                data: { breadcrumb: 'Classement' },
                loadComponent: () => import('@/gamification/componenets/classement/classement').then((c) => c.Classement)
            },
            {
                path: 'profil',
                data: { breadcrumb: 'Mon profil' },
                loadComponent: () => import('./app/pages/profil/profil').then((c) => c.Profil)
            }
        ]
    },
    {
        path: 'landing',
        loadComponent: () => import('./app/pages/landing/landing').then((c) => c.Landing)
    },
    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        loadChildren: () => import('@/gamification/componenets/auth/auth.routes')
    },
    { path: '**', redirectTo: '/notfound' }
];
