import{x as t,_ as n,a as e,b as r,c as o,i as a,d as c,S as s,s as i,e as u,t as f,g as l,k as h,l as p,h as m,m as g,o as v,n as d,r as y,f as E,q as b,j as x,w as T,p as w,u as M}from"./client.997b1047.js";import{_ as A}from"./asyncToGenerator.5229e80b.js";function j(t){var n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var o,a=e(t);if(n){var c=e(this).constructor;o=Reflect.construct(a,arguments,c)}else o=a.apply(this,arguments);return r(this,o)}}function R(t,n,e){var r=t.slice();return r[1]=n[e],r}function k(t){var n,e,r,o,a=t[1]+"";return{c:function(){n=u("li"),e=u("a"),r=f(a),this.h()},l:function(t){n=l(t,"LI",{class:!0});var o=h(n);e=l(o,"A",{rel:!0,href:!0});var c=h(e);r=p(c,a),c.forEach(m),o.forEach(m),this.h()},h:function(){g(e,"rel","prefetch"),g(e,"href",o="tag/"+t[1]),g(n,"class","svelte-wc0972")},m:function(t,o){v(t,n,o),d(n,e),d(e,r)},p:function(t,n){1&n&&a!==(a=t[1]+"")&&y(r,a),1&n&&o!==(o="tag/"+t[1])&&g(e,"href",o)},d:function(t){t&&m(n)}}}function L(t){var n,e,r,o,a,c,s,i,A,j,L,D,H,I,S,$,_,q=t[0].title+"",G=t[0].html+"";document.title=n=t[0].title;for(var P=t[0].tags,U=[],V=0;V<P.length;V+=1)U[V]=k(R(t,P,V));return{c:function(){e=u("meta"),o=u("meta"),a=u("meta"),s=u("meta"),A=u("meta"),L=E(),D=u("h1"),H=f(q),I=E(),S=u("div"),$=E(),_=u("ul");for(var t=0;t<U.length;t+=1)U[t].c();this.h()},l:function(t){var n=b('[data-svelte="svelte-1xafkcv"]',document.head);e=l(n,"META",{property:!0,content:!0}),o=l(n,"META",{property:!0,content:!0}),a=l(n,"META",{property:!0,content:!0}),s=l(n,"META",{property:!0,content:!0}),A=l(n,"META",{property:!0,content:!0}),n.forEach(m),L=x(t),D=l(t,"H1",{});var r=h(D);H=p(r,q),r.forEach(m),I=x(t),S=l(t,"DIV",{class:!0}),h(S).forEach(m),$=x(t),_=l(t,"UL",{class:!0});for(var c=h(_),i=0;i<U.length;i+=1)U[i].l(c);c.forEach(m),this.h()},h:function(){g(e,"property","og:title"),g(e,"content",r=t[0].title),g(o,"property","og:type"),g(o,"content","website"),g(a,"property","og:url"),g(a,"content",c="https://mafshin.com/blog/"+t[0].slug),g(s,"property","og:image"),g(s,"content",i="https://mafshin.com/"+t[0].image),g(A,"property","og:description"),g(A,"content",j=t[0].description),g(S,"class","content svelte-wc0972"),g(_,"class","tags svelte-wc0972")},m:function(t,n){d(document.head,e),d(document.head,o),d(document.head,a),d(document.head,s),d(document.head,A),v(t,L,n),v(t,D,n),d(D,H),v(t,I,n),v(t,S,n),S.innerHTML=G,v(t,$,n),v(t,_,n);for(var r=0;r<U.length;r+=1)U[r].m(_,null)},p:function(t,o){var u=T(o,1)[0];if(1&u&&n!==(n=t[0].title)&&(document.title=n),1&u&&r!==(r=t[0].title)&&g(e,"content",r),1&u&&c!==(c="https://mafshin.com/blog/"+t[0].slug)&&g(a,"content",c),1&u&&i!==(i="https://mafshin.com/"+t[0].image)&&g(s,"content",i),1&u&&j!==(j=t[0].description)&&g(A,"content",j),1&u&&q!==(q=t[0].title+"")&&y(H,q),1&u&&G!==(G=t[0].html+"")&&(S.innerHTML=G),1&u){var f;for(P=t[0].tags,f=0;f<P.length;f+=1){var l=R(t,P,f);U[f]?U[f].p(l,u):(U[f]=k(l),U[f].c(),U[f].m(_,null))}for(;f<U.length;f+=1)U[f].d(1);U.length=P.length}},i:w,o:w,d:function(t){m(e),m(o),m(a),m(s),m(A),t&&m(L),t&&m(D),t&&m(I),t&&m(S),t&&m($),t&&m(_),M(U,t)}}}function D(t){return H.apply(this,arguments)}function H(){return(H=A(t.mark((function n(e){var r,o,a;return t.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.params,t.next=3,this.fetch("blog/".concat(r.slug,".json"));case 3:return o=t.sent,t.next=6,o.json();case 6:if(a=t.sent,200!==o.status){t.next=11;break}return t.abrupt("return",{post:a});case 11:this.error(o.status,a.message);case 12:case"end":return t.stop()}}),n,this)})))).apply(this,arguments)}function I(t,n,e){var r=n.post;return t.$$set=function(t){"post"in t&&e(0,r=t.post)},[r]}var S=function(t){n(r,s);var e=j(r);function r(t){var n;return o(this,r),n=e.call(this),a(c(n),t,I,L,i,{post:0}),n}return r}();export default S;export{D as preload};
