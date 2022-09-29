import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { users } from "src/app/models/users";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { Mensaje } from "src/app/models/interfazmensaje"
import { map, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dahsboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataUser: any;
  listaUsers : any = [];
  itemsCollection: AngularFirestoreCollection<Mensaje>;
  mensaje: string="";
  elemento: any

  constructor(
    public cs: ChatService,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore : AngularFirestore
    ) {
      this.cs.cargarMensajes().subscribe( () => {
        setTimeout( ()=> {this.elemento.scrollTop = this.elemento.scrollHeight}, 20)}  )
     }

  enviarMensaje(){
    if (this.mensaje.length === 0){
      return;
    }

    this.cs.agregarMensaje(this.mensaje)
    .then( ()=>{this.mensaje = ""} )
    .catch( (err)=>{console.log(alert("err"))} )
  }

  ngOnInit(): void {
    this.elemento = document.getElementById("app-mensajes")
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
      }else {
        this.router.navigate(['/login']);
      }
    })
  }

  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }

  guardarUser(usersDatos: any) {
    const objeUser = {
      email: usersDatos.email,
      uid: usersDatos.uid,
      conectado: true,
    }

    const saveUser = (objeUser: any) => {

      this.firestore.collection("user").add(objeUser).
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

  leerUsuarios(dataUser: any) {
    const lectura = this.firestore.collection('user').get().toPromise();

    lectura.then((resp) => {

      const document = resp?.docs;
      for(let objet of document!) {
        let datosUser = new users();
        const dts:any = objet.data();

        datosUser.email = dts.email;
        datosUser.uid = dts.uid;
        datosUser.conectado =dts.conectado

        this.listaUsers.push(datosUser);

      }

      let existeUsuario = false;
      for(let unUser of this.listaUsers) {
        if(unUser.email == dataUser.email) {
          console.log(unUser.email +'==' + dataUser.email);
          existeUsuario = true;
          break
        }
      }
      if(existeUsuario == false){
        this.guardarUser(dataUser);
        console.log('sin coincidencia' + dataUser.email)
      }

    }).catch(error => console.log(error));

  }

}