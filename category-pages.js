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
function openMobileMenu(){
  if(!mobileMenu) return;
  mobileMenu.hidden = false;
  mobileMenu.inert = false;
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(()=> mobileMenu.classList.add('is-open'));
}
function closeMobileMenu(){
  if(!mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  mobileMenu.inert = true;
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(()=>{
    if(!mobileMenu.classList.contains('is-open')) mobileMenu.hidden = true;
  }, 380);
}
document.getElementById('menu-open')?.addEventListener('click', openMobileMenu);
document.getElementById('menu-close')?.addEventListener('click', closeMobileMenu);
mobileMenu?.querySelectorAll('a').forEach((link)=> link.addEventListener('click', closeMobileMenu));

document.querySelectorAll('img').forEach((img)=>{
  img.addEventListener('error', ()=>{
    img.closest('.hero-media, .visual-card, .product-img, figure')?.classList.add('img-fallback');
  });
});
