import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldValue } from 'firebase/firestore';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {
  dataUser: any;
  movimientoUsuario: FormGroup;
  objFirebase: FormGroup;

  constructor(
    public _datosService: DatosFirebaseService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private fb:FormBuilder

  ) {
    this.movimientoUsuario=this.fb.group({
      cuil: ["",Validators.required, Validators.minLength(11), Validators.maxLength(11)],
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
    const cuil = this.movimientoUsuario.value.cuil;
    const monto = this.movimientoUsuario.value.monto;
    const motivo = this.movimientoUsuario.value.motivo;

    var meses = [
      "Enero", "Febrero", "Marzo",
      "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre",
      "Noviembre", "Diciembre"
    ]
    var date = new Date();
    var hora= date.getHours();
    var minutos=date.getMinutes();
    var dia = date.getDate();
    var mes = date.getMonth();
    var yyy = date.getFullYear();
    var fecha_formateada = dia + ' de ' + meses[mes] + ' de ' + yyy;
    const usuario = {
      horario: hora + ':' + minutos,
      fecha: fecha_formateada,
      cuil: cuil,
      monto: monto,
      motivo: motivo
    }
      this.afs.collection(this.dataUser.uid).add(usuario);
      this.router.navigate(["/perfil-pantalla"]);
  }
}

