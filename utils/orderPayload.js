import { sanitizeText } from './validators.js';

export function createOrderPayload({formData,items,cargoPrice,subtotal,total}){
  return {
    customer:{
      fullName:sanitizeText(formData.get('fullName'),100),
      phone:sanitizeText(formData.get('phone'),30),
      email:sanitizeText(formData.get('email'),120)
    },
    shippingAddress:{
      city:sanitizeText(formData.get('city'),60),
      district:sanitizeText(formData.get('district'),60),
      address:sanitizeText(formData.get('address'),400),
      deliveryMethod:formData.get('deliveryMethod')
    },
    items:items.map(item=>({productId:item.productId,variantId:item.variantId,quantity:item.quantity,unitPrice:item.unitPrice})),
    paymentMethod:formData.get('paymentMethod'),
    cargoPrice,
    subtotal,
    discountTotal:0,
    total,
    note:sanitizeText(formData.get('note'),500)
  };
}
