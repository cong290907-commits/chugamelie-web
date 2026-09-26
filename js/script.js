/* ============================================================
   CHUG AMÉLIE - SHARED SCRIPT
   ============================================================ */

/* ========== LOADER ========== */
window.addEventListener('load',()=>{
  const loader=document.getElementById('loader');
  if(loader) setTimeout(()=>loader.classList.add('hidden'),800);
});

/* ========== NAVBAR SCROLL ========== */
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  const backTop=document.getElementById('backTop');
  if(nav) nav.classList.toggle('scrolled',window.scrollY>80);
  if(backTop) backTop.classList.toggle('visible',window.scrollY>500);
});

/* ========== MOBILE MENU ========== */
function toggleMenu(){
  const nav=document.getElementById('navLinks');
  if(nav) nav.classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>{
    const nav=document.getElementById('navLinks');
    if(nav) nav.classList.remove('open');
  });
});

/* ========== HERO SLIDESHOW ========== */
function initHeroSlideshow(){
  const slides=document.querySelectorAll('.hero-slide');
  const dotsContainer=document.getElementById('heroDots');
  if(!slides.length||!dotsContainer) return;
  let currentSlide=0;
  slides.forEach((_,i)=>{
    const dot=document.createElement('button');
    dot.className='hero-dot'+(i===0?' active':'');
    dot.onclick=()=>goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  const dots=document.querySelectorAll('.hero-dot');
  function goToSlide(i){
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide=i;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  setInterval(()=>goToSlide((currentSlide+1)%slides.length),5000);
}
initHeroSlideshow();

/* ========== SCROLL REVEAL ========== */
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ========== COUNTER ANIMATION ========== */
const counters=document.querySelectorAll('[data-count]');
if(counters.length){
  const counterObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el=entry.target;
        const target=+el.dataset.count;
        let count=0;
        const step=target/60;
        const update=()=>{
          count+=step;
          if(count<target){
            el.textContent=Math.floor(count)+(target===1500?'+':'');
            requestAnimationFrame(update);
          }else{
            el.textContent=target+(target===1500?'+':'');
          }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  },{threshold:.5});
  counters.forEach(c=>counterObserver.observe(c));
}

/* ========== LIGHTBOX (GALLERY) ========== */
function initLightbox(){
  const galleryImages=Array.from(document.querySelectorAll('.gallery-item img'));
  const lightbox=document.getElementById('lightbox');
  const lightboxImg=document.getElementById('lightboxImg');
  if(!galleryImages.length||!lightbox) return;
  let currentImgIndex=0;
  galleryImages.forEach((img,i)=>{
    img.parentElement.addEventListener('click',()=>{
      currentImgIndex=i;
      lightboxImg.src=img.src;
      lightbox.classList.add('open');
      document.body.style.overflow='hidden';
    });
  });
  window.closeLightbox=function(){
    lightbox.classList.remove('open');
    document.body.style.overflow='';
  };
  window.changeLightbox=function(dir){
    currentImgIndex=(currentImgIndex+dir+galleryImages.length)%galleryImages.length;
    lightboxImg.src=galleryImages[currentImgIndex].src;
  };
  lightbox.addEventListener('click',(e)=>{if(e.target===lightbox)closeLightbox()});
  document.addEventListener('keydown',(e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft') changeLightbox(-1);
    if(e.key==='ArrowRight') changeLightbox(1);
  });
}
initLightbox();

/* ========== MAP LIGHTBOX ========== */
window.openMapLightbox=function(){
  const el=document.getElementById('mapLightbox');
  if(el){el.classList.add('open');document.body.style.overflow='hidden';}
};
window.closeMapLightbox=function(){
  const el=document.getElementById('mapLightbox');
  if(el){el.classList.remove('open');document.body.style.overflow='';}
};
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeMapLightbox()});

