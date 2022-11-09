import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  loginUsuario: FormGroup;

  constructor(
  private fb:FormBuilder,
  private afAuth:AngularFireAuth,
  private toastr: ToastrService,
  private router: Router,
  private firebaseError: FirebaseCodeErrorService
  ) {
    this.loginUsuario=this.fb.group({
      email: ["",Validators.required],
      password:["",Validators.required]
    })
  }

  ngOnInit(): void {
  }
  login(){
    this.afAuth.signInWithEmailAndPassword(this.loginUsuario.value.email,this.loginUsuario.value.password)
    .then((user)=>{
      if (user.user?.emailVerified ){
        this.router.navigate(["/perfil-pantalla"]);
      } else {
        this.router.navigate(["/verificar-correo"]);
      }
    })
    .catch((error)=>{
      this.toastr.error(this.firebaseError.codeError(error.code),"Error");
    })
  }

    }
