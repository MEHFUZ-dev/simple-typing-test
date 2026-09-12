import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { TypingTest } from './typing-test/typing-test';
import { Results } from './results/results';
import { History } from './history/history';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { ResultDetails } from './result-details/result-details';
export const routes: Routes = [

    {
        path: '',
        component: TypingTest,
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'typing-test',
        component: TypingTest,
    },
    {
        path: 'results',
        component: Results,
    },
    {
        path: 'history',
        component: History,
        canActivate: [authGuard]
    },
    { path: 'profile', component: Profile, canActivate: [authGuard] },

    {
        path: 'result/:id',
        component: ResultDetails,
        canActivate: [authGuard]
    }

];
