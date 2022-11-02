import { Injectable } from '@angular/core';
import { FirebaseCodeErrorEnum } from '../utils/firebase-code-error';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCodeErrorService {

  constructor() { }

  codeError(code:string) {
    switch(code){

      case FirebaseCodeErrorEnum.EmailAlreadyInUse:
        return "El usuario ya existe";

      case FirebaseCodeErrorEnum.WeakPassword:
        return "La contraseña es muy debil";

        case FirebaseCodeErrorEnum.InvalidEmail:
        return "correo invalido";

      case FirebaseCodeErrorEnum.WrongPassword:
        return "contraseña incorrecta"

      case FirebaseCodeErrorEnum.UserNotFound:
        return "El usuario no existe"

      default:
        return "error desconocido";
    }

  }
}
