import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { users } from 'src/app/models/users';
import { ToastrService } from 'ngx-toastr';
// import { jsPDF } from "jspdf"

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
  cbu: any
  mensaje: any
  entradaDatos: any[] = []
  codigoExiste: boolean = false

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
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
      this.afs.collection((this.uid).toString(), ref => ref.orderBy('fecha', 'desc').limit(6)).snapshotChanges().subscribe(data => {
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
    this.afs.collection("usuarios").snapshotChanges().subscribe(data => {
      data.forEach((element: any) => {
        if ((element.payload.doc.data()["cbu"]) == this.uid){
          this.codigoExiste = true
          this.saldoDis = (element.payload.doc.data()["dinero"])
          this.cbu = (element.payload.doc.data()["cbu"])
        }
      })
      if (this.codigoExiste == true){
        this._datosFirestore.getUsuario(dataUser.uid).subscribe( datos => {
        })
        return;
      }else{
        const objeUser = {
          email: dataUser.email,
          dinero: 500,
          cbu: dataUser.uid
        }

        const saveUser = (objeUser: any) => {

          this.afs.collection("usuarios").doc(dataUser.uid).set(objeUser).
          then(docRef =>{
              this.saldoDis = String(objeUser.dinero)
              this.cbu = String(objeUser.cbu)
          })
          .catch(error => {
          }
          );
          return objeUser;
        }
        saveUser(objeUser);
      }
    });

  }
  //enviarPdf(){
  //  const doc = new jsPDF();
  //  doc.text("", 10, 10);
  //  doc.text("Hello world!", 10, 10);
  //  doc.save("movBankFelcs.pdf");
  //}

  copyMessage(){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.cbu;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.toastr.success("El CVU se ha copiado al portapapeles","");
    document.execCommand('copy')
    document.body.removeChild(selBox);
  }
}
