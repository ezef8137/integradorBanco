import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {
  dataUser: any;
  prestamoUsuario: FormGroup;

  constructor(
    public _datosService: DatosFirebaseService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private fb:FormBuilder,
    private toastr : ToastrService
  ) {
    this.prestamoUsuario = this.fb.group({
      monto: ["",[Validators.required]],
      cuotas: ["", Validators.required],
      razon: ["", Validators.required],
      cuil: ["", Validators.required]
    })
   }

  ngOnInit(): void {
  }

  prestamo(){
    if (this.prestamoUsuario.value.cuil == "" || this.prestamoUsuario.value.monto == ""){
      this.toastr.error("Campos sin rellenar","Error")
      return;}

}}
