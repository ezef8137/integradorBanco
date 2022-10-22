import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { TransferenciasComponent } from './components/transferencias/transferencias.component';

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registrar-usuario', component: RegistrarUsuarioComponent},
  {path: 'verificar-correo', component: VerificarCorreoComponent},
  {path: 'recuperar-password', component: RecuperarPasswordComponent},
  {path: 'registrar-usuario', component: RegistrarUsuarioComponent},
  {path: 'perfil-pantalla',component:PerfilComponent},
  {path: 'pres-pantalla',component:PrestamosComponent},
  {path: 'trans-ferencias',component:TransferenciasComponent},
  {path: '**', redirectTo:'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
