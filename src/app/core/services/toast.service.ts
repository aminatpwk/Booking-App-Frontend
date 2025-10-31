import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {

  }

  showSuccess(message: string, title: string){
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-right'
    });
  }

  showWarning(title: string, message: string){
    this.toastr.warning(title, message, {
      positionClass: 'toast-bottom-right'
    });
  }

  showError(title: string, message: string){
    this.toastr.error(title, message, {
      positionClass: 'toast-bottom-right'
    });
  }

  showInfo(title: string, message: string){
    this.toastr.info(title, message, {
      positionClass: 'toast-bottom-right'
    })
  }
}
