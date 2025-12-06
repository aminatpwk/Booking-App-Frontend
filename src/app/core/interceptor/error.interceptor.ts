import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {ToastService} from '../services/toast.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {catchError, throwError} from 'rxjs';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      if(error.error instanceof ErrorEvent){
        errorMessage = `Error: ${error.error.message}`;
      }else{
        switch(error.status){
          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            toastService.showError('Bad Request', errorMessage);
            break;
          case 401:
            errorMessage = 'Your session has expired. Please login again.';
            toastService.showError('Unauthorized', errorMessage);
            authService.logOut();
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            toastService.showError('Forbidden', errorMessage);
            router.navigate(['/']);
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            toastService.showError('Server Error', errorMessage);
            break;
          default:
            errorMessage = error.error?.message || `Error Code: ${error.status}`;
            toastService.showError('Error', errorMessage);
        }
      }

      return throwError(() => error);
    })
  );
};
