import{x as t,_ as e,a as n,b as r,c as a,i as s,d as o,S as c,s as i,e as u,t as f,g as l,k as h,l as p,h as m,m as d,o as v,n as g,r as y,f as E,q as b,j as x,w,p as T,u as A,y as M}from"./client.45062851.js";import{_ as j}from"./asyncToGenerator.5229e80b.js";function D(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var a,s=n(t);if(e){var o=n(this).constructor;a=Reflect.construct(s,arguments,o)}else a=s.apply(this,arguments);return r(this,a)}}var R=M.document;function k(t,e,n){var r=t.slice();return r[2]=e[n],r}function L(t){var e,n,r,a,s=t[2]+"";return{c:function(){e=u("li"),n=u("a"),r=f(s),this.h()},l:function(t){e=l(t,"LI",{class:!0});var a=h(e);n=l(a,"A",{rel:!0,href:!0});var o=h(n);r=p(o,s),o.forEach(m),a.forEach(m),this.h()},h:function(){d(n,"rel","prefetch"),d(n,"href",a="tag/"+t[2]),d(e,"class","svelte-wc0972")},m:function(t,a){v(t,e,a),g(e,n),g(n,r)},p:function(t,e){1&e&&s!==(s=t[2]+"")&&y(r,s),1&e&&a!==(a="tag/"+t[2])&&d(n,"href",a)},d:function(t){t&&m(e)}}}function q(t){var e,n,r,a,s,o,c,i,M,j,D,q,H,I,_,S,V,$,C,G,P=t[0].title+"",U=t[0].html+"";R.title=e=t[0].title;for(var z=t[0].tags,B=[],F=0;F<z.length;F+=1)B[F]=L(k(t,z,F));return{c:function(){n=u("meta"),a=u("meta"),s=u("meta"),c=u("meta"),M=u("meta"),D=E(),q=u("h1"),H=f(P),I=E(),_=u("div"),S=E(),V=u("ul");for(var t=0;t<B.length;t+=1)B[t].c();$=E(),C=u("div"),G=E(),this.h()},l:function(t){var e=b('[data-svelte="svelte-1xafkcv"]',R.head);n=l(e,"META",{property:!0,content:!0}),a=l(e,"META",{property:!0,content:!0}),s=l(e,"META",{property:!0,content:!0}),c=l(e,"META",{property:!0,content:!0}),M=l(e,"META",{property:!0,content:!0}),e.forEach(m),D=x(t),q=l(t,"H1",{});var r=h(q);H=p(r,P),r.forEach(m),I=x(t),_=l(t,"DIV",{class:!0}),h(_).forEach(m),S=x(t),V=l(t,"UL",{class:!0});for(var o=h(V),i=0;i<B.length;i+=1)B[i].l(o);o.forEach(m),$=x(t),C=l(t,"DIV",{id:!0}),h(C).forEach(m),G=x(t),this.h()},h:function(){d(n,"property","og:title"),d(n,"content",r=t[0].title),d(a,"property","og:type"),d(a,"content","website"),d(s,"property","og:url"),d(s,"content",o="https://mafshin.com/blog/"+t[0].slug),d(c,"property","og:image"),d(c,"content",i="https://mafshin.com/"+t[0].image),d(M,"property","og:description"),d(M,"content",j=t[0].description),d(_,"class","content svelte-wc0972"),d(V,"class","tags svelte-wc0972"),d(C,"id","disqus_thread")},m:function(t,e){g(R.head,n),g(R.head,a),g(R.head,s),g(R.head,c),g(R.head,M),v(t,D,e),v(t,q,e),g(q,H),v(t,I,e),v(t,_,e),_.innerHTML=U,v(t,S,e),v(t,V,e);for(var r=0;r<B.length;r+=1)B[r].m(V,null);v(t,$,e),v(t,C,e),v(t,G,e)},p:function(t,a){var u=w(a,1)[0];if(1&u&&e!==(e=t[0].title)&&(R.title=e),1&u&&r!==(r=t[0].title)&&d(n,"content",r),1&u&&o!==(o="https://mafshin.com/blog/"+t[0].slug)&&d(s,"content",o),1&u&&i!==(i="https://mafshin.com/"+t[0].image)&&d(c,"content",i),1&u&&j!==(j=t[0].description)&&d(M,"content",j),1&u&&P!==(P=t[0].title+"")&&y(H,P),1&u&&U!==(U=t[0].html+"")&&(_.innerHTML=U),1&u){var f;for(z=t[0].tags,f=0;f<z.length;f+=1){var l=k(t,z,f);B[f]?B[f].p(l,u):(B[f]=L(l),B[f].c(),B[f].m(V,null))}for(;f<B.length;f+=1)B[f].d(1);B.length=z.length}},i:T,o:T,d:function(t){m(n),m(a),m(s),m(c),m(M),t&&m(D),t&&m(q),t&&m(I),t&&m(_),t&&m(S),t&&m(V),A(B,t),t&&m($),t&&m(C),t&&m(G)}}}function H(t){return I.apply(this,arguments)}function I(){return(I=j(t.mark((function e(n){var r,a,s;return t.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=n.params,t.next=3,this.fetch("blog/".concat(r.slug,".json"));case 3:return a=t.sent,t.next=6,a.json();case 6:if(s=t.sent,200!==a.status){t.next=11;break}return t.abrupt("return",{post:s});case 11:this.error(a.status,s.message);case 12:case"end":return t.stop()}}),e,this)})))).apply(this,arguments)}function _(t,e,n){var r,a,s=e.post;return r=document,(a=r.createElement("script")).src="https://mafshin.disqus.com/embed.js",a.setAttribute("data-timestamp",+new Date),(r.head||r.body).appendChild(a),t.$$set=function(t){"post"in t&&n(0,s=t.post)},[s]}var S=function(t){e(r,c);var n=D(r);function r(t){var e;return a(this,r),e=n.call(this),s(o(e),t,_,q,i,{post:0}),e}return r}();export default S;export{H as preload};
