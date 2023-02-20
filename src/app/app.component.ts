import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { PokeApiService } from './services/poke-api.service';
import { OnInit, OnDestroy } from '@angular/core';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { Pokemon } from './types/Pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[];
  fetching = false;
  offset = 0;

  onDestroy$ = new Subject();

  constructor(private apiService: PokeApiService) {
    this.pokemons = [];
  }

  ngOnInit(): void {
    this.apiService.fetchPokemons();

    this.apiService.fetching
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.fetching = data;
      });

    this.apiService.pokemons
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.pokemons = data;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next('destroyed');
    this.onDestroy$.complete();
  }

  fetchNextPokemons() {
    this.offset += 20;
    this.apiService.fetchPokemons(this.offset);
  }

  fetchPreviousPokemons() {
    this.offset -= 20;
    this.apiService.fetchPokemons(this.offset < 0 ? 0 : this.offset);
  }
}
