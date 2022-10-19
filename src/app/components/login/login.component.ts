import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import {GoogleAuthProvider , GithubAuthProvider, OAuthProvider, getAuth, FacebookAuthProvider, signInWithPopup} from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {
  loginUsuario: FormGroup;

  constructor(
  private fb:FormBuilder,
  private afAuth:AngularFireAuth,
  private toastr: ToastrService,
  private router: Router,
  private firebaseError: FirebaseCodeErrorService
  ) {
    this.loginUsuario=this.fb.group({
      email: ["",Validators.required],
      password:["",Validators.required]
    })
  }

  

  ngOnInit(): void {
  }
  login(){
    const email= this.loginUsuario.value.email;
    const password=this.loginUsuario.value.password;
    
    this.afAuth.signInWithEmailAndPassword(email,password).then((user)=>{
      if (user.user?.emailVerified ){
        this.router.navigate(["/perfil-pantalla"]);
      } else {
        this.router.navigate(["/verificar-correo"]);
      }
    }).catch((error)=>{
      this.toastr.error(this.firebaseError.codeError(error.code),"Error");
      console.log(error)
    })
  }
    

    loginGoogle(){
      this.afAuth.signInWithPopup(new GoogleAuthProvider)
      .then(result =>{
        this.router.navigate(['/dashboard']);})
      .catch(error => {
          console.log(error);
          this.toastr.error(this.firebaseError.codeError(error.code), 'error');
        })
    }
    loginGitHub() {
      const provider = new GithubAuthProvider();
      this.afAuth.signInWithPopup(provider).then(user =>{
        this.router.navigate(['/dashboard']);
        const userr = user.user;
        //console.log(user);
  
       
      }).catch(error=>{
        //console.log(error);
        this.toastr.error(this.firebaseError.codeError(error.code), 'error');
      })
    }

    
    
    loginFacebook() {
      const provider = new FacebookAuthProvider();
      const auth = getAuth();
  
    signInWithPopup(auth, provider)
    .then((user) => {
  
      // The signed-in user info.
      const userr = user.user;
      this.router.navigate(['/dashboard']);
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(user);
      console.log(userr);
  
    })
    
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
  
      // ...
    });

      
    }}
