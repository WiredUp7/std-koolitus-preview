/* Look360 - keelevaheti (lipud) + IP-suunaja, jagatud koigi lehtede vahel.
   Iga leht maarab enne selle skripti laadimist window.LANGFILES = {keel: failinimi}
   (build_i18n.py taidab selle lehe kaupa). Lipunimesid ei kuvata, ainult lipud. */
(function(){
  var LF = window.LANGFILES || {et:"index.html"};
  var ORDER = ["et","en","fi","sv","no","da","lv","lt","pl","uk"];
  var NAME = {et:"Eesti",en:"English",fi:"Suomi",sv:"Svenska",no:"Norsk",da:"Dansk",lv:"Latviešu",lt:"Lietuvių",pl:"Polski",uk:"Українська"};
  var CC = {EE:"et",FI:"fi",SE:"sv",NO:"no",DK:"da",LV:"lv",LT:"lt",PL:"pl",UA:"uk"};
  var FLAGS = {
    et:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#0072CE"/><rect y="5.33" width="24" height="5.34" fill="#000"/><rect y="10.67" width="24" height="5.33" fill="#fff"/></svg>',
    en:'<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="4"/><path d="M0 0 30 20M30 0 0 20" stroke="#C8102E" stroke-width="2"/><rect x="12" width="6" height="20" fill="#fff"/><rect y="7" width="30" height="6" fill="#fff"/><rect x="13.5" width="3" height="20" fill="#C8102E"/><rect y="8.5" width="30" height="3" fill="#C8102E"/></svg>',
    fi:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/><rect x="7" width="4" height="16" fill="#003580"/><rect y="6" width="24" height="4" fill="#003580"/></svg>',
    sv:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#006AA7"/><rect x="7" width="4" height="16" fill="#FECC00"/><rect y="6" width="24" height="4" fill="#FECC00"/></svg>',
    no:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#EF2B2D"/><rect x="6" width="6" height="16" fill="#fff"/><rect y="5" width="24" height="6" fill="#fff"/><rect x="7.5" width="3" height="16" fill="#002868"/><rect y="6.5" width="24" height="3" fill="#002868"/></svg>',
    da:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#C8102E"/><rect x="7" width="4" height="16" fill="#fff"/><rect y="6" width="24" height="4" fill="#fff"/></svg>',
    lv:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#9E3039"/><rect y="6.4" width="24" height="3.2" fill="#fff"/></svg>',
    lt:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#FDB913"/><rect y="5.33" width="24" height="5.34" fill="#006A44"/><rect y="10.67" width="24" height="5.33" fill="#C1272D"/></svg>',
    pl:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/><rect y="8" width="24" height="8" fill="#DC143C"/></svg>',
    uk:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#0057B7"/><rect y="8" width="24" height="8" fill="#FFD700"/></svg>'
  };
  var KEY="radar_lang", GK="radar_geo";
  var langs = ORDER.filter(function(c){return LF[c]});
  var cur = (document.documentElement.lang||"et").toLowerCase();
  function fileFor(c){return LF[c]||LF.en||"en.html";}
  function go(c){try{localStorage.setItem(KEY,c)}catch(e){} if(c!==cur)location.href=fileFor(c);}

  var host = document.getElementById("langsel");
  if(host){
    host.innerHTML='<button type="button" class="langbtn" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-label="'+(NAME[cur]||cur)+'"><span class="flag">'+(FLAGS[cur]||FLAGS.en)+'</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg></button>'
      +'<div class="langmenu" id="langMenu">'+langs.map(function(c){return '<a data-c="'+c+'" title="'+NAME[c]+'" aria-label="'+NAME[c]+'" class="'+(c===cur?"on":"")+'"><span class="flag">'+FLAGS[c]+'</span></a>';}).join('')+'</div>';
    var btn=document.getElementById("langBtn"), menu=document.getElementById("langMenu");
    btn.addEventListener("click",function(e){e.stopPropagation();var o=!menu.classList.contains("open");menu.classList.toggle("open",o);btn.setAttribute("aria-expanded",o);});
    document.addEventListener("click",function(){menu.classList.remove("open");btn.setAttribute("aria-expanded","false");});
    menu.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){go(a.dataset.c);});});
  }

  var params=new URLSearchParams(location.search), forced=(params.get("lang")||"").toLowerCase();
  if(forced){var fc=CC[forced.toUpperCase()]||forced; if(LF[fc]&&fc!==cur){go(fc);return;}}
  var stored=null;try{stored=localStorage.getItem(KEY)}catch(e){}
  if(stored){if(stored!==cur&&LF[stored])go(stored);return;}
  /* Otsimootorite robotid EI tohi geo-suunajat saada. Googlebot roomab USA-st,
     mille CC-kaardis vastet pole -> want="en" -> iga keeleleht suunaks /en peale
     ja Google margiks selle "Page with redirect" = indekseerimata. */
  if(/bot|crawl|spider|slurp|mediapartners|inspectiontool|headlesschrome/i.test(navigator.userAgent||""))return;
  var did=null;try{did=sessionStorage.getItem(GK)}catch(e){}
  if(did)return;
  try{sessionStorage.setItem(GK,"1")}catch(e){}
  fetch("https://www.cloudflare.com/cdn-cgi/trace",{cache:"no-store"}).then(function(r){return r.text();}).then(function(t){
    var m=t.match(/loc=([A-Z]{2})/), want=m?(CC[m[1]]||"en"):"en";
    if(want!==cur&&LF[want])location.replace(fileFor(want));
  }).catch(function(){});
})();
