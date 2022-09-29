import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Mensaje } from "src/app/models/interfazmensaje"

import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from "firebase/app"

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[]
  public usuario: any = {}

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((user) => {

      console.log(user)

      if (!user){
        return;
      }

      if (user.displayName == null){
        this.usuario.nombre = user.email;
        this.usuario.uid = user.uid;
      }else{
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      }
    })
   }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy("fecha", "desc").limit(5));
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      this.chats = [];
      for (let mensaje of mensajes){
        this.chats.unshift(mensaje);}
      return this.chats}))
  }

  agregarMensaje( texto:string ){

    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection.add( mensaje );

  }

}