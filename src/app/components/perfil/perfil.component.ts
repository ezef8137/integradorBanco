import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
// import { jsPDF } from "jspdf"

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;

  dataUser: any;
  cualqui: any[] = []
  users: any[] = []
  movimientos: [];
  listaUsers: any= []
  objeUser:any
  uid: any
  $:any;
  saldoDis: any
  cbu: any
  mensaje: any
  entradaDatos: any[] = []
  codigoExiste: boolean = false;
  loading: boolean=false

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    public _datosFirestore: DatosFirebaseService,
    private afs: AngularFirestore) {  }

  ngOnInit(): void {
    setTimeout(()=>{this.loading=true;}, 3000);
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

  public openPDF(): void {
    const doc= new jsPDF();
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 210;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position =40;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Bank-Felcs.pdf');
      
    });
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

          this.afs.collection("usuarios").doc(dataUser.uid).set(objeUser)
          .then(docRef =>{
              this.saldoDis = String(objeUser.dinero)
              this.cbu = String(objeUser.cbu)
          })
          .catch(error => {});
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
