import { Service } from "@/plugins/Service";

/* eslint-disable no-undef */
// export function getConfigsByProductId(productId) {
//     return Service({
//       url: '/manager/getConfigsByProductId',
//       params: { productId: productId }
//     })
//   }


export function getMusic(id) {
    if (!id) {
        return Service({
            url: '/music',
            method: 'get'
        });
    } else {
        return Service({
            url: '/music/' + id,
            method: 'get'
        });
    }
}

export function SearchTitle(value) {
    return Service({
        url: '/music/search?key='+value,
        method: 'get'
    });
}

export function SearchAnime(value) {
    return Service({
        url: '/anime/search?key='+value,
        method: 'get'
    });
}