import { Categoria } from './modelo-classes.js';
import { DateTime } from 'luxon';

const ID_CACHE_CATEGORIAS = 'cache-categorias';

type Cache = {
    timestamp: string,
    payload: any
};

export function recuperaCategoriasNoCache(): Categoria[] {
    let cacheString = localStorage.getItem(ID_CACHE_CATEGORIAS);

    if (cacheString) {
        let cache = JSON.parse(cacheString) as Cache;

        let agora = DateTime.now();
        let horaDoCache = DateTime.fromISO(cache.timestamp).plus({ seconds: 10 });

        if (horaDoCache.toMillis() > agora.toMillis()) {
            return cache.payload.forEach((json: any) => new Categoria(json._nome, json._status, new Date(json._criacao), json._id));
        } else {
            return null;
        }
    }
}

export function armazenaCategorias(categorias: Categoria[]): void {
    let dadosDoCache: Cache = {
        timestamp: DateTime.now().toISO(),
        payload: categorias 
    };
    
    localStorage.setItem(ID_CACHE_CATEGORIAS, JSON.stringify(dadosDoCache));
}

export function limpaCacheCategorias(): void {
    localStorage.removeItem(ID_CACHE_CATEGORIAS);
}

