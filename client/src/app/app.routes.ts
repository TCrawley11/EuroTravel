import { Routes } from '@angular/router';
import { CommunityComponent } from '../component/community/community.component';
import { PageNotFoundComponent } from '../component/page-not-found/page-not-found.component';
import { HomeComponent } from '../component/home/home.component';
import { AuthComponent } from '../component/auth/auth.component';
import { AboutComponent } from '../component/about/about.component';
import { PrivacyComponent } from '../component/privacy/privacy.component';
import { ListManagementComponent } from '../component/list-manage/list-manage.component';
import { AuthGuard } from '../services/auth-guard.service';
import { ListCreateComponent } from '../component/list-create/list-create.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'community', component: CommunityComponent},
    { path: 'signin', component: AuthComponent},
    { path: 'privacy', component: PrivacyComponent},
    { path: 'lists/create', component: ListCreateComponent, canActivate: [AuthGuard]},
    { path: 'lists', component: ListManagementComponent, canActivate: [AuthGuard]},
    { path: 'privacy', component: PrivacyComponent},
    // This page not found route must be last, or else it will show for the other routes due to Angular routing
    {path: '**', component: PageNotFoundComponent}
];
