// Public, author-approved metadata only. The research/approval files are kept outside dist.
export function safeVideo(w){
 return (w.kind==='short'?w.approvalStatus==='掲載候補':w.approvalStatus==='掲載承認') && w.platform==='youtube' && /^[A-Za-z0-9_-]{11}$/.test(w.videoId)
  && typeof w.title==='string' && w.title.length>0 && ['short','standard'].includes(w.kind)
  && (w.kind==='short'?w.shortsUrl==='https://www.youtube.com/shorts/'+w.videoId:w.videoUrl==='https://www.youtube.com/watch?v='+w.videoId)
  && /^assets\/videos\/[A-Za-z0-9_-]{11}\.(?:avif|jpg|png|webp)$/.test(w.thumbnailUrl)
  && (!w.publishedAt||Number.isFinite(Date.parse(w.publishedAt)))
  && (!w.niconicoUrl||/^https:\/\/www\.nicovideo\.jp\/watch\/sm\d+$/.test(w.niconicoUrl));
}
export function newestVideos(works){
 return [...works].sort((a,b)=>{const x=Date.parse(a.publishedAt),y=Date.parse(b.publishedAt);return Number.isFinite(x)&&Number.isFinite(y)?y-x||a.videoId.localeCompare(b.videoId):Number.isFinite(x)?-1:Number.isFinite(y)?1:a.videoId.localeCompare(b.videoId)});
}
export function createVideoUI({e,button,external}){
 const dialog=document.getElementById('video-dialog'),player=document.getElementById('video-player');let opener=null;
 function links(work){const row=e('div','video-links');row.append(external('YouTubeで見る ↗',work.kind==='short'?work.shortsUrl:work.videoUrl));if(work.niconicoUrl)row.append(external('ニコニコ動画 ↗',work.niconicoUrl));return row}
 function open(work,trigger){
  opener=trigger||document.activeElement;
  document.getElementById('video-title').textContent=work.title;
  dialog.classList.toggle('short',work.kind==='short');
  const frame=e('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+work.videoId+'?autoplay=0&rel=0&playsinline=1';
  frame.title=work.title;frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
  player.replaceChildren(frame);document.getElementById('video-links').replaceChildren(links(work));
  dialog.showModal();document.getElementById('video-close').focus();
 }
 document.getElementById('video-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();dialog.close();return}
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button:not(:disabled),a[href],iframe,[tabindex="0"]')].filter(node=>node.getClientRects().length),first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
 dialog.addEventListener('close',()=>{player.replaceChildren();if(opener?.isConnected)opener.focus({preventScroll:true});opener=null});
 function videoCard(work){
  const card=e('article','video-card '+work.kind);card.dataset.videoId=work.videoId;
  const trigger=button('',()=>open(work,trigger),'video-open');trigger.setAttribute('aria-label',work.title+'を再生画面で開く');trigger.setAttribute('aria-haspopup','dialog');
  const thumb=e('div','video-thumbnail'),img=e('img');img.src=work.thumbnailUrl;img.alt=work.title;img.width=work.thumbnailWidth;img.height=work.thumbnailHeight;img.loading='lazy';img.decoding='async';
  const play=e('span','video-play','▶ 動画を見る');play.setAttribute('aria-hidden','true');thumb.append(img,play);trigger.append(thumb);
  const meta=e('div','video-meta');meta.append(e('span','kind-label',work.kind==='short'?'ショート':'通常動画'),e('h3','',work.title));
  if(work.publishedAt){const date=e('time','video-date',new Intl.DateTimeFormat('ja-JP',{dateStyle:'medium',timeZone:'Asia/Tokyo'}).format(new Date(work.publishedAt))+' 公開');date.dateTime=work.publishedAt;meta.append(date)}else meta.append(e('p','small-note','公開日未確認'));
  meta.append(links(work));if(work.kind==='standard'&&work.description){const details=e('details','video-credits');details.append(e('summary','','制作情報（YouTube説明文）'),e('p','',work.description));meta.append(details)}card.append(trigger,meta);return card;
 }
 return {videoCard};
}
