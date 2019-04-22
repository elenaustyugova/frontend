import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { AppRoute } from '../../models/app-routes.model';
import { BreadcrumbService } from '../../services/breadcrumb.service';

export interface IBreadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'bs-breadcrumb',
  templateUrl: 'breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  private _breadcrumbs: IBreadcrumb[];

  public get breadcrumbs(): IBreadcrumb[] {
    return this._breadcrumbs;
  }

  constructor(protected _router: Router,
              protected _breadcrumbService: BreadcrumbService) {
    this._breadcrumbs = [];
  }

  public ngOnInit() {
    this._updateBreadcrumbs();

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => this._updateBreadcrumbs());

    this._breadcrumbService.override.subscribe((breadcrumbs: IBreadcrumb[]) => {
      this._breadcrumbs.splice(this._breadcrumbs.length - 1, 1, ...breadcrumbs);
    });
  }

  private _updateBreadcrumbs() {
    let child = this._router.routerState.snapshot.root.firstChild;
    let path: string[] = [];

    let newState: IBreadcrumb[] = [];

    while (child) {
      let routeConfig = <AppRoute> child.routeConfig;
      let label = this._extractRouteName(child);
      let parts: string[] = child.url.map(x => x.path);

      path = path.concat(parts);

      if (!routeConfig.breadcrumbIgnore) {
        newState.push({
          label,
          url: `/${path.join('/')}`
        });
      }

      child = child.firstChild;
    }

    this._breadcrumbs = newState;
  }

  private _extractRouteName(route: ActivatedRouteSnapshot) {
    let name = (<AppRoute> route.routeConfig).breadcrumb;
    return name || this._prepareRouteName(route.url.join('/'));
  }

  private _prepareRouteName(name: string) {
    let firstSplit, secondSplit: string;
    if (name.length > 0) {
      firstSplit = name.split(' ').map(this._capitalizeFirstLetter).join('');
      secondSplit = firstSplit.split(/(?=[A-Z])/).join(' ');
    }
    return secondSplit || name;
  }

  private _capitalizeFirstLetter(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }
}
