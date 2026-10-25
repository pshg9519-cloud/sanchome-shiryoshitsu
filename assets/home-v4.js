import {workCard} from './content-pages.js';
import {createTitleScene} from './header-scene.js';
export function renderPortfolioHome({main,site,comics,videos,content,theme,openComic,emptyVideo,videoCard,e,button,link,external}){
  const heading=(kicker,title,description,href,label)=>{const row=e('div','v4-heading'),copy=e('div');copy.append(e('p','v4-kicker',kicker),e('h2','',title));if(description)copy.append(e('p','v4-description',description));row.append(copy);if(href)row.append(link(label,href,'text-link'));return row};
  const hero=e('section','v4-hero container');hero.setAttribute('aria-labelledby','site-title');
  hero.append(createTitleScene({site,e}));
  const welcome=e('div','v4-welcome'),copy=e('div');copy.append(e('p','v4-description',site.description),e('p','v4-tagline',site.tagline));
  const actions=e('div','v4-actions');actions.append(link('漫画を読む','comics.html','button button-primary'),link('動画作品を見る','videos.html','text-link'));welcome.append(copy,actions);hero.append(welcome);main.append(hero);

  const recent=e('section','container v4-section v4-recent');recent.setAttribute('aria-labelledby','recent-title');const recentHeading=heading('COMICS','新着漫画',null,'comics.html','漫画をすべて見る');recentHeading.querySelector('h2').id='recent-title';recent.append(recentHeading);
  const board=e('div','v4-board');board.setAttribute('aria-label','新着漫画8作品の掲示板');
  for(const work of comics.slice(0,8)){
    const paper=e('article','v4-paper');paper.dataset.workId=work.id;const tape=e('span','v4-tape');tape.setAttribute('aria-hidden','true');const open=button('',()=>openComic(work),'v4-exhibit');open.setAttribute('aria-label',`${work.series_name}の${work.kind}を読む（${work.id}）`);const img=e('img');img.src=work.thumbnail;img.alt=`${work.series_name}の${work.kind}`;img.width=work.thumbnail_width;img.height=work.thumbnail_height;img.loading='lazy';img.decoding='async';open.append(img);paper.append(tape,open);board.append(paper);
  }
  recent.append(board,e('p','v4-order-note','公開日未登録のため、仮の管理順でご紹介しています。'));main.append(recent);

  const series=e('section','container v4-section');series.append(heading('SERIES','三丁目と、四丁目。','ふたつのシリーズ、それぞれの日常。'));const seriesGrid=e('div','v4-series-grid');
  for(const s of site.series){
    const work=comics.find(w=>w.id===s.preview_id&&w.series===s.id)||comics.find(w=>w.series===s.id),card=e('article','v4-series-card'),body=e('div','v4-series-copy');card.dataset.series=s.id;
    if(work){const art=button('',()=>openComic(work),'v4-series-art');art.setAttribute('aria-label',`${s.name}の紹介作品を読む`);const img=e('img');img.src=work.thumbnail;img.alt=`${s.name}の承認済み漫画`;img.width=work.thumbnail_width;img.height=work.thumbnail_height;img.loading='lazy';art.append(img);card.append(art)}
    body.append(e('h3','',s.name),e('p','',s.description),link('シリーズの漫画を読む','comics.html?series='+s.id,'text-link'));card.append(body);seriesGrid.append(card);
  }
  series.append(seriesGrid);main.append(series);

  const films=e('section','container v4-section v4-films');films.append(heading('FILMS','新着動画',null,'videos.html','動画作品をもっと見る'));
  const latest=videos.filter(w=>w.kind==='short'&&w.publishedAt).slice(0,4);if(latest.length){const grid=e('div','video-grid');latest.forEach(w=>grid.append(videoCard(w)));films.append(grid)}else films.append(emptyVideo(true));main.append(films);

  const reading=e('section','container v4-section v4-reading');reading.append(heading('OTHER WORKS','その他の作品',null,'other-works.html','その他の作品を見る'));const readingGrid=e('div','content-grid');
  content.items.forEach(item=>readingGrid.append(workCard(item,{e,link,external})));reading.append(readingGrid);main.append(reading);
}
