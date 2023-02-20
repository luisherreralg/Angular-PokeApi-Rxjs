import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, BehaviorSubject, switchMap } from 'rxjs';
import { Pokemon } from '../types/Pokemon';
import { PokemonList } from '../types/PokemonList';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  apiUrl = 'https://pokeapi.co/api/v2/';

  pokemons = new BehaviorSubject<Pokemon[]>([]);

  fetching = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  private getPokemonList(offset: number): Observable<PokemonList> {
    this.fetching.next(true);
    return this.http.get(
      this.apiUrl + `pokemon?limit=20&offset=${offset}/`
    ) as Observable<PokemonList>;
  }

  private getPokemon(names: string[]): Observable<Pokemon[]> {
    const requests: Observable<Pokemon>[] = [];
    names.forEach((name) => {
      requests.push(
        this.http.get(this.apiUrl + 'pokemon/' + name) as Observable<Pokemon>
      );
    });

    return forkJoin(requests);
  }

  fetchPokemons(offset: number = 0) {
    this.getPokemonList(offset)
      .pipe(
        switchMap((data) => {
          const pokemonList: string[] = data.results.map((pokemon) => {
            return pokemon.name;
          });

          return this.getPokemon(pokemonList);
        })
      )
      .subscribe((data) => {
        this.pokemons.next(data);
        this.fetching.next(false);
      });
  }
}
