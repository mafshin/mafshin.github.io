import{_ as t,a as n,b as r,c as e,i as o,d as s,S as c,s as f,f as a,t as u,j as i,k as l,l as h,g as p,m as v,n as g,o as d,r as m,e as R,q as b,h as y,u as E,p as j,v as x}from"./client.cb86e9b7.js";function D(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var o,s=n(t);if(e){var c=n(this).constructor;o=Reflect.construct(s,arguments,c)}else o=s.apply(this,arguments);return r(this,o)}}function L(t,n,r){var e=t.slice();return e[1]=n[r],e}function S(t){var n,r,e,o,s,c=t[1].title+"";return{c:function(){n=a("li"),r=a("a"),e=u("Title of post: "),o=u(c),this.h()},l:function(t){n=i(t,"LI",{});var s=l(n);r=i(s,"A",{rel:!0,href:!0});var f=l(r);e=h(f,"Title of post: "),o=h(f,c),f.forEach(p),s.forEach(p),this.h()},h:function(){v(r,"rel","prefetch"),v(r,"href",s="blog/"+t[1].slug)},m:function(t,s){g(t,n,s),d(n,r),d(r,e),d(r,o)},p:function(t,n){1&n&&c!==(c=t[1].title+"")&&m(o,c),1&n&&s!==(s="blog/"+t[1].slug)&&v(r,"href",s)},d:function(t){t&&p(n)}}}function T(t){for(var n,r,e,o,s,c=t[0],f=[],m=0;m<c.length;m+=1)f[m]=S(L(t,c,m));return{c:function(){n=R(),r=a("h1"),e=u("Recent posts"),o=R(),s=a("ul");for(var t=0;t<f.length;t+=1)f[t].c();this.h()},l:function(t){b('[data-svelte="svelte-hfp9t8"]',document.head).forEach(p),n=y(t),r=i(t,"H1",{});var c=l(r);e=h(c,"Recent posts"),c.forEach(p),o=y(t),s=i(t,"UL",{class:!0});for(var a=l(s),u=0;u<f.length;u+=1)f[u].l(a);a.forEach(p),this.h()},h:function(){document.title="Blog",v(s,"class","svelte-1frg2tf")},m:function(t,c){g(t,n,c),g(t,r,c),d(r,e),g(t,o,c),g(t,s,c);for(var a=0;a<f.length;a+=1)f[a].m(s,null)},p:function(t,n){var r=E(n,1)[0];if(1&r){var e;for(c=t[0],e=0;e<c.length;e+=1){var o=L(t,c,e);f[e]?f[e].p(o,r):(f[e]=S(o),f[e].c(),f[e].m(s,null))}for(;e<f.length;e+=1)f[e].d(1);f.length=c.length}},i:j,o:j,d:function(t){t&&p(n),t&&p(r),t&&p(o),t&&p(s),x(f,t)}}}function $(){return this.fetch("blog.json").then((function(t){return t.json()})).then((function(t){return{posts:t}}))}function k(t,n,r){var e=n.posts;return t.$$set=function(t){"posts"in t&&r(0,e=t.posts)},[e]}var q=function(n){t(a,c);var r=D(a);function a(t){var n;return e(this,a),n=r.call(this),o(s(n),t,k,T,f,{posts:0}),n}return a}();export default q;export{$ as preload};
