import { DateTime } from '/node_modules/luxon/build/es6/luxon.js';

const ID_CACHE_CATEGORIAS = 'cache-categorias';


export function recuperaCategoriasNoCache() {
    let cache = localStorage.getItem(ID_CACHE_CATEGORIAS);

    if (cache) {
        cache = JSON.parse(cache);

        let agora = DateTime.now();
        let horaDoCache = DateTime.fromISO(cache.timestamp).plus({ seconds: 10 });

        if (horaDoCache.toMillis() > agora.toMillis()) {
            return cache.payload;
        } else {
            return null;
        }
    }
}

export function armazenaCategorias(categorias) {
    let dadosDoCache = {
        timestamp: DateTime.now().toISO(),
        payload: categorias 
    };
    
    localStorage.setItem(ID_CACHE_CATEGORIAS, JSON.stringify(dadosDoCache));
}

