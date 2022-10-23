import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {
  dataUser: any;
  movimientoUsuario: FormGroup;
  objFirebase: FormGroup;
  datosUsuario: any[] = []
  saldoDis: any

  constructor(
    public _datosService: DatosFirebaseService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private fb:FormBuilder,
    private toastr : ToastrService

  ) {
    this.movimientoUsuario = this.fb.group({
      cbu: ["",Validators.required],
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

  agregarMovimiento(){
    if (this.movimientoUsuario.value.cbu == null || this.movimientoUsuario.value.monto == null){
      this.toastr.error("Ha ingresado un campo incorrecto","Error")
      return;
    }

    if (this.movimientoUsuario.value.cbu == "" || this.movimientoUsuario.value.monto == ""){
      this.toastr.error("Campos sin rellenar","Error")
      return;
    }

    if (String(this.movimientoUsuario.value.cbu).length == 22 && (this.movimientoUsuario.value.monto) > 0){
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
      const usuario = {
        horario: hora + ':' + minutos,
        fecha: dia + ' de ' + meses[mes] + ' de ' + yyy,
        cbu: this.movimientoUsuario.value.cbu,
        monto: "-" + "$" +(this.movimientoUsuario.value.monto),
        motivo: this.movimientoUsuario.value.motivo
      }

      this.afs.collection("usuarios").snapshotChanges().subscribe(data => {
        this.datosUsuario = [];
        data.forEach((element: any) => {
          this.datosUsuario.push({
            uid: element.payload.doc.uid,
            ...element.payload.doc.data()
          })
        })
        console.log(this.datosUsuario)
      });

      const actualizarUsuario = {
        email : this.dataUser.email,
        dinero : parseInt(this.dataUser.dinero) - parseInt(this.movimientoUsuario.value.monto)
      }
      this.afs.collection(this.dataUser.uid).add(usuario);
      this.afs.collection("usuarios").doc(this.dataUser.uid).update(actualizarUsuario)
      this.router.navigate(["/perfil-pantalla"]);
    }else{
      this.toastr.error("Campos incorrectos","Error")}



  }
}

