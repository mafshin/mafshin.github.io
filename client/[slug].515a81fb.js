import{S as t,i as e,s,e as n,t as o,c as a,f as c,g as r,d as l,h,k as i,j as p,l as m,a as f,q as u,b as g,n as d,m as y}from"./client.cd54c4e0.js";function v(t,e,s){const n=t.slice();return n[1]=e[s],n}function E(t){let e,s,f,u,g=t[1]+"";return{c(){e=n("li"),s=n("a"),f=o(g),this.h()},l(t){e=a(t,"LI",{class:!0});var n=c(e);s=a(n,"A",{rel:!0,href:!0});var o=c(s);f=r(o,g),o.forEach(l),n.forEach(l),this.h()},h(){h(s,"rel","prefetch"),h(s,"href",u="tag/"+t[1]),h(e,"class","svelte-wc0972")},m(t,n){i(t,e,n),p(e,s),p(s,f)},p(t,e){1&e&&g!==(g=t[1]+"")&&m(f,g),1&e&&u!==(u="tag/"+t[1])&&h(s,"href",u)},d(t){t&&l(e)}}}function M(t){let e,s,M,T,w,A,b,j,x,L,H,$,k,I,q,D,S,U=t[0].title+"",V=t[0].html+"";document.title=e=t[0].title;let z=t[0].tags,B=[];for(let e=0;e<z.length;e+=1)B[e]=E(v(t,z,e));return{c(){s=n("meta"),T=n("meta"),w=n("meta"),b=n("meta"),x=n("meta"),H=f(),$=n("h1"),k=o(U),I=f(),q=n("div"),D=f(),S=n("ul");for(let t=0;t<B.length;t+=1)B[t].c();this.h()},l(t){const e=u('[data-svelte="svelte-1xafkcv"]',document.head);s=a(e,"META",{property:!0,content:!0}),T=a(e,"META",{property:!0,content:!0}),w=a(e,"META",{property:!0,content:!0}),b=a(e,"META",{property:!0,content:!0}),x=a(e,"META",{property:!0,content:!0}),e.forEach(l),H=g(t),$=a(t,"H1",{});var n=c($);k=r(n,U),n.forEach(l),I=g(t),q=a(t,"DIV",{class:!0}),c(q).forEach(l),D=g(t),S=a(t,"UL",{class:!0});var o=c(S);for(let t=0;t<B.length;t+=1)B[t].l(o);o.forEach(l),this.h()},h(){h(s,"property","og:title"),h(s,"content",M=t[0].title),h(T,"property","og:type"),h(T,"content","website"),h(w,"property","og:url"),h(w,"content",A="https://mafshin.com/blog/"+t[0].slug),h(b,"property","og:image"),h(b,"content",j="https://mafshin.com/"+t[0].image),h(x,"property","og:description"),h(x,"content",L=t[0].description),h(q,"class","content svelte-wc0972"),h(S,"class","tags svelte-wc0972")},m(t,e){p(document.head,s),p(document.head,T),p(document.head,w),p(document.head,b),p(document.head,x),i(t,H,e),i(t,$,e),p($,k),i(t,I,e),i(t,q,e),q.innerHTML=V,i(t,D,e),i(t,S,e);for(let t=0;t<B.length;t+=1)B[t].m(S,null)},p(t,[n]){if(1&n&&e!==(e=t[0].title)&&(document.title=e),1&n&&M!==(M=t[0].title)&&h(s,"content",M),1&n&&A!==(A="https://mafshin.com/blog/"+t[0].slug)&&h(w,"content",A),1&n&&j!==(j="https://mafshin.com/"+t[0].image)&&h(b,"content",j),1&n&&L!==(L=t[0].description)&&h(x,"content",L),1&n&&U!==(U=t[0].title+"")&&m(k,U),1&n&&V!==(V=t[0].html+"")&&(q.innerHTML=V),1&n){let e;for(z=t[0].tags,e=0;e<z.length;e+=1){const s=v(t,z,e);B[e]?B[e].p(s,n):(B[e]=E(s),B[e].c(),B[e].m(S,null))}for(;e<B.length;e+=1)B[e].d(1);B.length=z.length}},i:d,o:d,d(t){l(s),l(T),l(w),l(b),l(x),t&&l(H),t&&l($),t&&l(I),t&&l(q),t&&l(D),t&&l(S),y(B,t)}}}async function T({params:t}){const e=await this.fetch(`blog/${t.slug}.json`),s=await e.json();if(200===e.status)return{post:s};this.error(e.status,s.message)}function w(t,e,s){let{post:n}=e;return t.$$set=t=>{"post"in t&&s(0,n=t.post)},[n]}export default class extends t{constructor(t){super(),e(this,t,w,M,s,{post:0})}}export{T as preload};
