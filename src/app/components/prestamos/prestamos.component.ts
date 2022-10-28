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
  totalPrestamo: any
  tasa: number

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
      cuil: ["", Validators.required]
    })
   }

  // Interés simple = Préstamo x Tasa de interés x Períodos a pagar
  // $500 x 0,03 x 6 meses
  ngOnInit(): void {
  }

  calcularPrestamo(){
    if (this.prestamoUsuario.value.cuotas == 6){
      this.tasa = 0.10
    } else if (this.prestamoUsuario.value.cuotas == 12){
      this.tasa = 0.30
    }else if (this.prestamoUsuario.value.cuotas == 18){
      this.tasa = 0.50
    } else {
      this.tasa = 0.70
    }
    this.totalPrestamo = (this.prestamoUsuario.value.monto) * (this.tasa) * parseInt(this.prestamoUsuario.value.cuotas)
    console.log(this.prestamoUsuario.value.monto)
    console.log(this.tasa)
    console.log(this.prestamoUsuario.value.cuotas)
    console.log(this.totalPrestamo)

}}
