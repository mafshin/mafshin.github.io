import{S as t,i as s,s as e,e as a,t as l,c as r,f as n,g as o,d as h,h as u,k as c,j as i,l as f,a as g,q as p,b as d,n as m,m as v}from"./client.a1e285be.js";function b(t,s,e){const a=t.slice();return a[2]=s[e],a}function j(t){let s,e,g,p,d=t[2].title+"";return{c(){s=a("li"),e=a("a"),g=l(d),this.h()},l(t){s=r(t,"LI",{});var a=n(s);e=r(a,"A",{rel:!0,href:!0});var l=n(e);g=o(l,d),l.forEach(h),a.forEach(h),this.h()},h(){u(e,"rel","prefetch"),u(e,"href",p="blog/"+t[2].slug)},m(t,a){c(t,s,a),i(s,e),i(e,g)},p(t,s){1&s&&d!==(d=t[2].title+"")&&f(g,d),1&s&&p!==(p="blog/"+t[2].slug)&&u(e,"href",p)},d(t){t&&h(s)}}}function E(t){let s,e,l=t[0],o=[];for(let s=0;s<l.length;s+=1)o[s]=j(b(t,l,s));return{c(){s=g(),e=a("ul");for(let t=0;t<o.length;t+=1)o[t].c();this.h()},l(t){p('[data-svelte="svelte-zuawp3"]',document.head).forEach(h),s=d(t),e=r(t,"UL",{});var a=n(e);for(let t=0;t<o.length;t+=1)o[t].l(a);a.forEach(h),this.h()},h(){document.title="Tagged posts"},m(t,a){c(t,s,a),c(t,e,a);for(let t=0;t<o.length;t+=1)o[t].m(e,null)},p(t,[s]){if(1&s){let a;for(l=t[0],a=0;a<l.length;a+=1){const r=b(t,l,a);o[a]?o[a].p(r,s):(o[a]=j(r),o[a].c(),o[a].m(e,null))}for(;a<o.length;a+=1)o[a].d(1);o.length=l.length}},i:m,o:m,d(t){t&&h(s),t&&h(e),v(o,t)}}}async function w({params:t}){const s=await this.fetch(`tag/${t.slug}.json`),e=await s.json();if(200===s.status)return{posts:e};this.error(s.status,e.message)}function x(t,s,e){let{posts:a}=s,{slug:l}=s;return t.$$set=t=>{"posts"in t&&e(0,a=t.posts),"slug"in t&&e(1,l=t.slug)},[a,l]}export default class extends t{constructor(t){super(),s(this,t,x,E,e,{posts:0,slug:1})}}export{w as preload};
