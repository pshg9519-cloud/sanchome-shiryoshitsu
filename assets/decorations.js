const NS='http://www.w3.org/2000/svg';
export function cardDoodle(kind){
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 64 64');svg.setAttribute('class','card-doodle');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.5');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 const shape=(name,attrs)=>{const n=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,value);svg.append(n)};
 if(kind==='note'){
  shape('path',{d:'M7 17Q20 12 30 18Q41 13 55 17L54 48Q40 45 30 51Q19 45 8 49Z'});
  shape('path',{d:'M30 18L30 51M12 24Q20 21 25 25M12 30Q20 27 25 31M12 36Q19 33 25 36M35 36Q41 32 48 35'});
  shape('path',{d:'M43 7L49 10L40 30L34 34L34 27Z',class:'doodle-accent'});shape('path',{d:'M43 7L49 10M34 27L40 30'});
 }else{
  shape('path',{d:'M9 11Q32 7 54 12L55 42Q46 48 23 45L12 54L15 44Q7 43 8 35Z'});
  shape('path',{d:'M25 32Q22 39 29 39Q32 36 36 39Q43 40 40 32Q37 26 33 27Q29 26 25 32Z'});
  for(const [cx,cy,rx,ry] of [[23,25,3,4],[29,20,3,4],[37,20,3,4],[44,25,3,4]])shape('ellipse',{cx,cy,rx,ry});
  shape('path',{d:'M47 49L50 54M53 47L57 50',class:'doodle-accent'});
 }
 return svg;
}
