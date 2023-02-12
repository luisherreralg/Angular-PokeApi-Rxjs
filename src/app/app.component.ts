import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { PokeApiService } from './services/poke-api.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pokemon } from './types/Pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[];
  fetching = false;

  private activeSubscription: Subscription[] = [];

  constructor(private apiService: PokeApiService) {
    this.pokemons = [];
  }

  ngOnInit(): void {
    this.apiService.fetchPokemons();

    this.activeSubscription.push(
      this.apiService.fetching.subscribe((data) => {
        this.fetching = data;
      })
    );

    this.activeSubscription.push(
      this.apiService.pokemons.subscribe((data) => {
        this.pokemons = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.activeSubscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
