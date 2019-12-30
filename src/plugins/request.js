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