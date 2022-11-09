import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { ToastrService } from 'ngx-toastr';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { async } from '@firebase/util';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {
[x: string]: any;
  dataUser: any;
  movimientoUsuario: FormGroup;
  objFirebase: FormGroup;
  datosUsuario: any[] = []
  saldoDis: any
  entradaDatosOrigen: any[] = []
  entradaDatosDestino: any[] = []
  cuentaEnviarDinero: {}
  flagExisteUsuario:boolean=false
  enviarMail: any;

  constructor(
    public _datosService: DatosFirebaseService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private fb:FormBuilder,
    private toastr : ToastrService

  ) {
    this.movimientoUsuario = this.fb.group({
      cbu: ["", [Validators.required, Validators.minLength(28), Validators.maxLength(28)]],
      monto:["",Validators.required],
      motivo:["", Validators.required]
    })
    }

  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
      }else {
        this.router.navigate(['/login']);
      }
    })}



  sendEmail(){
    emailjs.send("service_9jvpp0i","template_9rf3u5h",{
      email: (this.dataUser.email).toString(),
      cbu: (this.movimientoUsuario.value.cbu).toString(),
      monto: "$" + (this.movimientoUsuario.value.monto).toString(),
      motivo: (this.movimientoUsuario.value.motivo).toString(),
      }, "GuwaSO_4AvHJqnKYB")
      .then((res) => {
        this.toastr.success("Se ha enviado un comprobante a su correo electronico.","Transacción éxitosa")
      })

    this._datosService.getUsuarioAll().subscribe(entrada => {
      entrada.forEach((element: any) => {
        if ((element.payload.doc.data()["cbu"]) == this.movimientoUsuario.value.cbu){
          this.enviarMail.push({
            email: element.payload.doc.data()["email"]
          })
        }})

      emailjs.send("service_9jvpp0i","template_9rf3u5h",{
        email: (this.enviarMail[0].email).toString(),
        cbu: (this.dataUser.uid).toString(),
        monto: "$" + (this.movimientoUsuario.value.monto).toString(),
        motivo: (this.movimientoUsuario.value.motivo).toString(),
        }, "GuwaSO_4AvHJqnKYB")
        .then((res) => {
        })
      })
  }

  encontrarCbu(){
    this._datosService.getUsuarioAll().subscribe(entrada => { // valido que el cbu exista en el sistema
      entrada.forEach((element: any) => {
        if ((element.payload.doc.data()["cbu"]).toString() == (this.movimientoUsuario.value.cbu).toString()){
          this.flagExisteUsuario = true
        }})
      if (this.flagExisteUsuario == false){
        this.toastr.error("El cbu no existe en nuestro sistema.","Error")
        return;
      }
      })

  }

  agregarMovimiento(){
    this.encontrarCbu()

    if (this.movimientoUsuario.value.cbu == this.dataUser.uid){
      this.toastr.error("No se puede enviar dinero usted mismo","Error")
      return;
    }

    if (this.movimientoUsuario.value.cbu == null || this.movimientoUsuario.value.monto == null){
      this.toastr.error("Ha ingresado un campo incorrecto","Error")
      return;
    }

    if (this.movimientoUsuario.value.cbu == "" || this.movimientoUsuario.value.monto == ""){
      this.toastr.error("Campos sin rellenar","Error")
      return;
    }

    if (this.movimientoUsuario.value.motivo == "" || this.movimientoUsuario.value.motivo == null){
      this.toastr.error("Campos sin rellenar","Error")
      return;
    }

    if (String(this.movimientoUsuario.value.cbu).length == 28 && (this.movimientoUsuario.value.monto) > 0){
      var meses = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"]
      var date = new Date();
      var hora = date.toLocaleTimeString();
      var dia = date.getDate();
      var mes = date.getMonth();
      var yyy = date.getFullYear();
      const movimientoOrigen = {
        horario: hora,
        fecha: dia + ' de ' + meses[mes] + ' de ' + yyy,
        cbu: this.movimientoUsuario.value.cbu,
        monto: "-" + "$" +(this.movimientoUsuario.value.monto),
        motivo: this.movimientoUsuario.value.motivo
      }

      const movimientoDestino = {
        horario: hora,
        fecha: dia + ' de ' + meses[mes] + ' de ' + yyy,
        cbu: this.dataUser.uid,
        monto: "+" + "$" +(this.movimientoUsuario.value.monto),
        motivo: "Transferencia"
      }

      this._datosService.getUsuarioAll().subscribe(entrada => {
        entrada.forEach((element: any) => {
          if ((element.payload.doc.data()["cbu"]) == this.dataUser.uid){
            this.entradaDatosOrigen.push({
              cbu: element.payload.doc.data()["cbu"],
              dinero: element.payload.doc.data()["dinero"],
              email: element.payload.doc.data()["email"],
            })
          }

          if ((element.payload.doc.data()["cbu"]) == this.movimientoUsuario.value.cbu){
            this.entradaDatosDestino.push({
              cbu: element.payload.doc.data()["cbu"],
              dinero: element.payload.doc.data()["dinero"],
              email: element.payload.doc.data()["email"],
            })

          }

        })})

        let personaOrigen = {
          cbu: this.entradaDatosOrigen[0].cbu,
          dinero: (this.entradaDatosOrigen[0].dinero) - (this.movimientoUsuario.value.monto),
          email: this.entradaDatosOrigen[0].email,
        }

        let personaDestino = {
          cbu: this.entradaDatosDestino[0].cbu,
          dinero: (this.entradaDatosDestino[0].dinero) + (this.movimientoUsuario.value.monto),
          email: this.entradaDatosDestino[0].email,
        }

        if (personaOrigen.dinero < 0){
          this.toastr.error("No puede realizar la transaccion porque no cuenta con suficiente dinero","Error")
        } else{

          this._datosService.updateUsuario(this.entradaDatosDestino[0].cbu, personaDestino)
          .then(() => {
            this.afs.collection(this.entradaDatosDestino[0].cbu).add(movimientoDestino);
          })

          this._datosService.updateUsuario(this.entradaDatosOrigen[0].cbu, personaOrigen)
            .then(entrada => {
              this.afs.collection(this.dataUser.uid).add(movimientoOrigen);
            })


          //this.sendEmail()
          this.router.navigate(["/perfil-pantalla"]);
        }
    }else{
      this.toastr.error("Campos incorrectos","Error")}
  }
}

