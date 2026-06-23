# Backend TODO

- Backend cart şu an authenticated kullanıcı için memory `Map` ile tutuluyor.
- Bu guest karışmasını çözer ama production kalıcılığı sağlamaz.
- Production’da kalıcı sepet istenirse Prisma schema’ya `Cart` ve `CartItem` modelleri eklenecek.
- Şu aşamada checkout/order akışı öncelikli olduğu için cart persistence sonraki faza bırakıldı.
