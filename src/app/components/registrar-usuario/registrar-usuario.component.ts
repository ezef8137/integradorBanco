import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  registrarUsuario: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService
  ) {
    this.registrarUsuario = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      repetirPassword: ["", Validators.required]

    })
  }

  ngOnInit(): void {
  }
  registrar() {
    console.log(this.registrarUsuario.value.password)
    console.log(this.registrarUsuario.value.repetirPassword)
    if (this.registrarUsuario.value.password !== this.registrarUsuario.value.repetirPassword) {
      this.toastr.error(
        'Las contraseñas ingresadas deben ser las mismas',
        'Error'
      );
      return;
    }

    this.loading = true;
    this.afAuth.createUserWithEmailAndPassword(this.registrarUsuario.value.email, this.registrarUsuario.value.password)
      .then(() => {
        this.verificarCorreo();
      })
      .catch((error) => {
        this.loading = false
        console.log(error);
        this.toastr.error(this.firebaseError.codeError(error.code), "Error");
      });

  }

  verificarCorreo() {
    this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.toastr.info(
          'Le enviamos un correo electronico para su verificacion',
          'Verificar correo'
        );
        this.router.navigate(['/login']);
      });
  }

}