/* ========== NOTIFICATIONS ========== */
let notifications=JSON.parse(localStorage.getItem('chugNotifs')||'[]');
function saveNotifs(){localStorage.setItem('chugNotifs',JSON.stringify(notifications))}
window.addNotification=function(icon,title,message){
  notifications.unshift({
    id:Date.now(),icon,title,message,
    time:new Date().toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),
    read:false
  });
  if(notifications.length>20) notifications=notifications.slice(0,20);
  saveNotifs();
  renderNotifs();
};
function renderNotifs(){
  const body=document.getElementById('notifBody');
  const count=document.getElementById('notifCount');
  if(!body||!count) return;
  const unreadCount=notifications.filter(n=>!n.read).length;
  if(unreadCount>0){count.textContent=unreadCount;count.classList.add('show')}
  else{count.classList.remove('show')}
  if(notifications.length===0){
    body.innerHTML='<div class="notif-empty">Chưa có thông báo nào</div>';
    return;
  }
  body.innerHTML=notifications.map(n=>`
    <div class="notif-item" onclick="markRead(${n.id})">
      <div class="notif-icon">${n.icon}</div>
      <div class="notif-content">
        <strong style="font-size:.9rem;color:var(--wd)">${n.title}</strong>
        <p>${n.message}</p>
        <small>${n.time}</small>
      </div>
    </div>
  `).join('');
}
window.markRead=function(id){
  const n=notifications.find(x=>x.id===id);
  if(n){n.read=true;saveNotifs();renderNotifs();}
};
window.clearAllNotifs=function(){
  notifications=[];
  saveNotifs();
  renderNotifs();
  showToast('success','Đã xóa','Tất cả thông báo đã được xóa.');
};
window.toggleNotifPanel=function(){
  const panel=document.getElementById('notifPanel');
  if(!panel) return;
  panel.classList.toggle('open');
  if(panel.classList.contains('open')){
    setTimeout(()=>{
      notifications.forEach(n=>n.read=true);
      saveNotifs();
      renderNotifs();
    },1500);
  }
};
document.addEventListener('click',(e)=>{
  const panel=document.getElementById('notifPanel');
  const btn=e.target.closest('.btn-notify');
  if(panel && !panel.contains(e.target) && !btn) panel.classList.remove('open');
});

/* ========== TOAST ========== */
window.showToast=function(type,title,message){
  const container=document.getElementById('toastContainer');
  if(!container) return;
  const icons={success:'✓',error:'✕'};
  const toast=document.createElement('div');
  toast.className='toast '+type;
  toast.innerHTML=`<div class="toast-icon">${icons[type]||'✓'}</div><div class="toast-content"><strong>${title}</strong><p>${message}</p></div>`;
  container.appendChild(toast);
  setTimeout(()=>{
    toast.classList.add('removing');
    setTimeout(()=>toast.remove(),400);
  },4000);
};

/* ========== BOOKING MODAL ========== */
window.openBookingModal=function(roomName){
  const modal=document.getElementById('bookingModal');
  if(!modal) return;
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  if(roomName){
    const sel=document.getElementById('bkRoom');
    if(sel) sel.value=roomName;
  }
  const today=new Date().toISOString().split('T')[0];
  const ci=document.getElementById('bkCheckin');
  const co=document.getElementById('bkCheckout');
  if(ci) ci.min=today;
  if(co) co.min=today;
};
window.closeBookingModal=function(){
  const modal=document.getElementById('bookingModal');
  if(modal){modal.classList.remove('open');document.body.style.overflow='';}
};
const bookingModalEl=document.getElementById('bookingModal');
if(bookingModalEl){
  bookingModalEl.addEventListener('click',(e)=>{
    if(e.target.id==='bookingModal') closeBookingModal();
  });
}
const bookingFormEl=document.getElementById('bookingForm');
if(bookingFormEl){
  bookingFormEl.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('bkName').value.trim();
    const phone=document.getElementById('bkPhone').value.trim();
    const room=document.getElementById('bkRoom').value;
    const checkin=document.getElementById('bkCheckin').value;
    const checkout=document.getElementById('bkCheckout').value;
    if(!name||!phone||!room||!checkin||!checkout){
      showToast('error','Thiếu thông tin','Vui lòng điền đầy đủ.');
      return;
    }
    if(new Date(checkout)<=new Date(checkin)){
      showToast('error','Ngày không hợp lệ','Ngày đi phải sau ngày đến.');
      return;
    }
    const bookingCode='CA-'+String(Date.now()).slice(-6);
    const bookings=JSON.parse(localStorage.getItem('chugBookings')||'[]');
    bookings.push({code:bookingCode,name,phone,room,checkin,checkout,time:new Date().toISOString()});
    localStorage.setItem('chugBookings',JSON.stringify(bookings));
    closeBookingModal();
    document.getElementById('successTitle').textContent='Đặt phòng thành công!';
    document.getElementById('successMsg').textContent=`Cảm ơn ${name}! Chúng tôi sẽ liên hệ qua SĐT ${phone}.`;
    document.getElementById('bookingCode').textContent=bookingCode;
    document.getElementById('successModal').classList.add('open');
    addNotification('✓','Đặt phòng thành công',`Mã ${bookingCode} - ${room}`);
    showToast('success','Đặt phòng thành công!',`Mã: ${bookingCode}`);
    if(typeof updateRoomAvailability==='function') updateRoomAvailability();
    bookingFormEl.reset();
  });
}
window.closeSuccessModal=function(){
  const m=document.getElementById('successModal');
  if(m){m.classList.remove('open');document.body.style.overflow='';}
};
const successModalEl=document.getElementById('successModal');
if(successModalEl){
  successModalEl.addEventListener('click',(e)=>{
    if(e.target.id==='successModal') closeSuccessModal();
  });
}

