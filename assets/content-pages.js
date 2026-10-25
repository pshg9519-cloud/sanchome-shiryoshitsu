import {cardDoodle} from './decorations.js';
export function workCard(item,{e,link,external}){
 const card=e('article','v4-reading-card content-card');card.dataset.contentId=item.id;const cardKind=item.contentType||item.id;if(['line','note'].includes(cardKind))card.append(cardDoodle(cardKind));
 if(['kindle','line'].includes(cardKind))card.append(e('span','sale-stamp','販売中！'));
 if(item.cover){const img=e('img','book-mini');img.src=item.cover;img.alt=item.title+' 表紙';img.width=641;img.height=1024;img.loading='lazy';card.append(img)}
 const copy=e('div');copy.append(e('p','content-label',item.category),e('h3','',item.title),e('p','',item.summary));
 const action=item.external?external(item.linkLabel+' ↗',item.href):link(item.linkLabel,item.href);action.className='text-link';copy.append(action);card.append(copy);return card;
}
export function renderOtherPage({main,content,intro,...helpers}){
 intro('その他の作品','本、スタンプ、文章。漫画と動画の、もう少し先へ。');
 const section=helpers.e('section','container gallery-section'),grid=helpers.e('div','content-grid');content.items.forEach(w=>grid.append(workCard(w,helpers)));section.append(grid);main.append(section);
}
export function renderKindlePage({main,content,intro,e,link,external}){
 const book=content.book;intro(book.title,'Kindle電子書籍');const section=e('section','container gallery-section book-section'),figure=e('figure','book-cover'),img=e('img');img.src=book.cover;img.alt=book.title+' 正式表紙';img.width=641;img.height=1024;figure.append(img);
 const copy=e('div','book-copy');copy.append(e('p','content-label','BOOK / KINDLE'),e('h2','',book.title),e('p','book-author','著者：'+book.author));
 book.description.forEach(text=>copy.append(e('p','book-description',text)));
 const action=external('Amazonで商品を見る ↗',book.amazonUrl);action.className='button button-secondary';copy.append(action,e('p','small-note','Amazonの外部サイトが開きます。販売状況・価格などの最新情報は商品ページでご確認ください。'),link('その他の作品へ戻る','other-works.html','text-link'));section.append(figure,copy);main.append(section);
}
