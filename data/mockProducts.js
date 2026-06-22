import { createSlug } from '../utils/createSlug.js';

const imagePool = {
  bordo:['https://images.unsplash.com/photo-1724412613510-c663f14c7481?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1607945432204-89d3cd66bac6?q=80&w=1200&auto=format&fit=crop'],
  ekru:['https://images.unsplash.com/photo-1601832823286-f4dff34eebc7?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1601717355137-4d1c9762cd3b?q=80&w=1200&auto=format&fit=crop'],
  vizon:['https://images.unsplash.com/photo-1601717355137-4d1c9762cd3b?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1627359212239-3d82a215af75?q=80&w=1200&auto=format&fit=crop'],
  yesil:['https://images.unsplash.com/photo-1673908869716-abb13b862661?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1724412613510-c663f14c7481?q=80&w=1200&auto=format&fit=crop'],
  sari:['https://images.unsplash.com/photo-1626386699888-b8865823b279?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1607945432204-89d3cd66bac6?q=80&w=1200&auto=format&fit=crop']
};

const seeds = [
 ['Noir Abaya Takım','Bordo','giyim','takim',2050,2500,18,'bordo',['S','M','L','XL'],true,false],
 ['Pure Etekli İkili Takım','Ekru','giyim','takim',1950,3000,35,'ekru',['S','M','L'],true,true],
 ["Na'i DD Şal",'Vizon','sallar','a-kalite-sallar',999.9,1200,17,'vizon',['Standart'],true,false],
 ['Louve Vual Takım','Küf Yeşili','giyim','takim',999,3500,71,'yesil',['S','M','L','XL'],true,false],
 ['Mila Vual Elbise','Tereyağ Sarısı','giyim','elbise',1999,4000,50,'sari',['S','M','L'],true,true],
 ['Noun Keten Elbise','Doğal','giyim','elbise',1999,3000,33,'vizon',['S','M','L','XL'],true,false],
 ['Alya Krep Tunik','Taş','giyim','ust-giyim',1590,1850,14,'ekru',['S','M','L','XL'],false,true],
 ['Lina Piliseli Etek','Kahve','giyim','alt-giyim',1450,1750,17,'vizon',['S','M','L'],false,true],
 ['Mira Pamuk Şal','Krem','sallar','pamuklu-sallar',849.9,949.9,11,'ekru',['Standart'],false,true],
 ['Sera Saten Şal','Siyah','sallar','muadil-sallar',1050,1250,16,'bordo',['Standart'],true,false],
 ['Nora Kuşaklı Abaya','Antrasit','giyim','ust-giyim',2350,2650,11,'yesil',['S','M','L','XL'],false,true],
 ['Ecrin Vual Elbise','Gül Kurusu','giyim','elbise',2190,2490,12,'sari',['S','M','L'],false,true]
];

export const mockProducts = seeds.map((seed,index)=>{
  const [name,color,categorySlug,subCategorySlug,price,oldPrice,discountPercent,imageKey,sizes,isDiscounted,isNew] = seed;
  const id = `prd-${String(index+1).padStart(3,'0')}`;
  const colors = [{ id:`${id}-color-1`, name:color, hex:['#6f1d24','#ded2b9','#9a8878','#6d7460','#e6cf8d'][index%5] }];
  const variants = sizes.map((size,sizeIndex)=>({ id:`${id}-v${sizeIndex+1}`, productId:id, color, size, stock:8+sizeIndex, price, sku:`SS-${index+1}-${size}` }));
  return {
    id, slug:createSlug(name), sku:`SS-${String(index+1).padStart(4,'0')}`, barcode:`8690000${String(index+1).padStart(5,'0')}`,
    brand:'Sıla Sarıoğlu', name, category:categorySlug === 'sallar' ? 'Şallar' : 'Giyim', categorySlug,
    subCategory:subCategorySlug.replaceAll('-',' '), subCategorySlug, price, oldPrice, discountPercent, currency:'TRY',
    images:imagePool[imageKey], thumbnail:imagePool[imageKey][0], colors, sizes, variants,
    stock:variants.reduce((sum,item)=>sum+item.stock,0), criticalStock:5,
    description:`${color} tonu ve özenli kalıbıyla günlük kullanımdan özel anlara uzanan zarif bir ${name.toLocaleLowerCase('tr-TR')}.`,
    shortDescription:'Rafine doku, rahat kalıp ve zamansız renk dengesi.', fabricInfo:'Mevsimlik, nefes alan seçkin kumaş.',
    measurements:'Ürün ölçüleri bedene göre değişir. Detaylı bilgi için destek ekibimize ulaşabilirsiniz.',
    careInstructions:'30°C hassas programda, benzer renklerle yıkayınız.', paymentOptions:['Kapıda ödeme','Havale / EFT'],
    isFeatured:index < 8, isDiscounted, isNew, isBestSeller:[0,2,4,8].includes(index), freeShipping:price >= 1500,
    status:'active', seoTitle:`${name} | Sıla Sarıoğlu`, seoDescription:`${name} ${color} ürün detayları ve fiyatı.`,
    createdAt:'2026-06-01T10:00:00Z', updatedAt:'2026-06-20T10:00:00Z'
  };
});