/* ========== REVIEW SYSTEM ========== */
let reviews=JSON.parse(localStorage.getItem('chugReviews')||'[]');
if(reviews.length===0){
  reviews=[
    {id:1,name:'Minh Anh',room:'Premium — Mái dốc gác mái Châu Âu',stars:5,text:'Phòng view kính đẹp không tưởng! Sáng mở mắt ra là thấy biển mây ngay trước mặt. Sẽ quay lại!',time:'10/01/2025 08:30'},
    {id:2,name:'Thanh Tùng',room:'Standard Cloud Room',stars:5,text:'Không gian yên tĩnh, mộc mạc mà tinh tế. Rất đáng để trải nghiệm một lần!',time:'05/01/2025 15:20'},
    {id:3,name:'Hoàng Yến',room:'Duet Family Cloud Suite',stars:5,text:'Đi cùng gia đình 6 người, phòng rộng rãi. Tối BBQ ngoài trời cực vui!',time:'28/12/2024 20:15'}
  ];
  localStorage.setItem('chugReviews',JSON.stringify(reviews));
}
function saveReviews(){localStorage.setItem('chugReviews',JSON.stringify(reviews))}
function renderReviews(){
  const list=document.getElementById('reviewsList');
  if(!list) return;
  const sorted=[...reviews].sort((a,b)=>b.id-a.id);
  if(sorted.length===0){
    list.innerHTML='<div style="text-align:center;padding:40px;color:#8a7a68">Chưa có đánh giá nào.</div>';
    return;
  }
  list.innerHTML=sorted.map(r=>{
    const initial=r.name.charAt(0).toUpperCase();
    const starsDisplay='★'.repeat(r.stars)+'☆'.repeat(5-r.stars);
    return `
      <div class="review-card">
        <div class="review-head">
          <div class="avatar">${initial}</div>
          <div class="reviewer-info">
            <strong>${r.name}</strong><br>
            <small style="color:#8a7a68;font-size:.78rem">${r.time}</small>
          </div>
          <div class="review-stars">${starsDisplay}</div>
        </div>
        <p class="review-text">${r.text}</p>
        ${r.room?`<span class="review-room-tag">🛏️ ${r.room}</span>`:''}
      </div>
    `;
  }).join('');
}
function updateRatingStats(){
  const total=reviews.length;
  const sum=reviews.reduce((s,r)=>s+r.stars,0);
  const avg=total>0?(sum/total).toFixed(1):'0.0';
  const avgEl=document.getElementById('avgScore');
  const totalEl=document.getElementById('totalReviews');
  const starsEl=document.getElementById('avgStars');
  if(!avgEl) return;
  avgEl.textContent=avg;
  totalEl.textContent=total;
  const fullStars=Math.round(avg);
  starsEl.textContent='★'.repeat(fullStars)+'☆'.repeat(5-fullStars);
  [5,4,3,2,1].forEach(star=>{
    const count=reviews.filter(r=>r.stars===star).length;
    const percent=total>0?(count/total*100):0;
    const bar=document.querySelector(`.bar-fill[data-star="${star}"]`);
    const cnt=document.querySelector(`[data-count-star="${star}"]`);
    if(bar) bar.style.width=percent+'%';
    if(cnt) cnt.textContent=count;
  });
}
window.openReviewModal=function(){
  const m=document.getElementById('reviewModal');
  if(m){m.classList.add('open');document.body.style.overflow='hidden';}
};
window.closeReviewModal=function(){
  const m=document.getElementById('reviewModal');
  if(m){m.classList.remove('open');document.body.style.overflow='';}
};
const reviewModalEl=document.getElementById('reviewModal');
if(reviewModalEl){
  reviewModalEl.addEventListener('click',(e)=>{
    if(e.target.id==='reviewModal') closeReviewModal();
  });
}
document.querySelectorAll('#starPicker .star').forEach(star=>{
  star.addEventListener('click',()=>{
    const value=+star.dataset.value;
    document.getElementById('rvStars').value=value;
    document.querySelectorAll('#starPicker .star').forEach(s=>{
      s.classList.toggle('active',+s.dataset.value<=value);
    });
  });
});
const reviewFormEl=document.getElementById('reviewForm');
if(reviewFormEl){
  reviewFormEl.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('rvName').value.trim();
    const room=document.getElementById('rvRoom').value;
    const stars=+document.getElementById('rvStars').value;
    const text=document.getElementById('rvText').value.trim();
    if(!name||!text){showToast('error','Thiếu thông tin','Vui lòng điền đầy đủ.');return;}
    reviews.push({
      id:Date.now(),name,room,stars,text,
      time:new Date().toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
    });
    saveReviews();
    renderReviews();
    updateRatingStats();
    closeReviewModal();
    reviewFormEl.reset();
    addNotification('⭐','Đánh giá mới',`${name} đã đánh giá ${stars} sao`);
    showToast('success','Cảm ơn bạn!','Đánh giá đã được gửi.');
  });
}

