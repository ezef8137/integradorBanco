import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosFirebaseService {

  constructor(private firestore: AngularFirestore) { }

  addUsuario(usuario: any): Promise<any> {
    return this.firestore.collection('usuarios').add(usuario);
  }

  getUsuariosTabla(): Observable<any> {
    return this.firestore.collection('usuarios', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  

  deleteUsuario(id: string): Promise<any> {
    return this.firestore.collection('usuarios').doc(id).delete();
  }

  getUsuario(id: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(id).snapshotChanges();
  }

  updateUsuario(id: string, data:any): Promise<any> {
    return this.firestore.collection('usuarios').doc(id).update(data);
  }

}

