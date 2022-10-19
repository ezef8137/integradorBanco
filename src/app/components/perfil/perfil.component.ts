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

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    public _datosFirestore: DatosFirebaseService,
    private afs: AngularFirestore) {  }

  ngOnInit(): void {
    this.getMovimientos()
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
        this.guardarUser(this.dataUser)
      }else {
        this.router.navigate(['/login']);
      }
    })
  }

  getMovimientos(){
    this.afs.collection('i0UE4zqwFZhVUzuI4Kgt75jylAt1').snapshotChanges().subscribe(data => {
      this.cualqui = [];
      console.log(this.cualqui)
      data.forEach((element: any) => {
        console.log(element)
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
      movimientos:{}
    }

    const saveUser = (objeUser: any) => {

      this.afs.collection("usuarios").doc(dataUser.uid).set(objeUser).
      then(docRef =>{
          console.log('agrego');
      })
      .catch(error => {
        console.log(error);
      }
      );
      return objeUser;
    }
    saveUser(objeUser);
  }
}
