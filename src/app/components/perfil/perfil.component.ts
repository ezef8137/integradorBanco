import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { users } from 'src/app/models/users';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  dataUser: any;
  cualqui: any[] = []
  movimientos: [];
  listaUsers: any= []
  objeUser:any
  uid: any
  saldoDis: any

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    public _datosFirestore: DatosFirebaseService,
    private afs: AngularFirestore) {  }

  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
        this.uid = this.dataUser.uid
        this.guardarUser(this.dataUser)
        this.getMovimientos()
      }else {
        this.router.navigate(['/login']);
      }
    })
  }

  getMovimientos(){
    this.afs.collection((this.uid).toString(), ref => ref.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(data => {
      this.cualqui = [];
      data.forEach((element: any) => {
        this.cualqui.push({
          uid: element.payload.doc.uid,
          ...element.payload.doc.data()
        })
      });

    });
  }

  guardarUser(dataUser: any) {
    const objeUser = {
      email: dataUser.email,
      dinero: 500
    }

    const saveUser = (objeUser: any) => {

      this.afs.collection("usuarios").doc(dataUser.uid).set(objeUser).
      then(docRef =>{
          this.saldoDis = String(objeUser.dinero)
      })
      .catch(error => {
      }
      );
      return objeUser;
    }
    saveUser(objeUser);
  }
}
