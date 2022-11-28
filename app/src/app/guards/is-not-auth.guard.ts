import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserDAOService } from '../services/user-dao.service';

@Injectable({
  providedIn: 'root',
})
export class IsNotAuthGuard implements CanActivate {
  constructor(private userDaoService: UserDAOService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userDaoService.isLoggedIn) {
      this.router.navigateByUrl('/');
    }
    return !this.userDaoService.isLoggedIn;
  }
}
