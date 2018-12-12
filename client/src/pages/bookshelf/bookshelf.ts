import { Component, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RegisteredBook } from '../../app/models/registered-book';
import { State } from '../../app/state/_state.interfaces';
import { WatchBookshelf } from '../../app/state/bookshelf/bookshelf.action';
import { getBooks } from '../../app/state/_state.selectors';

enum Fragment {
  Library,
  Search
}

@Component({
  selector: 'page-bookshelf',
  templateUrl: 'bookshelf.html'
})
export class BookshelfPage {
  books$: Observable<RegisteredBook[]>;
  additions = [];
  private length = 0;
  fragment: Fragment = Fragment.Library;
  showSearchCancelButton = true;
  text = '';
  @ViewChild('libraryFragment') libraryFragment;
  @ViewChild('searchFragment') searchFragment;

  constructor(private store: Store<State>) {}

  ionViewDidLoad() {
    window.addEventListener('resize', () => this.adjustThumbnails());

    this.store.dispatch(new WatchBookshelf());

    this.books$ = this.store.pipe(
      select(getBooks),
      map(books => {
        this.length = books.length;
        this.adjustThumbnails();
        return books;
      })
    );
  }

  switchFragment(to = Fragment.Search) {
    this.libraryFragment.nativeElement.style.display =
      to === Fragment.Search ? 'none' : 'block';

    this.searchFragment.nativeElement.style.display =
      to === Fragment.Search ? 'block' : 'none';

    this.fragment = to;
  }

  adjustThumbnails() {
    const firstThumbnail = document.getElementsByClassName('book-thumbnail')[0];
    if (firstThumbnail === void 0) return;

    const booksRow = document.getElementById('books-row'),
      bookWidth = parseInt(
        window.getComputedStyle(firstThumbnail).width as string,
        10
      ),
      columns = Math.floor(
        parseInt(
          window.getComputedStyle(booksRow as HTMLElement).width as string,
          10
        ) /
          (bookWidth + 10)
      );

    if (columns > this.length) {
      this.additions = [];
      return;
    }

    const rest = this.length % columns;
    if (rest === 0) return;

    const diff = columns - rest;

    if (diff > this.additions.length) {
      Array.prototype.push.apply(
        this.additions,
        new Array(diff - this.additions.length)
      );
    } else if (diff < this.additions.length) {
      this.additions.splice(0, this.additions.length - diff);
    }
  }

  updateText() {
    console.log(`Update: ${this.text}`);
  }

  blur() {
    if (this.text !== '') return;
    this.onCancelSearch();
  }

  onCancelSearch() {
    this.switchFragment(Fragment.Library);
  }
}