/* ========== CONTACT FORM ========== */
const contactFormEl=document.getElementById('contactForm');
if(contactFormEl){
  contactFormEl.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('cfName').value.trim();
    const phone=document.getElementById('cfPhone').value.trim();
    const checkin=document.getElementById('cfCheckin').value;
    const checkout=document.getElementById('cfCheckout').value;
    const room=document.getElementById('cfRoom').value;
    if(!name||!phone||!checkin||!checkout||!room){
      showToast('error','Thiếu thông tin','Vui lòng điền đầy đủ.');return;
    }
    if(new Date(checkout)<=new Date(checkin)){
      showToast('error','Ngày không hợp lệ','Ngày đi phải sau ngày đến.');return;
    }
    const bookingCode='CA-'+String(Date.now()).slice(-6);
    const bookings=JSON.parse(localStorage.getItem('chugBookings')||'[]');
    bookings.push({code:bookingCode,name,phone,room,checkin,checkout,time:new Date().toISOString()});
    localStorage.setItem('chugBookings',JSON.stringify(bookings));
    document.getElementById('successTitle').textContent='Gửi yêu cầu thành công!';
    document.getElementById('successMsg').textContent=`Cảm ơn ${name}, chúng tôi sẽ liên hệ qua SĐT ${phone}.`;
    document.getElementById('bookingCode').textContent=bookingCode;
    document.getElementById('successModal').classList.add('open');
    addNotification('📩','Yêu cầu đặt phòng',`${name} - ${room}`);
    showToast('success','Gửi thành công!',`Mã: ${bookingCode}`);
    if(typeof updateRoomAvailability==='function') updateRoomAvailability();
    contactFormEl.reset();
  });
}

window.scrollToBooking=function(){
  const el=document.getElementById('contact')||document.getElementById('bookingSection');
  if(el){
    el.scrollIntoView({behavior:'smooth'});
    setTimeout(()=>{
      const n=document.getElementById('cfName');
      if(n) n.focus();
    },800);
  }
};

