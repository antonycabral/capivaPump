import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { HomeComponent } from './page/home/home.component';
import { CadastroComponent } from './page/cadastro/cadastro.component';
import { TreinoFormComponent } from './components/treino-form/treino-form.component';
import { AuthGuard } from './auth.guard';
import { TreinoComponent } from './page/treino/treino.component';
import { ExercicioFormComponent } from './components/exercicio-form/exercicio-form.component';
import { TreinoTelaComponent } from './page/treino-tela/treino-tela.component';
import { PerfilComponent } from './page/perfil/perfil.component';
import { DesempenhoPageComponent } from './page/desempenho-page/desempenho-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'treino/novo', component: TreinoFormComponent, canActivate: [AuthGuard] },
    { path: 'treino/editar/:id', component: TreinoFormComponent, canActivate: [AuthGuard] },
    { path: 'treino/:id', component: TreinoComponent, canActivate: [AuthGuard] },
    { path: 'exercicio/novo', component: ExercicioFormComponent, canActivate: [AuthGuard] },
    {path: 'treino-tela/:id', component:TreinoTelaComponent, canActivate: [AuthGuard]},
    {path: 'perfil',component: PerfilComponent,canActivate: [AuthGuard]},
    { path: 'desempenho', component: DesempenhoPageComponent, canActivate: [AuthGuard] },
];
