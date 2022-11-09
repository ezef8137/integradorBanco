import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { DatosFirebaseService } from 'src/app/services/datos-firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from "jspdf"
import html2canvas from 'html2canvas';
import { NgxChartsModule } from "@swimlane/ngx-charts"

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;
  dataUser: any;
  mostrarTabla: any[] = []
  users: any[] = []
  movimientos: [];
  listaUsers: any= []
  objeUser:any
  uid: any
  $:any;
  saldoDis: any
  cbu: any
  entradaDatos: any[] = []
  cbuExiste: boolean = false;
  loading: boolean=false
  view: [number, number] = [800, 500];
  datosGrafico:any[]=[]
  opcionesGrafico: any
  optSupermercado: any
  optServicios: any
  optIndumentaria: any
  optVarios: any
  data: any

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    public _datosFirestore: DatosFirebaseService,
    private afs: AngularFirestore) {
     }


  ngOnInit(): void {
    setTimeout(()=>{this.loading=true;}, 10000);
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
        this.uid = this.dataUser.uid
        this.guardarUser(this.dataUser)
        this.getMovimientos()
        this.grafico()
      }else {
        this.router.navigate(['/login']);
      }
    })
  }

  get single() {
    return this.datosGrafico;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  public openPDF(): void {
    const doc= new jsPDF();
    const logo= new Image();
    logo.src="https://cdn-icons-png.flaticon.com/512/8176/8176383.png"
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 210;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(logo,"PNG",10,5,15,15)
      PDF.setFontSize(20);
      PDF.setFont("helvetica", "bold");
      PDF.text("BANK FELCS",80,10)
      PDF.text("ULTIMOS MOVIMIENTOS",60,30)
      let position =40;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('BankFelcs.pdf');

    });
  }

  grafico(){
      this.afs.collection((this.dataUser.uid).toString()).snapshotChanges().subscribe(entrada => {
        this.optSupermercado = 0
        this.optVarios = 0
        this.optIndumentaria = 0
        this.optServicios = 0
        entrada.forEach((element: any) => {
          const str = element.payload.doc.data()["monto"]
          const newStr = str.slice(1)
          const newNewStr = newStr.slice(1) // variable que contiene el monto en string sin signos
          if ((element.payload.doc.data()["motivo"]) == "Supermercado"){
            this.optSupermercado = parseInt(this.optSupermercado) + parseInt(newNewStr)
          } else if ((element.payload.doc.data()["motivo"]) == "Varios"){
            this.optVarios = parseInt(this.optVarios) + parseInt(newNewStr)
          } else if ((element.payload.doc.data()["motivo"]) == "Servicios"){
            this.optServicios = parseInt(this.optServicios) + parseInt(newNewStr)
          } else if ((element.payload.doc.data()["motivo"]) == "Indumentaria"){
            this.optIndumentaria = parseInt(this.optIndumentaria) + parseInt(newNewStr)
          }
        })

        const objsuper = {
          name: "Supermercado",
          value: this.optSupermercado
        }

        const objvarios = {
          name: "Varios",
          value: this.optVarios
        }

        const objservicios = {
          name: "Servicios",
          value: this.optServicios
        }

        const objindumentaria = {
          name: "Indumentaria",
          value: this.optIndumentaria
        }

        this.datosGrafico = [objindumentaria, objservicios, objsuper, objvarios]
        console.log(this.datosGrafico)

        }
      )
  }


  getMovimientos(){
      this.afs.collection((this.uid).toString(), ref => ref.orderBy('fecha', 'desc').limit(6)).snapshotChanges().subscribe(data => {
      this.mostrarTabla = [];
      data.forEach((element: any) => {
        this.mostrarTabla.push({
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
          this.cbuExiste = true
          this.saldoDis = (element.payload.doc.data()["dinero"])
          this.cbu = (element.payload.doc.data()["cbu"])
        }
      })
      if (this.cbuExiste == true){
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
