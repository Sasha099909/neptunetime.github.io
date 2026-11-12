document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(toggle&&nav) toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false')});
  document.querySelectorAll('[data-copy]').forEach(button=>{
    button.addEventListener('click',async()=>{
      const value=button.dataset.copy;const status=button.parentElement.querySelector('.copy-status');
      try{await navigator.clipboard.writeText(value);if(status)status.textContent='IP скопирован! Вставь его в Minecraft.';button.textContent='Скопировано ✓'}
      catch(e){if(status)status.textContent='Не удалось скопировать автоматически: '+value}
      setTimeout(()=>{button.textContent='Скопировать IP'},2200);
    });
  });
});

  // Smooth fade between local pages; same-page anchors remain native and instant.
  document.querySelectorAll('a[href]').forEach(link=>{
    const href=link.getAttribute('href');
    if(!href || href.startsWith('#') || link.target==='_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let destination;
    try{destination=new URL(href,window.location.href)}catch(e){return}
    if(destination.origin!==window.location.origin || destination.pathname===window.location.pathname) return;
    link.addEventListener('click',event=>{
      if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(()=>{window.location.href=destination.href},180);
    });
  });



// NeptuneTime demo cart: persists in this browser via localStorage.
(()=>{
  const KEY='neptunetime_cart_v1';
  const readCart=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
  let cart=readCart();
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){};render()};
  const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
  const all=(s)=>Array.from(document.querySelectorAll(s));
  function render(){
    const count=Object.values(cart).reduce((sum,item)=>sum+item.qty,0);
    all('.cart-count').forEach(el=>el.textContent=count);
    const items=all('.cart-items');
    const entries=Object.entries(cart);
    const total=entries.reduce((sum,[,item])=>sum+item.price*item.qty,0);
    items.forEach(container=>{
      if(!entries.length){container.innerHTML='<div class="cart-empty"><span>🛒</span><b>Корзина пока пуста</b><p>Добавь товары из каталога, и они появятся здесь.</p></div>';return;}
      container.innerHTML=entries.map(([id,item])=>`<div class="cart-item" data-cart-id="${id}"><span class="cart-item-name">${item.name}</span><strong class="cart-item-price">${money(item.price*item.qty)}</strong><div class="cart-item-controls"><button class="qty-btn" data-action="minus" aria-label="Уменьшить">−</button><span>${item.qty}</span><button class="qty-btn" data-action="plus" aria-label="Увеличить">＋</button><button class="remove-item" data-action="remove" aria-label="Удалить">×</button></div></div>`).join('');
    });
    all('.cart-quantity').forEach(el=>el.textContent=count);
    all('.cart-total').forEach(el=>el.textContent=money(total));
    all('.checkout-btn').forEach(el=>el.disabled=count===0);
    all('.cart-clear').forEach(el=>el.disabled=count===0);
  }
  all('.add-cart').forEach(button=>button.addEventListener('click',()=>{
    const card=button.closest('.product-card');if(!card)return;
    const id=card.dataset.id;
    if(!cart[id])cart[id]={name:card.dataset.name,price:Number(card.dataset.price),qty:0};
    cart[id].qty++;
    button.classList.add('added');button.innerHTML='Добавлено ✓';
    save();
    setTimeout(()=>{button.classList.remove('added');button.innerHTML='В корзину <span>＋</span>'},1100);
  }));
  all('.cart-items').forEach(container=>container.addEventListener('click',event=>{
    const btn=event.target.closest('[data-action]');if(!btn)return;
    const item=btn.closest('[data-cart-id]');if(!item)return;
    const id=item.dataset.cartId;if(!cart[id])return;
    if(btn.dataset.action==='plus')cart[id].qty++;
    if(btn.dataset.action==='minus')cart[id].qty--;
    if(btn.dataset.action==='remove'||cart[id].qty<=0)delete cart[id];
    save();
  }));
  all('.cart-clear').forEach(button=>button.addEventListener('click',()=>{cart={};save()}));
  all('.checkout-btn').forEach(button=>button.addEventListener('click',()=>{
    if(!Object.keys(cart).length)return;
    const note=button.parentElement.querySelector('.checkout-note');
    if(note)note.textContent='Корзина собрана! Для приёма оплаты необходимо подключить платёжный сервис и серверную обработку заказов.';
  }));
  all('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
    all('.filter-btn').forEach(b=>b.classList.toggle('active',b===button));
    const category=button.dataset.filter;
    all('.product-card').forEach(card=>card.hidden=category!=='all'&&card.dataset.category!==category);
  }));
  render();
})();
