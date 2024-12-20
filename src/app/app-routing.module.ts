import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DownloadComponent } from './pages/download/download.component';
import { HistoryComponent } from './pages/history/history.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { DetailStandardComponent } from './pages/detail-standard/detail-standard.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { ResetComponent } from './pages/reset/reset.component'
import { PortfolioInformationComponent } from './pages/portfolio-information/portfolio-information.component';
import { ReferenceComponent } from './pages/reference/reference.component';
import { EducationComponent } from './layouts/education/education.component';
import { ExperienceComponent } from './layouts/experience/experience.component';
import { LinkComponent } from './layouts/link/link.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'about', component: AboutComponent},
  {path:'profile', component: ProfileComponent},
  {path:'portfolio', component: PortfolioComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'download', component: DownloadComponent},
  {path:'summary', component: HistoryComponent},
  {path:'reset-password', component: ResetPasswordComponent},
  {path:'detail-standard/:codeskill', component: DetailStandardComponent},
  {path:'recovery-password', component: RecoveryPasswordComponent},
  {path:'reset', component: ResetComponent},
  {path:'portfolio-information', component: PortfolioInformationComponent},
  {path:'reference', component: ReferenceComponent},
  {path: 'education', component: EducationComponent},
  {path: 'experience', component: ExperienceComponent},
  {path: 'link', component: LinkComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
