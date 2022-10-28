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
  interesesPrestamo: any
  totalPrestamo: any
  tasa: number
  entradaPrestamo: any[] = []
  prestamoMovimiento: any

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
      cbu: ["", Validators.required],
      total: [""]
    })
   }

  // Interés simple = Préstamo x Tasa de interés x Períodos a pagar
  // $500 x 0,03 x 6 meses
  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
      }else {
        this.router.navigate(['/login']);
      }
    })
  }

  pedirPrestamo(){
    if ((this.dataUser.uid) == (this.prestamoUsuario.value.cbu)){
      this._datosService.getUsuarioAll().subscribe(entrada => {
        entrada.forEach((element: any) => {
          if ((element.payload.doc.data()["cbu"]) == this.dataUser.uid){
            this.entradaPrestamo.push({
              cbu: element.payload.doc.data()["cbu"],
              dinero: element.payload.doc.data()["dinero"],
              email: element.payload.doc.data()["email"],
            })
          }
        })
      })

      this.prestamoMovimiento = {
        cbu: this.entradaPrestamo[0].cbu,
        dinero: (this.entradaPrestamo[0].dinero) + (this.totalPrestamo),
        email: this.entradaPrestamo[0].email,
      }

      var meses = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"]
      var date = new Date();
      var hora = date.getHours();
      var minutos = date.getMinutes();
      var dia = date.getDate();
      var mes = date.getMonth();
      var yyy = date.getFullYear();

      const movimientoDestino = {
        horario: hora + ':' + minutos,
        fecha: dia + ' de ' + meses[mes] + ' de ' + yyy,
        cbu: "Bank Felc",
        monto: "+" + "$" +(this.totalPrestamo),
        motivo: "Préstamo"
      }

      this._datosService.updateUsuario(this.prestamoMovimiento.cbu, this.prestamoMovimiento)
      .then(() => {
        this.afs.collection(this.entradaPrestamo[0].cbu).add(movimientoDestino);
      })

      this.router.navigate(["/perfil-pantalla"]);

    } else {
      this.toastr.error("Ingrese su respectivo cbu", "Error CBU")
    }

  }

  calcularPrestamo(){
    if (this.prestamoUsuario.value.cuotas == "6"){
      this.tasa = 0.04
    } else if (this.prestamoUsuario.value.cuotas == "12"){
      this.tasa = 0.05
    }else if (this.prestamoUsuario.value.cuotas == "18"){
      this.tasa = 0.06
    } else {
      this.tasa = 0.07
    }
    this.interesesPrestamo = (this.prestamoUsuario.value.monto) * (this.tasa) * parseInt(this.prestamoUsuario.value.cuotas)
    this.totalPrestamo = parseInt(this.prestamoUsuario.value.monto) + parseInt(this.interesesPrestamo)
    this.prestamoUsuario.setValue({
      monto: this.prestamoUsuario.value.monto,
      cuotas: this.prestamoUsuario.value.cuotas,
      cbu: this.prestamoUsuario.value.cbu,
      total: "Total a pagar: " + "$" + (this.totalPrestamo).toString()
    })
}}
