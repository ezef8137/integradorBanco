import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarUsuario:FormGroup;
  loading:boolean=false;

  constructor(
    private fb:FormBuilder,
    private afAuth:AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService) { 
      this.recuperarUsuario= this.fb.group({
        correo:["",Validators.required]
      })
    }

  ngOnInit(): void {
  }
  recuperar(){
    this.loading=true

    this.afAuth.sendPasswordResetEmail(this.recuperarUsuario.value.correo).then(() => {

        this.toastr.info("Le hemos enviado un correo para restablecer su password","Recuperar Password")
        this.router.navigate(["/login"])

    }).catch((error)=>{
      this.loading=false
      this.toastr.error(this.firebaseError.codeError(error.code),"Error");
    })
  }

}
