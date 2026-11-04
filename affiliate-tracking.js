/* Workflow Desk: affiliate click event integration.
   Configure a GA4 measurement ID in analytics-config.js to send events.
   Until configured, no third-party analytics requests are made.
*/
(function(){
  var id=window.WORKFLOW_DESK_GA4_ID;
  if(typeof id!=="string" || !/^G-[A-Z0-9]+$/.test(id)) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  var s=document.createElement("script");s.async=true;
  s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(id);
  document.head.appendChild(s);
  window.gtag("js",new Date());
  window.gtag("config",id,{send_page_view:true});
  document.addEventListener("click",function(event){
    var a=event.target.closest && event.target.closest("a[href]");
    if(!a) return;
    var u;try{u=new URL(a.href,location.href);}catch(e){return;}
    if(u.hostname!=="www.make.com" && u.hostname!=="make.com")return;
    if(u.searchParams.get("pc")!=="lenixeduardo")return;
    window.gtag("event","affiliate_click",{affiliate:"make",link_url:u.origin+u.pathname,article_path:location.pathname,transport_type:"beacon"});
  },{capture:true});
})();
