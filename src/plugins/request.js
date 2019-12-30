import { Service } from "@/plugins/Service";

/* eslint-disable no-undef */
// export function getConfigsByProductId(productId) {
//     return Service({
//       url: '/manager/getConfigsByProductId',
//       params: { productId: productId }
//     })
//   }


export function getMusic() {
    return Service({
        url: '/music',
        method: 'get'
    });
}

export function getMusicID(id) {
    return Service({
        url: '/music/'+id,
        method: 'get'
    });
}