/* ========== CHATBOT ========== */
window.toggleChat=function(){
  const c=document.getElementById('chatWindow');
  if(c) c.classList.toggle('open');
};
const botReplies=[
  {keywords:['giá','bao nhiêu','phòng'],reply:'Dạ, bên em có 4 hạng phòng:\n• Standard Cloud (5 căn): 800k-1.300k\n• Premium S1 — Nhà gỗ Bohemian (3 căn): 1.300k-1.700k\n• Premium S2 — Mái dốc Châu Âu (3 căn): 1.300k-1.700k\n• Duet Family (5 căn): 1.000k-2.400k'},
  {keywords:['combo','trọn gói'],reply:'Dạ bên em có COMBO 2N1Đ chỉ từ 899.000đ/khách:\n• Ngày thường: 899k\n• T6-CN: 949k\n• T7 đỉnh điểm: 1.099k\nĐã gồm Xe Cabin đôi khứ hồi + Phòng + Bữa sáng + Bộ đặc quyền.'},
  {keywords:['địa chỉ','ở đâu'],reply:'Chug Amélie ở xã Tà Xùa, huyện Bắc Yên, Sơn La ạ. Gọi 0325 292 907 để được chỉ đường nhé!'},
  {keywords:['đặt phòng','book'],reply:'Anh/chị bấm nút "Đặt phòng" trên web hoặc gọi hotline 0325 292 907 ạ!'},
  {keywords:['check in','check out'],reply:'Check-in 12:00, check-out 12:00 ngày hôm sau ạ.'},
  {keywords:['săn mây','mây'],reply:'Săn mây là đặc sản của Tà Xùa ạ! Anh/chị nên dậy sớm 5-6h sáng. Đẹp nhất vào mùa đông ạ!'},
  {keywords:['còn phòng','trống'],reply:'Anh/chị xem ở mục Homestay có hiển thị số phòng còn trống theo thời gian thực ạ!'},
  {keywords:['khoảng cách','đỉnh gió'],reply:'Khoảng cách từ Đỉnh Gió (Chug Amélie):\n• Khe Cái: 100m\n• Bản Bè: 5km\n• Sống Lưng Khủng Long: 10km\n• Thảo Nguyên Tà Xùa: 12km\n• Mỏm Cá Heo: 13km\n• Cây Cô Đơn: 14km'},
  {keywords:['cảm ơn','thank'],reply:'Dạ không có gì ạ! Chug Amélie rất mong được đón anh/chị. 🌿'}
];
window.sendMsg=function(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();
  if(!text) return;
  const body=document.getElementById('chatBody');
  body.innerHTML+=`<div class="msg user">${text}</div>`;
  input.value='';
  body.scrollTop=body.scrollHeight;
  setTimeout(()=>{
    const lower=text.toLowerCase();
    const found=botReplies.find(r=>r.keywords.some(k=>lower.includes(k)));
    const reply=found?found.reply:'Dạ em đã ghi nhận. Anh/chị gọi hotline 0325 292 907 nhé! 🌿';
    body.innerHTML+=`<div class="msg bot">${reply.replace(/\n/g,'<br>')}</div>`;
    body.scrollTop=body.scrollHeight;
  },600);
};

