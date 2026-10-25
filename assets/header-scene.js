const options=document.body.dataset.page==='home'?await fetch('data/header-theme.json').then(response=>{if(!response.ok)throw Error('タイトル素材を読み込めませんでした。');return response.json()}):null;
export function createTitleScene({site,e}){
  const scene=e('div','v4-scene header-scene');scene.id='title-scene';scene.setAttribute('aria-label','資料室の受付とボダ子さんのご案内');
  const room=e('img','v4-room header-room');room.alt='窓、高い書架、受付カウンター、引き出し棚、照明と時計を、淡い紙色に控えめな線で描いた資料室。';room.width=2172;room.height=724;room.fetchPriority='high';const backdrop=e('picture','header-backdrop');if(options.background_mobile){const source=e('source');source.media='(max-width:660px)';source.srcset=options.background_mobile;backdrop.append(source)}backdrop.append(room);room.src=options.background;scene.append(backdrop);
  const sign=e('div','v4-enamel header-enamel'),title=e('h1','v4-site-title header-title');title.id='site-title';title.setAttribute('aria-label',site.name);
  const name=e('span','v4-name header-name');name.setAttribute('aria-hidden','true');const last=e('span','header-name-part header-final-kanji','室');name.append(e('span','header-name-part','三丁目資料'),last);
  const stamp=e('img','header-stamp');stamp.src=options.stamp;stamp.alt='仮';stamp.width=88;stamp.height=88;const lettering=e('span','title-refined'),finalLetter=e('span','title-refined-last title-lettering-metric','室');lettering.append(e('span','title-lettering-metric','三丁目資料'),finalLetter);finalLetter.append(stamp);
  const ink=e('img','title-lettering-image');ink.alt='三丁目資料室';ink.width=1476;ink.height=275;ink.fetchPriority='high';
  ink.addEventListener('error',()=>{ink.hidden=true;lettering.classList.add('title-lettering-fallback')});ink.src='assets/header/title-lettering-author.png';lettering.append(ink);name.append(lettering);title.append(name);sign.append(title);scene.append(sign);
  const guide=e('figure','v4-guide header-guide');guide.setAttribute('aria-label','ボダ子さんが看板に軽く寄りかかり、手のひらでご案内する静止イラスト。正式資料に基づく編集候補。');
  const image=e('img','header-guide-image');image.src=options.guide;image.alt='紫の瞳、黒髪と白い顔の模様、白い先の尾のボダ子さん。紺の事務服で片手を開いて案内しています。';image.width=1024;image.height=1536;image.decoding='async';guide.append(image);scene.append(guide);
  const sizeSign=()=>scene.style.setProperty('--compact-sign-width',sign.getBoundingClientRect().width+'px');
  new ResizeObserver(sizeSign).observe(sign);
  return scene;
}
