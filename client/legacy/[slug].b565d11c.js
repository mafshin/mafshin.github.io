import{x as t,_ as n,a as e,b as r,c as a,i as o,d as s,S as c,s as i,e as u,t as f,g as l,k as h,l as p,h as m,m as g,o as v,n as d,r as y,f as E,q as b,j as x,w,p as T,u as M}from"./client.c0c0c83c.js";import{_ as j}from"./asyncToGenerator.5229e80b.js";function A(t){var n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var a,o=e(t);if(n){var s=e(this).constructor;a=Reflect.construct(o,arguments,s)}else a=o.apply(this,arguments);return r(this,a)}}function R(t,n,e){var r=t.slice();return r[1]=n[e],r}function L(t){var n,e,r,a,o=t[1]+"";return{c:function(){n=u("li"),e=u("a"),r=f(o),this.h()},l:function(t){n=l(t,"LI",{class:!0});var a=h(n);e=l(a,"A",{rel:!0,href:!0});var s=h(e);r=p(s,o),s.forEach(m),a.forEach(m),this.h()},h:function(){g(e,"rel","prefetch"),g(e,"href",a="tag/"+t[1]),g(n,"class","svelte-wc0972")},m:function(t,a){v(t,n,a),d(n,e),d(e,r)},p:function(t,n){1&n&&o!==(o=t[1]+"")&&y(r,o),1&n&&a!==(a="tag/"+t[1])&&g(e,"href",a)},d:function(t){t&&m(n)}}}function k(t){var n,e,r,a,o,s,c,i,j,A,k,D,H,I,S,$=t[0].title+"",_=t[0].html+"";document.title=n=t[0].title;for(var q=t[0].tags,G=[],P=0;P<q.length;P+=1)G[P]=L(R(t,q,P));return{c:function(){e=u("meta"),a=u("meta"),o=u("meta"),c=u("meta"),j=E(),A=u("h1"),k=f($),D=E(),H=u("div"),I=E(),S=u("ul");for(var t=0;t<G.length;t+=1)G[t].c();this.h()},l:function(t){var n=b('[data-svelte="svelte-1g92e7g"]',document.head);e=l(n,"META",{property:!0,content:!0}),a=l(n,"META",{property:!0,content:!0}),o=l(n,"META",{property:!0,content:!0}),c=l(n,"META",{property:!0,content:!0}),n.forEach(m),j=x(t),A=l(t,"H1",{});var r=h(A);k=p(r,$),r.forEach(m),D=x(t),H=l(t,"DIV",{class:!0}),h(H).forEach(m),I=x(t),S=l(t,"UL",{class:!0});for(var s=h(S),i=0;i<G.length;i+=1)G[i].l(s);s.forEach(m),this.h()},h:function(){g(e,"property","og:title"),g(e,"content",r=t[0].title),g(a,"property","og:type"),g(a,"content","website"),g(o,"property","og:url"),g(o,"content",s="https://mafshin.com/blog/"+t[0].slug),g(c,"property","og:image"),g(c,"content",i="https://mafshin.com/"+t[0].image),g(H,"class","content svelte-wc0972"),g(S,"class","tags svelte-wc0972")},m:function(t,n){d(document.head,e),d(document.head,a),d(document.head,o),d(document.head,c),v(t,j,n),v(t,A,n),d(A,k),v(t,D,n),v(t,H,n),H.innerHTML=_,v(t,I,n),v(t,S,n);for(var r=0;r<G.length;r+=1)G[r].m(S,null)},p:function(t,a){var u=w(a,1)[0];if(1&u&&n!==(n=t[0].title)&&(document.title=n),1&u&&r!==(r=t[0].title)&&g(e,"content",r),1&u&&s!==(s="https://mafshin.com/blog/"+t[0].slug)&&g(o,"content",s),1&u&&i!==(i="https://mafshin.com/"+t[0].image)&&g(c,"content",i),1&u&&$!==($=t[0].title+"")&&y(k,$),1&u&&_!==(_=t[0].html+"")&&(H.innerHTML=_),1&u){var f;for(q=t[0].tags,f=0;f<q.length;f+=1){var l=R(t,q,f);G[f]?G[f].p(l,u):(G[f]=L(l),G[f].c(),G[f].m(S,null))}for(;f<G.length;f+=1)G[f].d(1);G.length=q.length}},i:T,o:T,d:function(t){m(e),m(a),m(o),m(c),t&&m(j),t&&m(A),t&&m(D),t&&m(H),t&&m(I),t&&m(S),M(G,t)}}}function D(t){return H.apply(this,arguments)}function H(){return(H=j(t.mark((function n(e){var r,a,o;return t.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.params,t.next=3,this.fetch("blog/".concat(r.slug,".json"));case 3:return a=t.sent,t.next=6,a.json();case 6:if(o=t.sent,200!==a.status){t.next=11;break}return t.abrupt("return",{post:o});case 11:this.error(a.status,o.message);case 12:case"end":return t.stop()}}),n,this)})))).apply(this,arguments)}function I(t,n,e){var r=n.post;return t.$$set=function(t){"post"in t&&e(0,r=t.post)},[r]}var S=function(t){n(r,c);var e=A(r);function r(t){var n;return a(this,r),n=e.call(this),o(s(n),t,I,k,i,{post:0}),n}return r}();export default S;export{D as preload};
