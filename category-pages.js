const wraps = document.querySelectorAll('.nav-link-wrap');
wraps.forEach((wrap)=>{
  const button = wrap.querySelector('.nav-link');
  const close = () => wrap.classList.remove('is-open');
  button.addEventListener('click', (event)=>{
    event.stopPropagation();
    wraps.forEach((item)=> item !== wrap && item.classList.remove('is-open'));
    wrap.classList.toggle('is-open');
  });
  document.addEventListener('click', (event)=>{
    if(!wrap.contains(event.target)) close();
  });
});

const mobileMenu = document.getElementById('mobile-menu');
document.getElementById('menu-open')?.addEventListener('click', ()=> mobileMenu.classList.add('is-open'));
document.getElementById('menu-close')?.addEventListener('click', ()=> mobileMenu.classList.remove('is-open'));
mobileMenu?.querySelectorAll('a').forEach((link)=> link.addEventListener('click', ()=> mobileMenu.classList.remove('is-open')));

document.querySelectorAll('img').forEach((img)=>{
  img.addEventListener('error', ()=>{
    img.closest('.hero-media, .visual-card, .product-img, figure')?.classList.add('img-fallback');
  });
});
