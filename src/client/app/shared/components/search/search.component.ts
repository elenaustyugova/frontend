import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AssessmentModel } from '../../../core/models/assessment-model';

@Component({
  moduleId: module.id,
  selector: 'bs-search',
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  protected _list: AssessmentModel[];
  protected _searchSubscription: any;
  public searchControl: FormControl = new FormControl();
  private _itemsSearch: EventEmitter<AssessmentModel> = new EventEmitter<AssessmentModel>();
  private _items: AssessmentModel[];

  @Input()
  public set items(value: AssessmentModel[]) {
    this._items = value;
  }

  @Output()
  public get itemsSearch(): EventEmitter<AssessmentModel> {
    return this._itemsSearch;
  }

  public ngOnInit() {
    this._list = this._items;
    this._searchSubscription = this.searchControl.valueChanges
      .distinctUntilChanged()
      .switchMap((term: string) => {
        this._items = [];
        return this.update(term);
      })
      .subscribe((item: AssessmentModel) => {
        this._items.push(item);
      });
  }

  public ngOnDestroy() {
    this._searchSubscription.unsubscribe();
  }

  public update(term: string) {
    this._itemsSearch.emit(this._items);

    let items = this._list.filter((e: AssessmentModel) => {
      return new RegExp(term, 'gi').test(e.user.name);
    });
    return Observable.from(items);
  }
}