/* ========== ROOMS AVAILABILITY ========== */
const ROOM_CAPACITY={
  'Standard Cloud Room':5,
  'Premium — Nhà gỗ mộc nghệ thuật':3,
  'Premium — Mái dốc gác mái Châu Âu':3,
  'Duet Family Cloud Suite':5
};
const ROOM_KEYS={
  'Standard Cloud Room':'standard',
  'Premium — Nhà gỗ mộc nghệ thuật':'premium',
  'Premium — Mái dốc gác mái Châu Âu':'premium2',
  'Duet Family Cloud Suite':'family'
};
function getBookedCountByRoom(){
  const bookings=JSON.parse(localStorage.getItem('chugBookings')||'[]');
  const today=new Date().toISOString().split('T')[0];
  const counts={
    'Standard Cloud Room':0,
    'Premium — Nhà gỗ mộc nghệ thuật':0,
    'Premium — Mái dốc gác mái Châu Âu':0,
    'Duet Family Cloud Suite':0
  };
  bookings.forEach(b=>{
    if(b.checkout&&b.checkout>=today&&counts[b.room]!==undefined) counts[b.room]++;
  });
  return counts;
}
window.updateRoomAvailability=function(){
  const booked=getBookedCountByRoom();
  let totalAvailable=0;
  Object.keys(ROOM_CAPACITY).forEach(roomName=>{
    const total=ROOM_CAPACITY[roomName];
    const used=booked[roomName];
    const available=Math.max(0,total-used);
    totalAvailable+=available;
    const key=ROOM_KEYS[roomName];
    const availableEl=document.querySelector(`.room-card[data-room="${key}"] .available-rooms`);
    if(availableEl) availableEl.textContent=available;
    const tagEl=document.querySelector(`.room-card[data-room="${key}"] .tag-rooms`);
    if(tagEl){
      const icons={standard:'🛏️',premium:'🌿',premium2:'⭐',family:'👨‍👩‍👧'};
      tagEl.innerHTML=`${icons[key]} ${available}/${total} căn trống`;
    }
    const statusEl=document.querySelector(`.room-status-info[data-status="${key}"]`);
    if(statusEl){
      const statusText=statusEl.querySelector('.status-text');
      if(available===0){
        statusEl.classList.add('full');
        statusText.innerHTML=`⚠️ <strong>Hết phòng</strong> — Vui lòng chọn ngày khác`;
      }else if(available<=1){
        statusEl.classList.add('full');
        statusText.innerHTML=`🔥 <strong>Chỉ còn ${available} căn</strong> — Đặt ngay kẻo lỡ!`;
      }else{
        statusEl.classList.remove('full');
        statusText.innerHTML=`✅ <strong>Còn ${available} căn trống</strong> — Sẵn sàng đón bạn`;
      }
    }
  });
  const availCountEl=document.getElementById('availableCount');
  if(availCountEl) availCountEl.textContent=totalAvailable;
};
window.filterRooms=function(btn){
  document.querySelectorAll('.rooms-filter-bar .filter-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  const filter=btn.dataset.filter;
  const cards=document.querySelectorAll('.room-card[data-room]');
  let visibleCount=0;
  const booked=getBookedCountByRoom();
  cards.forEach(card=>{
    const roomKey=card.dataset.room;
    const total=+card.dataset.total;
    const roomName=Object.keys(ROOM_KEYS).find(k=>ROOM_KEYS[k]===roomKey);
    const used=booked[roomName]||0;
    const available=total-used;
    let show=true;
    if(filter==='available'||filter==='flash') show=available>0;
    else if(filter==='standard'||filter==='premium'||filter==='premium2'||filter==='family') show=roomKey===filter;
    card.classList.toggle('filtered-out',!show);
    if(show) visibleCount++;
  });
  const resultEl=document.getElementById('filterResult');
  const labels={
    all:'tất cả',
    available:'các phòng còn trống',
    flash:'các phòng Flash deal',
    standard:'hạng <strong>Standard Cloud Room</strong>',
    premium:'hạng <strong>Premium — Nhà gỗ mộc nghệ thuật</strong>',
    premium2:'hạng <strong>Premium — Mái dốc gác mái Châu Âu</strong>',
    family:'hạng <strong>Duet Family Cloud Suite</strong>'
  };
  if(resultEl){
    resultEl.innerHTML=visibleCount>0
      ?`Đang hiển thị <strong>${visibleCount}</strong> hạng phòng — ${labels[filter]||''}`
      :`Không tìm thấy hạng phòng nào`;
  }
  const noRes=document.getElementById('noRoomsResults');
  if(noRes) noRes.style.display=visibleCount===0?'block':'none';
};

/* ========== INIT ========== */
renderNotifs();
renderReviews();
updateRatingStats();
updateRoomAvailability();

setTimeout(()=>{
  if(!sessionStorage.getItem('chugWelcomed')){
    addNotification('👋','Chào mừng đến Chug Amélie','Khám phá các hạng phòng và đặt ngay hôm nay!');
    sessionStorage.setItem('chugWelcomed','1');
  }
},2000);