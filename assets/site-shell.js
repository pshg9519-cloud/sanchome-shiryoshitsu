import {createSiteShare} from './site-share.js';
export function renderFooter({footer,data,e,link,external}){
 const inner=e('div','footer-inner footer-complete'),identity=e('div','footer-identity');
 identity.append(link(data.siteName,'index.html','footer-name'),e('p','footer-tagline',data.tagline));
 const navigation=e('nav','footer-menu');navigation.setAttribute('aria-label','フッターのサイト案内');navigation.append(e('h2','','サイト案内'));const menu=e('ul');
 data.internalLinks.forEach(item=>{const li=e('li');li.append(link(item.label,item.href));menu.append(li)});navigation.append(menu);
 const social=e('nav','footer-social');social.setAttribute('aria-label','SNS・外部リンク');social.append(e('h2','','SNS・外部リンク'));const links=e('ul');
 data.socialLinks.forEach(item=>{const li=e('li');li.append(external(item.label+' ↗',item.href));links.append(li)});social.append(links);
 const share=createSiteShare({e,button:(text,fn,cls='')=>{const b=e('button',cls,text);b.type='button';b.addEventListener('click',fn);return b}});
 links.append(share);
 inner.append(identity,navigation,social);footer.replaceChildren(inner,e('p','copyright',data.copyright));
 document.body.append(share.querySelector('.site-share-dialog'));
}
export function renderAboutPage({main,data,intro,e}){
 intro('このサイトについて',data.purpose);
 const article=e('article','container about-page');
 const section=(kicker,title,id)=>{const s=e('section','about-section');s.setAttribute('aria-labelledby',id);const h=e('h2','',title);h.id=id;s.append(e('p','content-label',kicker),h);article.append(s);return s};
 const profile=section('PROFILE','作者について','profile-title');
 const layout=e('div','profile-layout'),portrait=e('figure','profile-portrait'),image=e('img'),copy=e('div','profile-copy');
 image.src='assets/profile/profile.png';image.alt='作者プロフィール画像';image.width=1000;image.height=1000;image.decoding='async';portrait.append(image);
 copy.append(e('p','profile-name',data.author));data.profile.forEach(text=>copy.append(e('p','about-text',text)));layout.append(portrait,copy);profile.append(layout);
 const creation=section('CREATION','作品づくりについて','creation-title');data.creation.forEach(text=>creation.append(e('p','about-text',text)));
 const message=section('MESSAGE','訪問者へのメッセージ','message-title');data.message.forEach(text=>message.append(e('p','about-text',text)));main.append(article);
}
