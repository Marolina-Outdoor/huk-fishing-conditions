let frenzy_scripts = document.getElementById("frenzyCDN").dataset;
let frenzy_shop_currency = frenzy_scripts.moneyformat;
let frenzy_api_url = frenzy_scripts.frenzyurl;
let frenzy_api_key = frenzy_scripts.frenzyapikey;
const frenzy_shop = frenzy_scripts.shopurl;
const frenzy_shopifyurl = frenzy_scripts.shopifyurl;
let frenzy_community_url = frenzy_scripts.communityurl;
const frenzy_company_id = frenzy_scripts.company_id;
const frenzy_location_id = frenzy_scripts.location_id;
let isFrenzyGrid1Active = false;
let frenzy_root_url = '';

if (frenzy_shop) {
    frenzy_root_url = frenzy_shop;
}

let isCommunityEnabled = false;

if (frenzy_community_url) {
    isCommunityEnabled = true;
}

if (typeof __st == 'undefined') {
    __st = {
        p: "", rid: ""
    };
}

if (typeof Shopify == 'undefined') {
    Shopify = {
        shop: frenzy_shop,
        routes: {
            root: '/'
        }
    }
}

let pagination_arrow_Frenzy =
    '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>';
let close_arrow_Frenzy =
    '<svg viewBox="0 0 20 20"><path d="m11.414 10 4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path></svg>';
const filter_icon_Frenzy =
    '<svg viewBox="0 0 32 32"><path d="m26.18 27.18a1 1 0 0 0 1-1v-3.11a3.81 3.81 0 0 0 0-7.36v-9.89a1 1 0 0 0 -2 0v9.9a3.81 3.81 0 0 0 0 7.36v3.11a1 1 0 0 0 1 .99zm-1.83-7.79a1.83 1.83 0 1 1 1.83 1.83 1.83 1.83 0 0 1 -1.83-1.83z"/><path d="m16 27.18a1 1 0 0 0 1-1v-13.86a3.83 3.83 0 1 0 -2 0v13.86a1 1 0 0 0 1 1zm-1.83-18.53a1.83 1.83 0 1 1 1.83 1.82 1.83 1.83 0 0 1 -1.83-1.82z"/><path d="m4.82 19.68v6.5a1 1 0 0 0 2 0v-6.5a3.81 3.81 0 0 0 0-7.36v-6.5a1 1 0 0 0 -2 0v6.5a3.81 3.81 0 0 0 0 7.36zm1-5.51a1.83 1.83 0 1 1 -1.82 1.83 1.83 1.83 0 0 1 1.82-1.83z"/></svg>';
const search_icon_Frenzy =
    '<svg version="1.1" viewBox="0 0 512 512"><path d="M225.474,0C101.151,0,0,101.151,0,225.474c0,124.33,101.151,225.474,225.474,225.474 c124.33,0,225.474-101.144,225.474-225.474C450.948,101.151,349.804,0,225.474,0z M225.474,409.323 c-101.373,0-183.848-82.475-183.848-183.848S124.101,41.626,225.474,41.626s183.848,82.475,183.848,183.848 S326.847,409.323,225.474,409.323z"></path><path d="M505.902,476.472L386.574,357.144c-8.131-8.131-21.299-8.131-29.43,0c-8.131,8.124-8.131,21.306,0,29.43l119.328,119.328 c4.065,4.065,9.387,6.098,14.715,6.098c5.321,0,10.649-2.033,14.715-6.098C514.033,497.778,514.033,484.596,505.902,476.472z"></path></svg>';
const filter_info_icon = '<svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z"/></svg>';
let authUrl_Frenzy =
    "https://shopify.plugin.frenzy.me/frenzy-private/public/api";
let product_id_Frenzy = __st.p === "product" ? __st.rid : "",
    frenzyCartProductId = "";
let variant_id_Frenzy = "",
    frenzy_suggestion_name = "",
    frenzyCartVariantId = "",
    sw_view_all_button_text = "Show all results for ",
    sw_view_all_button_text_mobile = "Show all results for ",
    sw_view_all_button_short_text = "Show all results",
    sw_view_all_button_short_text_mobile = "Show all results";
let frenzyPageScroll = true,
    frenzyPageScrollNo = 0;
let filter_query = [];
let old_dataResults = [];
let previous_status = true;
let current_position = window.scrollY;
let dataConfig = "";
let request_id = 0;
let dataPageName = "";
let this_click_event = "";
let sidebar_filter_open_hide = '';
let frenzy_search_suggest_is_focus = true;
let frenzysearchSugesstionQuery = '';
let x_shop = Shopify.shop ? Shopify.shop : '';
const frenzyShop = Shopify?.shop ? Shopify.shop : frenzy_shopifyurl ? frenzy_shopifyurl : '';
let old_selected_key = '',$bundle_frenzy_sku = "",frenzyMultipleBundles = '';
if (__st.p === "product") {
    variant_id_Frenzy =
        document.querySelector('[name="id"]')?.value &&
        document.querySelector('[name="id"]').value != ""
            ? document.querySelector('[name="id"]').value
            : ShopifyAnalytics?.meta?.product?.variants[0].id;
}
let frenzy_collection_id = null;
if (__st.p === "collection") {
  frenzy_collection_id = __st.rid;
}
let user_id_Frenzy = "";
let get_cart_items = false;
let checkCartItems = true;
let frenzy_collection_tags = [];
let frenzy_inputLeft = "",
    frenzy_inputRight = "",
    frenzy_thumbLeft = "",
    frenzy_thumbRight = "",
    frenzy_range = "";

const FRENZY_MIN_PRICE = 0,
    FRENZY_MAX_PRICE = 1000000000;
let frenzyMinPriceRange = "",
    frenzyMaxPriceRange = "";
let frenzyAbsoluteMinPriceRange = "",
    frenzyAbsoluteMaxPriceRange = "";
let isFrenzyFilterPriceUpdated = false;
let isFrenzyFilterPriceRangeInitialize = true;
let isFrenzyBundleRedirectOption = 0;
let isSelectedFilterClickEvent = false;
let useSpellCheck = true;
let collectionSearchQueryVal = false;
let controlPageRefresh = false;
let empty_cart_carousel_status = false;
let frenzy_auto_suggestion_close;

function getFrenzyCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
/* Image resizer */
const FrenzyImageResizer = function (t, r) {
    try {
        if ("original" == r) return t;
        let e = t.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
        return e[1] + "_" + r + "." + e[2];
    } catch (r) {
        return t;
    }
};

user_id_Frenzy = getFrenzyCookie("_shopify_y");
let currency_symbol_Frenzy = "";
let selected_page_Frenzy = 1,
    is_frenzy_page_css = true;
(total_page_no_Frenzy = 0),
    (isFilterApplyPrice_Frenzy = false),
    (isDisabledApplyBtn_Frenzy = false),
    (frenzy_blog_search = ""),
    (isSeletedSortValue_Frenzy = "best match");
let filterArray_Frenzy = { org_price: { min: FRENZY_MIN_PRICE, max: FRENZY_MAX_PRICE } };
let filter_order_Frenzy = [];
/* Money Format */
let money_format_Frenzy = function (t, r) {
    function e(t, r) {
        return void 0 === t ? r : t;
    }
    function a(t, r, a, o) {
        if (
            ((r = e(r, 2)),
            (a = e(a, ",")),
            (o = e(o, ".")),
            isNaN(t) || null == t)
        )
            return 0;
        t = (t / 100).toFixed(r);
        var n = t.split(".");
        return (
            n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) +
            (n[1] ? o + n[1] : "")
        );
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var o = "",
        n = /\{\{\s*(\w+)\s*\}\}/,
        i = r || this.money_format;
    switch (i.match(n)[1]) {
        case "amount":
            o = a(t, 2);
            break;
        case "amount_no_decimals":
            o = a(t, 0);
            break;
        case "amount_with_comma_separator":
            o = a(t, 2, ".", ",");
            break;
        case "amount_with_space_separator":
            o = a(t, 2, " ", ",");
            break;
        case "amount_with_period_and_space_separator":
            o = a(t, 2, " ", ".");
            break;
        case "amount_no_decimals_with_comma_separator":
            o = a(t, 0, ".", ",");
            break;
        case "amount_no_decimals_with_space_separator":
            o = a(t, 0, ".", "");
            break;
        case "amount_with_space_separator":
            o = a(t, 2, ",", "");
            break;
        case "amount_with_apostrophe_separator":
            o = a(t, 2, "'", ".");
    }
    return i.replace(n, o);
};
let shopURL_Frenzy = window.location.origin;
let searchURL_Frenzy = window.location.pathname;
let urlParams_Frenzy = new URLSearchParams(window.location.search);
let frenzyBlogfilterArray = [],
    frenzyAllSkus = [];
if (urlParams_Frenzy.get("page")) {
    selected_page_Frenzy = parseInt(urlParams_Frenzy.get("page"));
}
if (urlParams_Frenzy.get("sort")) {
    isSeletedSortValue_Frenzy = urlParams_Frenzy.get("sort");
}
if (urlParams_Frenzy.get("articleSearch")) {
    frenzy_blog_search = urlParams_Frenzy.get("articleSearch");
}
if (urlParams_Frenzy.get("blogname")) {
    const frenzyBlogfilterclone = urlParams_Frenzy.get("blogname");
    frenzyBlogfilterArray = frenzyBlogfilterclone.split(",");
}
if (urlParams_Frenzy.get("price")) {
    isFilterApplyPrice_Frenzy = true;
}

/* Append stylesheet */
let swiper_link_Frenzy = document.createElement("link");
swiper_link_Frenzy.rel = "stylesheet";
swiper_link_Frenzy.type = "text/css";
swiper_link_Frenzy.href =
    "https://frenzy.cdn.appdomain.cloud/frenzy-plugin/swiper.min.css";

// Frenzy css
let head_Frenzy = document.getElementsByTagName("HEAD")[0];
let search_link_Frenzy = document.createElement("link");
search_link_Frenzy.rel = "stylesheet";
search_link_Frenzy.type = "text/css";
search_link_Frenzy.href =
    "https://frenzy.cdn.appdomain.cloud/frenzy-plugin/frenzy-search.css";
    // "https://frenzy.cdn.appdomain.cloud/frenzy-devlopment/frenzy-search-ada-final.css";

// Frenzy custom css
let client_specific_css = document.createElement("link");
client_specific_css.rel = "stylesheet";
client_specific_css.type = "text/css";
client_specific_css.href = frenzy_api_url+"/custom-css";

head_Frenzy.appendChild(swiper_link_Frenzy);
head_Frenzy.appendChild(search_link_Frenzy);
// head_Frenzy.appendChild(client_specific_css);

if (typeof Swiper === 'undefined') {
  const script_Frenzy = document.createElement("script");
  script_Frenzy.src =
      "https://frenzy.cdn.appdomain.cloud/frenzy-plugin/swiper.min.js";
  // Append to the `head` element
  head_Frenzy.appendChild(script_Frenzy);
}

const getCustomCss = async () => {
  const response = await fetch(frenzy_api_url+"/custom-css",{method: "GET",headers: {"Content-Type": "application/json","x-frenzy-authorization": frenzy_api_key,"X-Shop": frenzyShop}});
  const result = await response.text();
  const custom_style = '<style id="style_tag">'+result+'<style>';
  head_Frenzy.insertAdjacentHTML("beforeend",custom_style);
}
getCustomCss();
/*
Tool Cool Range Slider v4.0.27
https://github.com/mzusin/toolcool-range-slider
MIT License
Copyright (c) 2022-present, Miriam Zusin
*/
(()=>{var Wn=Object.defineProperty;var Et=Math.pow,Kn=(r,i,t)=>i in r?Wn(r,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[i]=t;var ae=(r,i,t)=>(Kn(r,typeof i!="symbol"?i+"":i,t),t);var St=(r,i)=>` ${i&&i.length>0?i.map(t=>`<link rel="stylesheet" href="${t}" />`).join(""):""} <style> ${r} </style> <div class="range-slider-box"> <div class="row"> <div id="range-slider" class="range-slider"> <div class="container"> <div class="panel"></div> <div class="panel-fill"></div> <div class="container"> <div class="pointer" tabindex="0" role="slider"> <div class="pointer-shape"></div> </div> </div> </div> </div> </div> </div>`;var At=":host{--width:300px;--height:4px;--opacity:.4;--panel-bg:#3333;--panel-bg-hover:#3333;--panel-bg-fill:#333;--panel-bg-border-radius:1rem;--pointer-width:1rem;--pointer-height:1rem;--pointer-bg:#fff;--pointer-bg-hover:#dcdcdc;--pointer-bg-focus:#dcdcdc;--pointer-shadow:0 0 2px rgba(0,0,0,0.8);--pointer-shadow-hover:0 0 2px #000;--pointer-shadow-focus:var(--pointer-shadow-hover);--pointer-border:1px solid hsla(0,0%,88%,0.5);--pointer-border-hover:1px solid #94a3b8;--pointer-border-focus:var(--pointer-border-hover);--pointer-border-radius:100%;--animate-onclick:.3s}:host{max-width:100%}.range-slider-box{display:flex;position:relative;flex-direction:column;padding-top:20px;}.range-slider{position:relative;width:var(--width,100%);height:var(--height,04px);touch-action:none;max-width:100%;box-sizing:border-box;cursor:pointer}.row{width:100%;display:flex;align-items:center;position:relative;}.range-slider.disabled{opacity:var(--opacity,0.4);cursor:default}.pointer.disabled{-webkit-filter:brightness(0.8);filter:brightness(0.8);cursor:default}.range-slider *{box-sizing:border-box}.container{position:absolute;width:100%;height:100%}.panel{position:absolute;z-index:0;width:100%;height:100%;background:var(--panel-bg,#2d4373);border-radius:var(--panel-bg-border-radius,1rem);overflow:hidden;transition:.3s all ease}.panel-fill{background:var(--panel-bg-fill,#333);border-radius:var(--panel-bg-border-radius,1rem);overflow:hidden;height:100%;position:absolute;z-index:0}.panel:hover{background:var(--panel-bg-hover,#5f79b7)}.disabled .panel:hover{background:var(--panel-bg,#5f79b7)}.pointer{position:absolute;z-index:1;outline:0;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.pointer-shape{-webkit-transform: translateX(-50%);transform: translateX(-50%);transition: .3s all ease;width: 20px;height: 20px;top: 0;background-color: #000000;border: 2px solid #000000;-webkit-border-radius: 100%;-moz-border-radius: 100%;-ms-border-radius: 100%;-o-border-radius: 100%;border-radius: 100%;position:relative}.pointer-shape::after{    background-color: #000000;width: 10px;height: 10px;top: 0;bottom: 0;left: 0;right: 0;margin: auto;-webkit-border-radius: 100%;-moz-border-radius: 100%;-ms-border-radius: 100%;-o-border-radius: 100%;border-radius: 100%;position: absolute;content:''}.disabled .pointer-shape:hover{background:var(--pointer-bg,#fff);background-size:contain;border:var(--pointer-border);box-shadow:var(--pointer-shadow)}.disabled .pointer:focus .pointer-shape{background:var(--pointer-bg,#fff);background-size:contain;border:var(--pointer-border);box-shadow:var(--pointer-shadow)}.type-vertical .range-slider{--width:4px;--height:300px;max-height:100%}.type-vertical .range-slider .pointer{left:50%}.type-vertical .range-slider .panel-fill{width:100%}.type-vertical.range-slider-box{flex-direction:row}.type-vertical .row{flex-direction:column}.animate-on-click .pointer,.animate-on-click .panel-fill{transition:all var(--animate-onclick)}.range-dragging .panel-fill{cursor:move}";var le="pointers-overlap",ue="pointers-min-distance",de="pointers-max-distance",ce="range-dragging",pe="data",be="min",ge="max",fe="step",me="round",he="type",ve="theme",ye="rtl",xe="btt",Pe="disabled",Ee="keyboard-disabled",Se="mousewheel-disabled",Tt="slider-width",Mt="slider-height",wt="slider-radius",Dt="slider-bg",Lt="slider-bg-hover",Ct="slider-bg-fill",kt="pointer-width",Ht="pointer-height",It="pointer-radius",Rt="pointer-bg",Bt="pointer-bg-hover",Ot="pointer-bg-focus",Ft="pointer-shadow",Vt="pointer-shadow-hover",Nt="pointer-shadow-focus",Ut="pointer-border",zt="pointer-border-hover",Wt="pointer-border-focus",Ae="animate-onclick",Kt="css-links";var I="vertical",N="horizontal";var we=(r,i,t,n,a)=>{let d=i-r;return d===0?t:(n-t)*(a-r)/d+t},O=r=>!isNaN(parseFloat(r))&&isFinite(r),E=(r,i)=>O(r)?Number(r):i,Ze=(r,i)=>i===0?0:Math.round(r/i)*i,jt=(r,i=1/0)=>{if(i===1/0)return r;let t=Et(10,i);return Math.round(r*t)/t},D=r=>r==null?!1:typeof r=="boolean"?r:r.trim().toLowerCase()==="true";var qt=(r,i)=>{r.dispatchEvent(new CustomEvent("onPointerClicked",{detail:{$pointer:i}}))},Xt=(r,i)=>{r.dispatchEvent(new CustomEvent("onMouseDown",{detail:{nativeEvent:i}}))},Gt=(r,i)=>{r.dispatchEvent(new CustomEvent("onMouseUp",{detail:{nativeEvent:i}}))},Yt=(r,i)=>{r.dispatchEvent(new CustomEvent("onKeyDown",{detail:{nativeEvent:i}}))},Jt=(r,i)=>{if(!i||i.length<=0)return;let t=i.map(a=>O(a)?E(a,a):a),n={values:t||[]};n.value=t[0],n.value0=t[0],n.value1=t[0];for(let a=1;a<t.length;a++)n[`value${a+1}`]=t[a];r.dispatchEvent(new CustomEvent("change",{detail:n}))};var Y=(r,i,t)=>{let n=0,a,d,m,l,s=!1,f=(g,S,L,P,T,k)=>{let F=n;L!==void 0&&g>L&&(g=L),S!==void 0&&g<S&&(g=S),n=g;let R=n;return(P===I&&k||P===N&&T)&&(R=100-R),P===I?i.style.top=`${R}%`:i.style.left=`${R}%`,F!==n},x=g=>g===i||i.contains(g),p=(g,S,L,P)=>{a=g,d=S,m=L,l=P},b=g=>{s=g,i.classList.toggle("disabled",s),s?i.setAttribute("aria-disabled","true"):i.hasAttribute("aria-disabled")&&i.removeAttribute("aria-disabled")},A=(g,S)=>{S==null?i.removeAttribute(g):i.setAttribute(g,S)},C=g=>i.getAttribute(g),c=g=>{if(!s){switch(g.key){case"ArrowLeft":{g.preventDefault(),typeof a=="function"&&a(t);break}case"ArrowRight":{g.preventDefault(),typeof d=="function"&&d(t);break}case"ArrowUp":{g.preventDefault(),typeof m=="function"&&m(t);break}case"ArrowDown":{g.preventDefault(),typeof l=="function"&&l(t);break}}Yt(r,g)}},h=()=>{s||qt(r,i)};return i.className=`pointer pointer-${t}`,i.addEventListener("keydown",c),i.addEventListener("click",h),{$pointer:i,get percent(){return n},get disabled(){return s},set disabled(g){b(g)},updatePosition:f,isClicked:x,setCallbacks:p,setAttr:A,getAttr:C,destroy:()=>{i.removeEventListener("keydown",c),i.removeEventListener("click",h),i.remove()}}};var Qt=r=>{if(r==null)return;if(Array.isArray(r))return r;if(r.trim()==="")return;let t=r.split(","),n=[],a=!0;for(let d=0;d<t.length;d++){let m=t[d].trim();m!==""&&(n.push(m),O(m)||(a=!1))}return a?n.map(d=>Number(d)):n},Zt=(r,i)=>i?i.findIndex(t=>t===r||t.toString().trim()===r.toString().trim()):-1;var _t=r=>({updatePosition:(t,n,a,d)=>{if(n.length<=0)return;let m=n.length===1,l=n[0],s=n[n.length-1];t===I?(r.style.removeProperty("width"),r.style.removeProperty("right"),r.style.removeProperty("left"),m?r.style.height=`${l}%`:r.style.height=`${Math.abs(l-s)}%`,d?(r.style.bottom="0%",m?r.style.top="auto":r.style.top=`${Math.min(100-s,100-l)}%`):(r.style.bottom="auto",m?r.style.top="0%":r.style.top=`${Math.min(l,s)}%`)):(r.style.removeProperty("height"),r.style.removeProperty("top"),r.style.removeProperty("bottom"),m?r.style.width=`${l}%`:r.style.width=`${Math.abs(l-s)}%`,a?(r.style.right="0%",m?r.style.left="auto":r.style.left=`${Math.min(100-s,100-l)}%`):(r.style.right="auto",m?r.style.left="0%":r.style.left=`${Math.min(l,s)}%`))}});var _e="--animate-onclick",$t="--width",en="--height",tn="--panel-bg-border-radius",nn="--panel-bg",rn="--panel-bg-hover",on="--panel-bg-fill",sn="--pointer-width",an="--pointer-height",ln="--pointer-border-radius",un="--pointer-bg",dn="--pointer-bg-hover",cn="--pointer-bg-focus",pn="--pointer-shadow",bn="--pointer-shadow-hover",gn="--pointer-shadow-focus",fn="--pointer-border",mn="--pointer-border-hover",hn="--pointer-border-focus";var q=(r,i,t)=>{let n=new Map;for(let a of r.attributes){let d=a.nodeName.trim().toLowerCase();if(!i.test(d))continue;let l=d.replace(/\D/g,"").trim(),s=l===""||l==="0"||l==="1"?0:E(l,0)-1,f=t&&typeof t=="function"?t(a.value):a.value;n.set(s,f)}return n},yn=r=>{if(!r)return null;let i=r.getAttribute(Kt);if(!i)return null;let t=i.split(";"),n=[];for(let a of t)a.trim()!==""&&n.push(a.trim());return n};var $e=[[$t,Tt,"sliderWidth",null],[en,Mt,"sliderHeight",null],[tn,wt,"sliderRadius",null],[nn,Dt,"sliderBg",null],[rn,Lt,"sliderBgHover",null],[on,Ct,"sliderBgFill",null],[sn,kt,"pointer#Width",/^pointer([0-9]*)-width$/],[an,Ht,"pointer#Height",/^pointer([0-9]*)-height$/],[ln,It,"pointer#Radius",/^pointer([0-9]*)-radius$/],[un,Rt,"pointer#Bg",/^pointer([0-9]*)-bg$/],[dn,Bt,"pointer#BgHover",/^pointer([0-9]*)-bg-hover$/],[cn,Ot,"pointer#BgFocus",/^pointer([0-9]*)-bg-focus$/],[pn,Ft,"pointer#Shadow",/^pointer([0-9]*)-shadow$/],[bn,Vt,"pointer#ShadowHover",/^pointer([0-9]*)-shadow-hover$/],[gn,Nt,"pointer#ShadowFocus",/^pointer([0-9]*)-shadow-focus$/],[fn,Ut,"pointer#Border",/^pointer([0-9]*)-border$/],[mn,zt,"pointer#BorderHover",/^pointer([0-9]*)-border-hover$/],[hn,Wt,"pointer#BorderFocus",/^pointer([0-9]*)-border-focus$/]],xn=(r,i,t)=>{let n=null,a=[],d=new Map,m=(c,h=i)=>{let w=[...h.classList];for(let g of w)g.startsWith(c)&&i.classList.remove(g)},l=()=>{m("shape");let c=i.querySelectorAll(".pointer");for(let h of c)m("shape",h)},s=c=>{n=c,m("theme-"),typeof c=="string"&&i.classList.add(`theme-${c}`)},f=()=>{if(l(),!(a.length<=0)){i.classList.add("shape",`shape-${a[0]}`);for(let c=1;c<a.length;c++){let h=a[c];if(!h)continue;let w=i.querySelector(`.pointer-${c}`);!w||w.classList.add("shape",`shape-${h}`)}}},x=(c,h)=>{a[c]=h,f()},p=()=>{l();let c=q(r,/^pointer([0-9]*)-shape$/);if(!(c.size<=0)){for(let h of c){let w=h[0];a[w]=h[1]}f()}},b=(c,h)=>`${c}-${h}`,A=(c,h,w)=>{let g=t[w];if(!g)return;let S=w===0?i:g.$pointer;if(h==null){d.has(b(c,w))&&d.delete(b(c,w)),S.style.removeProperty(c);return}d.set(b(c,w),h),S.style.setProperty(c,h)},C=(c,h)=>d.get(b(c,h));return(()=>{for(let c of $e){let[h,w,g,S]=c;if(S){let P=q(r,S);for(let T of P){let k=T[0],F=T[1];A(h,F,k)}}else{let P=r.getAttribute(w);A(h,P,0)}let L=[];if(g.indexOf("#")===-1)L.push([g,0]);else{L.push([g.replace("#",""),0]),L.push([g.replace("#","0"),0]),L.push([g.replace("#","1"),0]);for(let P=1;P<t.length;P++)L.push([g.replace("#",(P+1).toString()),P])}for(let P of L)try{let T=P[0],k=P[1];Object.prototype.hasOwnProperty.call(r,T)||Object.defineProperty(r,T,{get(){return C(h,k)},set:F=>{A(h,F,k)}})}catch(T){console.error(T)}}s(r.getAttribute(ve)),p()})(),{setStyle:A,getStyle:C,get theme(){return n},set theme(c){s(c)},get pointerShapes(){return a},setPointerShape:x}};var K="animate-on-click",et="range-dragging";var Pn=(r,i,t,n)=>{let a=[],d=p=>{for(let b of a)b.update&&typeof b.update=="function"&&b.update(p)},m=()=>{for(let p of a)p.destroy&&typeof p.destroy=="function"&&p.destroy()},l=(p,b)=>{for(let A of a)A.onAttrChange&&typeof A.onAttrChange=="function"&&A.onAttrChange(p,b)},s=p=>{if(!!p.gettersAndSetters){for(let b of p.gettersAndSetters)if(!(!b.name||!b.attributes))try{Object.prototype.hasOwnProperty.call(r,b.name)||Object.defineProperty(r,b.name,b.attributes)}catch(A){console.error("defineSettersGetters error:",A)}}},f=p=>{var A;if(!p.css)return;let b=(A=r.shadowRoot)==null?void 0:A.querySelector("style");!b||(b.innerHTML+=p.css)};return{init:()=>{if(!!window.tcRangeSliderPlugins)for(let p of window.tcRangeSliderPlugins){let b=p();a.push(b),b.init&&typeof b.init=="function"&&(b.init(r,i,t,n),s(b),f(b))}},update:d,onAttrChange:l,destroy:m}};var Xn=10,En=(r,i)=>{let t=new Map,n=/^value([0-9]*)$/;for(let l of r.attributes){let s=l.nodeName.trim().toLowerCase();if(!n.test(s))continue;let x=s.replace("value","").trim(),p=x===""||x==="0"||x==="1"?0:E(x,0)-1,b=O(l.value)?E(l.value,0):l.value;t.set(p,b)}let a=Math.max(...Array.from(t.keys())),d=[];d.push([Y(r,i,0),t.get(0)]);let m=i;for(let l=1;l<=a;l++){let s=i.cloneNode(!0);m.after(s),m=s,d.push([Y(r,s,l),t.get(l)])}return d},tt=(r,i,t,n,a,d,m)=>{try{Object.defineProperty(r,n,{configurable:!0,get(){if(!i)return;let l=i.pointers[t];if(!l)return;let s=i.getTextValue(l.percent);return O(s)?E(s,s):s},set:l=>{i.pointers[t]?i==null||i.setValue(l,t):i==null||i.addPointer(l)}}),Object.defineProperty(r,a,{configurable:!0,get(){var l,s;return(s=(l=i==null?void 0:i.pointers[t])==null?void 0:l.getAttr("aria-label"))!=null?s:void 0},set:l=>{!i||i.setAriaLabel(t,l)}}),Object.defineProperty(r,d,{configurable:!0,get(){var l,s;return(s=(l=i==null?void 0:i.styles)==null?void 0:l.pointerShapes[t])!=null?s:null},set:l=>{!i||!i.styles||i.styles.setPointerShape(t,l)}}),Object.defineProperty(r,m,{configurable:!0,get(){var l;return(l=i==null?void 0:i.pointers[t].disabled)!=null?l:!1},set:l=>{if(!i)return;let s=i==null?void 0:i.pointers[t];!s||(s.disabled=l)}})}catch(l){console.error(l)}},Sn=(r,i)=>{let t=[["value","ariaLabel","pointerShape","pointerDisabled",0],["value0","ariaLabel0","pointerShape0","pointer0Disabled",0],["value1","ariaLabel1","pointerShape1","pointer1Disabled",0]];for(let n=2;n<Xn;n++)t.push([`value${n}`,`ariaLabel${n}`,`pointer${n}Shape`,`pointer${n}Disabled`,n-1]);for(let n of t)tt(r,i,n[4],n[0],n[1],n[2],n[3])},nt=(r,i,t)=>{var a;let n=(a=t.shadowRoot)==null?void 0:a.querySelector(".container");if(!!n)for(let d of r)i?n.prepend(d.$pointer):n.append(d.$pointer)};var rt=0,J=100,U=2,An="0.3s",Tn=(r,i,t)=>{let n=t.map(e=>e[0]),a=null,d=null,m=null,l=null,s=rt,f=J,x,p,b=N,A=U,C=!1,c=!1,h=!1,w=0,g=1/0,S=!1,L,P,T=!1,k=!1,F=!1,R=An,ot=[],st=e=>{T||(e.preventDefault&&e.preventDefault(),z(e),window.addEventListener("mousemove",z),window.addEventListener("mouseup",Q),Xt(r,e))},Q=e=>{T||(L=void 0,P=void 0,window.removeEventListener("mousemove",z),window.removeEventListener("mouseup",Q),R&&i.classList.add(K),Gt(r,e))},wn=(e,o)=>{if(n.length<=0)return;if(n.length===1)return n[0].isClicked(e)&&R&&i.classList.remove(K),n[0];let u=Ln(e);if(S){let v=o,B=_(v);B!==void 0&&(v=Ze(v,B)),u?(L=v,P=0,R&&i.classList.remove(K)):L!==void 0&&(P=v-L,L=v)}if(!Dn(e)&&!u){for(let v of n)if(!(!v.isClicked(e)||v.disabled))return R&&i.classList.remove(K),v;for(let v of n)if(a===v)return v}let y=1/0,M=null;for(let v of n){if(v.disabled)continue;let B=Math.abs(o-v.percent);B<y&&(y=B,M=v)}return M},at=()=>n.findIndex(e=>a===e&&!e.disabled),z=e=>{let o;if(b===I){let{height:y,top:M}=i.getBoundingClientRect(),v=e.type.indexOf("mouse")!==-1?e.clientY:e.touches[0].clientY;o=Math.min(Math.max(0,v-M),y)*100/y}else{let{width:y,left:M}=i.getBoundingClientRect(),v=e.type.indexOf("mouse")!==-1?e.clientX:e.touches[0].clientX;o=Math.min(Math.max(0,v-M),y)*100/y}if((C||c)&&(o=100-o),a=wn(e.target,o),S&&n.length>1&&P!==void 0){let y=n[0],M=n[n.length-1],v=y.percent+P<0,B=M.percent+P>100;if(v||B)return;for(let se=0;se<n.length;se++)H(se,n[se].percent+P);return}let u=at();u!==-1&&(H(u,o),a==null||a.$pointer.focus())},Z=e=>{if(T||document.activeElement!==r||(a==null?void 0:a.disabled))return;e.stopPropagation(),e.preventDefault();let o=e.deltaY<0,u=C||c,y=o?!u:u,M=at();M!==-1&&(y?X(M,n[M].percent):G(M,n[M].percent))},lt=e=>{T||k||(b===I?c?H(e,100):H(e,0):C?G(e,n[e].percent):X(e,n[e].percent))},ut=e=>{T||k||(b===I?c?H(e,0):H(e,100):C?X(e,n[e].percent):G(e,n[e].percent))},dt=e=>{T||k||(b===I?c?G(e,n[e].percent):X(e,n[e].percent):C?H(e,100):H(e,0))},ct=e=>{T||k||(b===I?c?X(e,n[e].percent):G(e,n[e].percent):C?H(e,0):H(e,100))},Dn=e=>e.classList.contains("panel"),Ln=e=>e.classList.contains("panel-fill"),X=(e,o)=>{if(o===void 0)return;let u=_(o);u==null&&(u=1),o-=u,o<0&&(o=0),H(e,o)},G=(e,o)=>{if(o===void 0)return;let u=_(o);u==null&&(u=1),o+=u,o>100&&(o=100),H(e,o)},W=()=>{!l||l.update({percents:pt(),values:bt(),$pointers:gt(),min:ft(),max:mt(),data:Ce(),step:Le(),round:He(),type:ke(),textMin:$(),textMax:ee(),rightToLeft:Be(),bottomToTop:Oe(),pointersOverlap:Ue(),pointersMinDistance:Ie(),pointersMaxDistance:Re(),rangeDragging:ze(),disabled:Fe(),keyboardDisabled:Ve(),mousewheelDisabled:Ne()})},Cn=()=>{W()},kn=e=>{if(!(h||n.length<=1||f===s))if(e===0){let o=g*100/(f-s);return Math.max(0,n[e+1].percent-o)}else{let o=w*100/(f-s);return Math.min(n[e-1].percent+o,100)}},Hn=e=>{if(!(h||n.length<=1||f===s))if(e===n.length-1){let o=g*100/(f-s);return Math.min(n[e-1].percent+o,100)}else{let o=w*100/(f-s);return Math.max(0,n[e+1].percent-o)}},_=e=>{let o;if(typeof x=="function"){let u=we(0,100,s,f,e);o=x(u,e)}else o=x;if(O(o)){let u=f-s;return o=u===0?0:o*100/u,o}},j=e=>{if(e===void 0)return;let o=we(0,100,s,f,e);return p!==void 0?p[Math.round(o)]:jt(o,A)},$=()=>p!==void 0?p[s]:s,ee=()=>p!==void 0?p[f]:f,Le=()=>x,In=e=>{var o;return e<=0||h?$():(o=j(n[e-1].percent))!=null?o:""},Rn=e=>{var o;return n.length<=1||e>=n.length-1||h?ee():(o=j(n[e+1].percent))!=null?o:""},pt=()=>n.map(e=>e.percent),bt=()=>n.map(e=>j(e.percent)),gt=()=>n.map(e=>e.$pointer),ft=()=>s,mt=()=>f,Ce=()=>p,ke=()=>b,He=()=>A,Ie=()=>w,Re=()=>g,Bn=e=>ot[e],Be=()=>C,Oe=()=>c,Fe=()=>T,Ve=()=>k,Ne=()=>F,Ue=()=>h,ze=()=>S,H=(e,o)=>{if(o===void 0)return;let u=_(o);u!==void 0&&(o=Ze(o,u));let y=n[e];if(!y)return;let M=y.updatePosition(o,kn(e),Hn(e),b,C,c);d==null||d.updatePosition(b,n.map(v=>v.percent),C,c),W();for(let v of n){let B=j(v.percent);B!==void 0&&(v.setAttr("aria-valuenow",B.toString()),v.setAttr("aria-valuetext",B.toString()))}Fn(),M&&Jt(r,n.map(v=>j(v.percent)))},V=()=>{for(let e=0;e<n.length;e++)H(e,n[e].percent)},On=(e,o)=>{s=p!==void 0?0:E(e,rt),f=p!==void 0?p.length-1:E(o,J),te(s),ne(f)},Fn=()=>{var e,o;for(let u=0;u<n.length;u++){let y=n[u];y.setAttr("aria-valuemin",((e=In(u))!=null?e:"").toString()),y.setAttr("aria-valuemax",((o=Rn(u))!=null?o:"").toString())}},te=e=>{s=E(e,rt),s>f&&(f=s+J),V()},ne=e=>{f=E(e,J),f<s&&(f=s+J),V()},ht=e=>{h=!0;for(let o=0;o<e.length;o++)re(e[o],o);h=!1;for(let o=0;o<e.length;o++)re(e[o],o)},re=(e,o)=>{let u;p!==void 0?(u=e==null?0:Zt(e,p),u===-1&&(u=0)):(u=E(e,s),u<s&&(u=s),u>f&&(u=f));let y=we(s,f,0,100,u);H(o,y)},ie=e=>{if(e==null){x=void 0;return}if(typeof e=="function"){x=e,V();return}if(O(e)){x=E(e,1);let o=Math.abs(f-s);x>o&&(x=void 0),V();return}x=void 0},We=e=>{h=e,V()},Ke=e=>{(!O(e)||e<0)&&(e=0),w=e},je=e=>{(!O(e)||e<0)&&(e=1/0),g=e},qe=e=>{T=e,i.classList.toggle("disabled",T),T?i.setAttribute("aria-disabled","true"):i.hasAttribute("aria-disabled")&&i.removeAttribute("aria-disabled")},vt=e=>{k=e},yt=e=>{F=e,F?document.removeEventListener("wheel",Z):document.addEventListener("wheel",Z,{passive:!1})},Xe=e=>{if(e==null){p=void 0;return}if(p=Qt(e),p===void 0||p.length<=0){p=void 0;return}te(0),ne(p.length-1),x===void 0&&ie(1)},Ge=e=>{var y;typeof e=="string"?b=e.trim().toLowerCase()===I?I:N:b=N;let o=(y=r.shadowRoot)==null?void 0:y.querySelector(".range-slider-box");if(!o)return;o.className=`range-slider-box type-${b}`,V();let u=b===I?"vertical":"horizontal";for(let M of n)M.setAttr("aria-orientation",u)},Ye=e=>{C=e,n.length>1&&nt(n,C,r),V(),W()},Je=e=>{c=e,n.length>1&&nt(n,c,r),V(),W()},Qe=e=>{A=E(e,U),A<0&&(A=U),W()},xt=e=>{e==null||e.toString().trim().toLowerCase()==="false"?(R=void 0,i.style.removeProperty(_e),i.classList.remove(K)):(R=e.toString(),i.style.setProperty(_e,R),i.classList.add(K))},Pt=(e,o)=>{let u=n[e];!u||(u.setAttr("aria-label",o),ot[e]=o)},oe=e=>{if(L=void 0,n.length<=1){S=!1,i.classList.remove(et);return}S=e,i.classList.toggle(et,S)},Vn=()=>{qe(D(r.getAttribute(Pe))),k=D(r.getAttribute(Ee)),F=D(r.getAttribute(Se));let e=q(r,/^pointer([0-9]*)-disabled$/,o=>D(o));for(let o of e){let u=o[0];!n[u]||(n[u].disabled=o[1])}},Nn=()=>{let e=q(r,/^aria-label([0-9]*)$/);for(let o of e){let u=o[0];Pt(u,o[1])}},Un=e=>{let o=n.length,u=n[o-1].$pointer,y=u.cloneNode(!0);u.after(y);let M=Y(r,y,o);return M.setCallbacks(lt,ut,dt,ct),n.push(M),re(e,o),V(),W(),o},zn=()=>{let e=n.length,o=n[e-1];return o?(o.destroy(),n.pop(),n.length<=1&&oe(!1),V(),W(),e-1):-1};return(()=>{var o,u;for(let y of n)y.setCallbacks(lt,ut,dt,ct);let e=(o=r.shadowRoot)==null?void 0:o.querySelector(".panel-fill");e&&(d=_t(e)),Ge(r.getAttribute(he)),Ye(D(r.getAttribute(ye))),Je(D(r.getAttribute(xe))),On(r.getAttribute(be),r.getAttribute(ge)),ie(r.getAttribute(fe)),Xe(r.getAttribute(pe)),ht(t.map(y=>y[1])),We(D(r.getAttribute(le))),Ke(E(r.getAttribute(ue),0)),je(E(r.getAttribute(de),1/0)),oe(D(r.getAttribute(ce))),Qe(E(r.getAttribute(me),U)),Vn(),Nn(),m=xn(r,i,n),xt((u=r.getAttribute(Ae))!=null?u:An),i.addEventListener("mousedown",st),i.addEventListener("mouseup",Q),i.addEventListener("touchmove",z),i.addEventListener("touchstart",z),F||document.addEventListener("wheel",Z,{passive:!1}),l=Pn(r,Cn,{setValues:ht,setMin:te,setMax:ne,setStep:ie,setPointersOverlap:We,setPointersMinDistance:Ke,setPointersMaxDistance:je,setDisabled:qe,setType:Ge,setRightToLeft:Ye,setBottomToTop:Je,setRound:Qe,setKeyboardDisabled:vt,setMousewheelDisabled:yt,setRangeDragging:oe,setData:Xe},{getPercents:pt,getValues:bt,getPointerElements:gt,getMin:ft,getMax:mt,getStep:Le,getData:Ce,getType:ke,getRound:He,getTextMin:$,getTextMax:ee,isRightToLeft:Be,isBottomToTop:Oe,isDisabled:Fe,isKeyboardDisabled:Ve,isMousewheelDisabled:Ne,isPointersOverlap:Ue,isRangeDraggingEnabled:ze,getPointersMinDistance:Ie,getPointersMaxDistance:Re}),l.init()})(),{get pointers(){return n},get styles(){return m},get pluginsManager(){return l},get min(){return $()},get max(){return ee()},get step(){return Le()},get pointersOverlap(){return Ue()},set pointersOverlap(e){We(e)},get pointersMinDistance(){return Ie()},set pointersMinDistance(e){Ke(e)},get pointersMaxDistance(){return Re()},set pointersMaxDistance(e){je(e)},get disabled(){return Fe()},set disabled(e){qe(e)},get data(){return Ce()},get type(){return ke()},set type(e){Ge(e)},get rightToLeft(){return Be()},set rightToLeft(e){Ye(e)},get bottomToTop(){return Oe()},set bottomToTop(e){Je(e)},get round(){return He()},set round(e){Qe(e)},get animateOnClick(){return R},set animateOnClick(e){xt(e)},get keyboardDisabled(){return Ve()},set keyboardDisabled(e){vt(e)},get mousewheelDisabled(){return Ne()},set mousewheelDisabled(e){yt(e)},get rangeDragging(){return ze()},set rangeDragging(e){oe(e)},setMin:te,setMax:ne,setValue:re,setStep:ie,setData:Xe,getTextValue:j,setAriaLabel:Pt,getAriaLabel:Bn,addPointer:Un,removePointer:zn,destroy:()=>{i.removeEventListener("mousedown",st),i.removeEventListener("mouseup",Q),i.removeEventListener("touchmove",z),i.removeEventListener("touchstart",z),document.removeEventListener("wheel",Z);for(let e of n)e.destroy();l==null||l.destroy()}}};var Mn=(r,i,t)=>{let n=$e.find(([l,s,f,x])=>s.replace("#","")===i.replace(/\d+/g,""));if(n&&r.styles){let[l,s,f,x]=n,p=i.replace(/\D/g,"").trim(),b=p===""||p==="0"||p==="1"?0:E(p,0)-1;r.styles.setStyle(l,t,b);return}switch(r&&r.pluginsManager&&r.pluginsManager.onAttrChange(i,t),i){case be:{r.setMin(t);break}case ge:{r.setMax(t);break}case fe:{r.setStep(t);break}case le:{r.pointersOverlap=D(t);break}case ue:{r.pointersMinDistance=E(t,0);break}case ce:{r.rangeDragging=D(t);break}case de:{r.pointersMaxDistance=E(t,1/0);break}case Pe:{r.disabled=D(t);break}case Ee:{r.keyboardDisabled=D(t);break}case Se:{r.mousewheelDisabled=D(t);break}case pe:{r.setData(t);break}case he:{r.type=t;break}case ye:{r.rightToLeft=D(t);break}case xe:{r.bottomToTop=D(t);break}case me:{r.round=E(t,U);break}case ve:{r.styles&&(r.styles.theme=t);break}case Ae:{r.animateOnClick=t;break}}let a=null;if(/^value([0-9]*)$/.test(i)&&(a="value"),/^pointer([0-9]*)-disabled$/.test(i)&&(a="pointer-disabled"),/^aria-label([0-9]*)$/.test(i)&&(a="aria-label"),/^pointer([0-9]*)-shape$/.test(i)&&(a="pointer-shape"),!a)return;let d=i.replace(/\D/g,"").trim(),m=d===""||d==="0"||d==="1"?0:E(d,0)-1;switch(a){case"value":{r.setValue(t,m);break}case"pointer-disabled":{let l=r==null?void 0:r.pointers[m];if(!l)return;l.disabled=D(t);break}case"aria-label":{r.setAriaLabel(m,t);break}case"pointer-shape":{r.styles&&r.styles.setPointerShape(m,t);break}}};var it=class extends HTMLElement{constructor(){super();ae(this,"slider");ae(this,"_externalCSSList",[]);ae(this,"_observer",null);this.attachShadow({mode:"open"})}set step(t){this.slider&&this.slider.setStep(t)}get step(){var t;return(t=this.slider)==null?void 0:t.step}set disabled(t){this.slider&&(this.slider.disabled=t)}get disabled(){var t,n;return(n=(t=this.slider)==null?void 0:t.disabled)!=null?n:!1}set data(t){var n;(n=this.slider)==null||n.setData(t)}get data(){var t;return(t=this.slider)==null?void 0:t.data}set min(t){var n;(n=this.slider)==null||n.setMin(t)}get min(){var t;return(t=this.slider)==null?void 0:t.min}set max(t){var n;(n=this.slider)==null||n.setMax(t)}get max(){var t;return(t=this.slider)==null?void 0:t.max}set round(t){!this.slider||(this.slider.round=t)}get round(){var t,n;return(n=(t=this.slider)==null?void 0:t.round)!=null?n:U}set type(t){!this.slider||(this.slider.type=t!=null?t:N)}get type(){var t;return((t=this.slider)==null?void 0:t.type)||N}set pointersOverlap(t){!this.slider||(this.slider.pointersOverlap=t)}get pointersOverlap(){var t,n;return(n=(t=this.slider)==null?void 0:t.pointersOverlap)!=null?n:!1}set pointersMinDistance(t){!this.slider||(this.slider.pointersMinDistance=t)}get pointersMinDistance(){var t,n;return(n=(t=this.slider)==null?void 0:t.pointersMinDistance)!=null?n:0}set pointersMaxDistance(t){!this.slider||(this.slider.pointersMaxDistance=t)}get pointersMaxDistance(){var t,n;return(n=(t=this.slider)==null?void 0:t.pointersMaxDistance)!=null?n:1/0}set theme(t){!this.slider||!this.slider.styles||(this.slider.styles.theme=t)}get theme(){var t,n,a;return(a=(n=(t=this.slider)==null?void 0:t.styles)==null?void 0:n.theme)!=null?a:null}set rtl(t){!this.slider||(this.slider.rightToLeft=t)}get rtl(){var t,n;return(n=(t=this.slider)==null?void 0:t.rightToLeft)!=null?n:!1}set btt(t){!this.slider||(this.slider.bottomToTop=t)}get btt(){var t,n;return(n=(t=this.slider)==null?void 0:t.bottomToTop)!=null?n:!1}set keyboardDisabled(t){!this.slider||(this.slider.keyboardDisabled=t)}get keyboardDisabled(){var t,n;return(n=(t=this.slider)==null?void 0:t.keyboardDisabled)!=null?n:!1}set mousewheelDisabled(t){!this.slider||(this.slider.mousewheelDisabled=t)}get mousewheelDisabled(){var t,n;return(n=(t=this.slider)==null?void 0:t.mousewheelDisabled)!=null?n:!1}set animateOnClick(t){!this.slider||(this.slider.animateOnClick=t)}get animateOnClick(){var t;return(t=this.slider)==null?void 0:t.animateOnClick}get rangeDragging(){var t,n;return(n=(t=this.slider)==null?void 0:t.rangeDragging)!=null?n:!1}set rangeDragging(t){this.slider&&(this.slider.rangeDragging=D(t))}get externalCSSList(){return this._externalCSSList}addPointer(t){var a;if(!this.slider)return;let n=(a=this.slider)==null?void 0:a.addPointer(t);tt(this,this.slider,n,`value${n+1}`,`ariaLabel${n+1}`,`pointerShape${n+1}`,`pointer${n+1}Disabled`)}removePointer(){var t;!this.slider||(t=this.slider)==null||t.removePointer()}addCSS(t){if(!this.shadowRoot)return;let n=document.createElement("style");n.textContent=t,this.shadowRoot.appendChild(n)}connectedCallback(){var d,m;if(!this.shadowRoot)return;this._externalCSSList=yn(this),this.shadowRoot.innerHTML=St(At,this._externalCSSList);let t=(d=this.shadowRoot)==null?void 0:d.querySelector(".pointer");if(!t)return;let n=(m=this.shadowRoot)==null?void 0:m.getElementById("range-slider");if(!n)return;let a=En(this,t);this.slider=Tn(this,n,a),Sn(this,this.slider),this._observer=new MutationObserver(l=>{l.forEach(s=>{var x;if(!this.slider||s.type!=="attributes")return;let f=s.attributeName;!f||Mn(this.slider,f,(x=this.getAttribute(f))!=null?x:"")})}),this._observer.observe(this,{attributes:!0})}disconnectedCallback(){this._observer&&this._observer.disconnect(),this.slider&&this.slider.destroy()}},De=it;window.tcRangeSlider=De;customElements.get("toolcool-range-slider")||customElements.define("toolcool-range-slider",De);customElements.get("tc-range-slider")||customElements.define("tc-range-slider",class extends De{});})();
//# sourceMappingURL=toolcool-range-slider.min.js.map

/* Pagination */
let Pagination = {
    code: "",
    Extend: function (data) {
        data = data || {};
        Pagination.size = data.size;
        Pagination.page = data.page;
        Pagination.step = data.step;
    },
    Add: function (s, f) {
        for (let i = s; i < f; i++) {
            Pagination.code += "<a href='" + window.location.pathname + '?page=' + i + "'>" + i + "</a>";
        }
    },
    Last: function () {
        Pagination.code += "<i>...</i><a href='" + window.location.pathname + '?page=' + Pagination.size + "'>" + Pagination.size + "</a>";
    },
    First: function () {
        Pagination.code += "<a href='" + window.location.pathname + '?page=' + 1 + "'>1</a><i>...</i>";
    },
    // change page
    Click: function (element) {
        Pagination.page = +element.innerHTML;
        Pagination.Start();
        if (get_frenzy_search_page_section) {
            getSearchPAgeFilterChangeApi(
                filterArray_Frenzy,
                Pagination.page - 1,
                true
            );
        }
        if (get_frenzy_collection_page_section) {
            getCollectionsPageFilterChangeApi(
                filterArray_Frenzy,
                Pagination.page - 1,
                true
            );
        }
        if (get_frenzy_blog_page_section) {
            getBlogPageApi(Pagination.page - 1, true);
        }
    },
    // previous page
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
        if (get_frenzy_search_page_section) {
            getSearchPAgeFilterChangeApi(
                filterArray_Frenzy,
                Pagination.page - 1,
                true
            );
        }
        if (get_frenzy_collection_page_section) {
            getCollectionsPageFilterChangeApi(
                filterArray_Frenzy,
                Pagination.page - 1,
                true
            );
        }
        if (get_frenzy_blog_page_section) {
            getBlogPageApi(Pagination.page - 1, true);
        }
        old_selected_key = '';
    },
    // next page
    Next: function () {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
        if (get_frenzy_search_page_section) {
            getSearchPAgeFilterChangeApi(
                filterArray_Frenzy,
                Pagination.page - 1,
                true
            );
        }
        if (get_frenzy_collection_page_section) {
            getCollectionsPageFilterChangeApi(
                filterArray_Frenzy,
                Pagination.page - 1,
                true
            );
        }
        if (get_frenzy_blog_page_section) {
            getBlogPageApi(Pagination.page - 1, true);
        }
        old_selected_key = '';
    },
    // binding pages
    Bind: function () {
        let a = Pagination.e.getElementsByTagName("a");
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) a[i].className = "current";
            a[i].addEventListener("click", function(event) {
                event.preventDefault();

                Pagination.Click(a[i]);
                old_selected_key = '';
            }, false);
        }
        selected_page_Frenzy = Pagination.page;
    },
    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = "";
        Pagination.Bind();
    },
    // find pagination type
    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        } else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(
                Pagination.size - Pagination.step * 2 - 2,
                Pagination.size + 1
            );
        } else {
            Pagination.First();
            Pagination.Add(
                Pagination.page - Pagination.step,
                Pagination.page + Pagination.step + 1
            );
            Pagination.Last();
        }
        Pagination.Finish();
    },
    // binding buttons
    Buttons: function (e) {
        let nav = e.getElementsByTagName("button");
        nav[0].addEventListener("click", Pagination.Prev, false);
        nav[1].addEventListener("click", Pagination.Next, false);
    },
    // create skeleton
    Create: function (e) {
        let html = [
            '<button type="button" class="frenzy_pagination_btn prev" ' +
                (Pagination.page <= 1 ? "disabled" : "") +
                " >" +
                pagination_arrow_Frenzy +
                "</button>", // previous button
            '<div class="frenzy_pagination_contain"></div>', // pagination container
            '<button type="button" class="frenzy_pagination_btn next" ' +
                (Pagination.page == total_page_no_Frenzy ? "disabled" : "") +
                ">" +
                pagination_arrow_Frenzy +
                "</button>", // next button
        ];
        e.innerHTML = html.join("");
        Pagination.e = e.getElementsByTagName("div")[0];
        Pagination.Buttons(e);
    },
    // init
    Init: function (e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    },
};
let init_Frenzy = function (total_page_number) {
    Pagination.Init(document.getElementById("pagination"), {
        size: total_page_number, // pages size
        page: selected_page_Frenzy > 0 ? selected_page_Frenzy : 1, // selected page
        step: 2, // pages before and after current
    });
};
/* Check currency Format */
function check_shop_currency_frenzy(format) {
    if (frenzy_shop_currency) {
        frenzy_shop_currency = frenzy_shop_currency;
    } else if (format) {
        frenzy_shop_currency = format;
    } else {
        frenzy_shop_currency = "${{amount}}";
    }
    return frenzy_shop_currency;
}

// Update Price Range Values depending on API response
const updatePriceRangeValues = (orgPrice, priceFilter) => {
    if (isFrenzyFilterPriceUpdated || isFrenzyFilterPriceRangeInitialize) {
        isFrenzyFilterPriceUpdated = false;

        frenzyMinPriceRange = Math.floor(orgPrice.min / 10) * 10;
        frenzyMaxPriceRange = Math.ceil(orgPrice.max / 10) * 10;

        if (isFrenzyFilterPriceRangeInitialize) {
            frenzyAbsoluteMinPriceRange = frenzyMinPriceRange;
            frenzyAbsoluteMaxPriceRange = frenzyMaxPriceRange;

            isFrenzyFilterPriceRangeInitialize = false;
        }
    } else {
        if (priceFilter?.min == FRENZY_MIN_PRICE && priceFilter?.max == FRENZY_MAX_PRICE) {
            frenzyAbsoluteMinPriceRange = Math.floor(orgPrice.min / 10) * 10;
            frenzyAbsoluteMaxPriceRange = Math.ceil(orgPrice.max / 10) * 10;

            frenzyMinPriceRange = frenzyAbsoluteMinPriceRange;
            frenzyMaxPriceRange = frenzyAbsoluteMaxPriceRange;
        } else {
            if (priceFilter) {
                frenzyMinPriceRange = Math.floor(priceFilter.min / 10) * 10;
                frenzyMaxPriceRange = Math.ceil(priceFilter.max / 10) * 10;
            }
        }
    }
}

// Product Add to Cart Events API Handler
const frenzyProductAddToCartEventApi = async (
    sku
) => {
    var data_json = JSON.stringify({
        sku: sku,
        event_name: "add_to_cart",
        user_id: user_id_Frenzy.toString(),
        shop: document.location.host,
        query_id: null,
    });
    const response = await fetch(authUrl_Frenzy + "/events", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
};

const frenzyProductAddToCartEventApiCaller = (addToCartForm) => {
    // Product Add to Cart Events API
    const productIdInput = addToCartForm.querySelector('[name="product-id"]');
    const variantIdInput = addToCartForm.querySelector('[name="id"]');

    let sku = '';

    if (productIdInput) {
        sku += productIdInput.value;
    }

    if (variantIdInput) {
        sku += '_' + variantIdInput.value;
    }

    frenzyProductAddToCartEventApi(sku);
}

document.addEventListener('submit', function(e) {
    const formAction = e.target.getAttribute('action');

    if (formAction == '/cart/add') {
        // e.preventDefault();

        if (typeof frenzyProductAddToCartEventApiCallerCallBack == 'function') {
            frenzyProductAddToCartEventApiCallerCallBack();
        } else {
            frenzyProductAddToCartEventApiCaller(e.target);
        }

        // return true;
    }
});

/**
 * Add line item properties to product page for data attribution
 * When the DOM is ready
 */
document.addEventListener("DOMContentLoaded", function() {
    const productForms = document.querySelectorAll('form[action="/cart/add"]');

    productForms.forEach(productForm => {
        // Event Name
        const eventNameInputElement = document.createElement('input');
        eventNameInputElement.type = "hidden";
        eventNameInputElement.name = "properties[_event_name]";
        eventNameInputElement.value = "pdp_add_to_cart";

        productForm.appendChild(eventNameInputElement);

        // User ID
        const userIDInputElement = document.createElement('input');
        userIDInputElement.type = "hidden";
        userIDInputElement.name = "properties[_user_id]";
        userIDInputElement.value = user_id_Frenzy.toString();

        productForm.appendChild(userIDInputElement);
    });
});

/* Placeholder Loader */
const PlaceHolderGridLoad = function (DivElement,filterflag,NumLoop){
 var additionalClass = '';
 if(!filterflag){
   additionalClass = 'full-width';
 }
 var PlaceHolderGrid = '<div class="frenzy_collection_page_loader_content '+additionalClass+'">';
     PlaceHolderGrid += '<div class="frenzy_container">';
      if(filterflag){
        PlaceHolderGrid += '<div class="frenzy_topbar_loader_content"><div class="frenzy_filter_loader_content "></div><div class="frenzy_sorting_loader_content"></div><div class="frenzy_empty_loader_content"></div><div class="frenzy_orientation_loader_content"><span></span><span></span><span></span></div></div>';
      }
      PlaceHolderGrid += '<div class="frenzy_content_loader_row">';
      if(filterflag){
        PlaceHolderGrid += '<div class="frenzy_sidebar_loader_content">';

          PlaceHolderGrid += '<div class="frenzy_side_bar_filter_loader_content">';
            PlaceHolderGrid += '<div class="frenzy_filter_title_loader"></div>';
            for(var i=1; i<=NumLoop;i++){
              PlaceHolderGrid += '<div class="frenzy_filter_title_ct_loader">';
                PlaceHolderGrid += '<div class="frenzy_filter_checkbox_loader"></div>';
                PlaceHolderGrid += '<div class="frenzy_filter_content_loader filter_animation_loader_frame"></div>';
              PlaceHolderGrid += '</div>';
            }
          PlaceHolderGrid += '</div>';
          //
          PlaceHolderGrid += '<div class="frenzy_side_bar_filter_loader_content color_filter_loader">';
            PlaceHolderGrid += '<div class="frenzy_filter_title_loader"></div>';
            for(var i=1; i<=NumLoop;i++){
              PlaceHolderGrid += '<div class="frenzy_filter_title_ct_loader">';
                PlaceHolderGrid += '<div class="frenzy_filter_checkbox_loader"></div>';
                PlaceHolderGrid += '<div class="frenzy_filter_content_loader filter_animation_loader_frame"></div>';
              PlaceHolderGrid += '</div>';
            }
          PlaceHolderGrid += '</div>';

        PlaceHolderGrid += '</div>';
      }
      PlaceHolderGrid += '<div class="frenzy_loader_row">';
        for(var i=1; i<=NumLoop;i++){
          PlaceHolderGrid += '<div class="frenzy_loader_grid"><div class="frenzy_grid_inner filter_animation_loader_frame" style="background-color: #e9e9e9; height: 400px;"></div></div>';
        }
      PlaceHolderGrid += '</div>';
      PlaceHolderGrid += '</div>';
    PlaceHolderGrid += '</div>';
  PlaceHolderGrid += '</div>';
  return PlaceHolderGrid;
}

/* Product Recommendation Section */
let FrenzyProImgSize = "";
function FrenzyProductImgResize(globalSetting) {
    FrenzyProImgSize =
        globalSetting && globalSetting.mobile_image_size
            ? globalSetting.mobile_image_size
            : "250x";
    if (screen.width > 768) {
        FrenzyProImgSize =
            globalSetting && globalSetting.desktop_image_size
                ? globalSetting.desktop_image_size
                : "500x";
    }
}
let get_frenzy_recommendation_section = document.querySelector(
    ".frenzy_recommendation_section"
);

if (frenzy_api_url && frenzy_api_key) {
    authUrl_Frenzy = frenzy_api_url;
}
let frenzy_sku = "";
if (product_id_Frenzy && variant_id_Frenzy) {
    frenzy_sku = product_id_Frenzy + "_" + variant_id_Frenzy;
}
let frenzy_recom_api = "/personalized-recommendation";
if (__st.p === "product") {
    frenzy_recom_api = "/recommendation";
}
let frenzy_recommendation_section_config = null;
window.getRecommendationAPIWithStructure = async (data_json, frenzy_recom_api, self,ApiName,sectionIndex) => {
    var classList = '';
    self.classList.forEach(function(classname, index){
        if (index == 0) {
            classList += classname;
        } else {
            classList += '.' + classname;
        }
    });
  const response = await fetch(authUrl_Frenzy + frenzy_recom_api, {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    if (data.status == 200) {
      const frenzyApiName = ApiName;
      const dataResults = data?.data?.matching_products;
      let recommendationSetting = '';
      let recommendationCss = '';
      if(ApiName == 'similar_product_carousel' || ApiName == 'personalized_homepage_carosuel'){
        recommendationSetting = data?.data?.settings ? data?.data?.settings : data?.data?.personalized_home_page ? data?.data?.personalized_home_page : data?.data?.recommendation;
        recommendationCss = data?.data?.css ? data?.data?.css : data?.data?.personalized_home_page_css ? data?.data?.personalized_home_page_css :  data?.data?.recommendation_css;
      }
      if(ApiName == 'cross_sell_carousel'){
        recommendationSetting = data?.data?.settings ? data?.data?.settings : data?.data?.cross_sell_recommendation;
        recommendationCss = data?.data?.css ? data?.data?.css : data?.data?.cross_sell_recommendation_css;
      }
        if(ApiName == 'most_clicked_skus_carousel'){
            recommendationSetting = data?.data?.settings ? data?.data?.settings : data?.data?.most_click_recommendation;
            recommendationCss = data?.data?.css ? data?.data?.css : data?.data?.most_click_recommendation_css;
        }
        if(ApiName == 'cart'){
            recommendationSetting = data?.data?.settings ? data?.data?.settings : data?.data?.cart_page;
            recommendationCss = data?.data?.css ? data?.data?.css : data?.data?.cart_page_css;
        }
      const dataGridHtml = data?.data?.recommendation_html;
      const frenzy_request_id = data?.data?.request_id;
      const dataConfig = data.data.config_id !== undefined ? data.data.config_id : data.config_id !== undefined ? data.config_id : null;
      const globalSetting = data?.data?.global_setting;
      const all_product_data = data.data;
      FrenzyProductImgResize(globalSetting);
      frenzySearchPageCarousel(
          dataResults,
          recommendationSetting,
          recommendationCss,
          dataGridHtml,
          frenzy_request_id,
          frenzyApiName,
          self,
          dataConfig,
          sectionIndex,
          all_product_data
        );
      const frenzy_scrollbar =
        recommendationSetting?.scroll_bar === "1" ? "1" : "0";
      let cssdata = '';
      if (frenzy_scrollbar === "0") {
        cssdata +=
            "."+self+" .swiper-scrollbar{display:none !important;}";
      }
      let head_Frenzy = document.head || document.getElementsByTagName("head")[0],
          style_Frenzy = document.createElement("style");
      head_Frenzy.appendChild(style_Frenzy);
      style_Frenzy.type = "text/css";
      if (style_Frenzy.styleSheet) {
          style_Frenzy.styleSheet.cssText = cssdata;
      } else {
          style_Frenzy.appendChild(document.createTextNode(cssdata));
      }
      if (typeof frenzy_recommendation_loaded === 'function') {
        frenzy_recommendation_loaded(self, dataResults);
      }
    }
}
const getRecommendationProductsApi = async () => {
    document.querySelectorAll('.frenzy_recommendation_section').forEach(function(self, index){
        const frenzyApiName = __st.p === "product" ? "similar_product_carousel" : "personalized_homepage_carosuel";
        const sectionIndex = index + 1;
        const swiperContainerClass = frenzyApiName+'-'+sectionIndex;
        self.classList.add(swiperContainerClass);
        if (self.getAttribute('data-variantID')) {
            variant_id_Frenzy = self.getAttribute('data-variantID');
        }
        if (product_id_Frenzy && variant_id_Frenzy) {
            frenzy_sku = product_id_Frenzy + "_" + variant_id_Frenzy;
        }
        const frenzy_recommendation_section_config = self.getAttribute("config_id");
        var data_json = JSON.stringify({
            sku: frenzy_sku,
            user_id: user_id_Frenzy.toString(),
            page: __st.p,
            shop: frenzyShop,
            num_matching: 15,
            full_description: true,
            config_id: frenzy_recommendation_section_config,
            currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
            country: Shopify.country ? Shopify.country : '',
            company_id: frenzy_company_id ? frenzy_company_id : null,
            location_id: frenzy_location_id ? frenzy_location_id : null
        });
        getRecommendationAPIWithStructure(data_json, frenzy_recom_api, self,frenzyApiName,sectionIndex);
    });
};

/* Product Grid Format */
function getProductGridItem(
    html,
    x,
    settingData,
    frenzy_shop_currency,
    frenzy_request_id,
    frenzy_product_click,
    dataConfig = 1,
    visible_on_desktop = true,
    visible_on_mobile = true,
) {
    let product_variant = '';
    const frenzy_select_option_type_ =
            settingData?.select_option == "all_options" ? "all_options" : "size";
    (x.options || []).map((y, index) => {
        if (y.name == frenzy_select_option_type_ && y.data) {
            product_variant = (y.data || []).find((v) => v.stock_amount >= 1);
        }
    })
    if(product_variant){
        let p_sku = x.sku.split('_');
        const sku_third_key = p_sku[2] ? '_'+p_sku[2] :'';
        const product_sku = x.product_id+"_"+product_variant.variant_id + sku_third_key;
        x.sku = product_sku;
    }
    let product_grid_html = html;
    if(typeof frenzyProductGridWidgetCallBack === 'function') {
        product_grid_html = frenzyProductGridWidgetCallBack();
    }
    let add_to_cart_label = 'Add to cart';
    if(settingData?.add_to_cart_label && settingData?.add_to_cart_label != ''){
        add_to_cart_label = settingData?.add_to_cart_label;
    }
    let main_grid_image =
        "https://frenzy.cdn.appdomain.cloud/frenzy-plugin/placeholder_img.jpg";
    let second_grid_image =
        "https://frenzy.cdn.appdomain.cloud/frenzy-plugin/placeholder_img.jpg";
    let grid_secondary_image = "";
    let product_available_color = "";
    if (settingData.grid_show_secondary_image == "1") {
        grid_secondary_image = "grid_secondary_image";
    }
    if (x.org_image_url) {
        if (x.org_image_url.includes(" ")) {
            let pro_image = x.org_image_url.split(" ");
            main_grid_image = FrenzyImageResizer(
                pro_image[0],
                FrenzyProImgSize
            );
            second_grid_image = FrenzyImageResizer(
                pro_image[1],
                FrenzyProImgSize
            );
        } else {
            main_grid_image = FrenzyImageResizer(
                x.org_image_url,
                FrenzyProImgSize
            );
            second_grid_image = FrenzyImageResizer(
                x.org_image_url,
                FrenzyProImgSize
            );
        }
    }
    let pro_url = frenzy_root_url + Shopify.routes.root + "products/" + x.org_prod_url;
    if(__st && __st.p === "collection"){
        if (settingData?.redirection_type === "1") {
         pro_url = window.location.pathname + "/products/" + x.org_prod_url;
       }
     }
    let stock_available =
        x.org_stock_available === "True" || x.org_stock_available === true
            ? "false"
            : "true";
    let sale_available = x.org_price < x.org_msrp_price ? "true" : "false";
    let grid_class_name =
        settingData.layout_type === "1"
            ? "frenzy_grid"
            : "frenzy_grid swiper-slide";
    let grid_visibility_class_name = '';
    if (!visible_on_desktop) {
        grid_visibility_class_name += "frenzy_grid_hide_on_desktop";
    }
    if (!visible_on_mobile) {
        grid_visibility_class_name += "frenzy_grid_hide_on_mobile";
    }
    let grid_text_align =
        settingData.grid_align_text === "1"
            ? "text_align_left"
            : settingData.grid_align_text === "2"
            ? "text_align_right"
            : "text_align_center";
    let productSwatchLength = 0;
    const frenzy_cart_redirect = settingData?.cart_redirect
        ? settingData.cart_redirect
        : "0";
    if (x?.all_variant_swatch_1) {
        productSwatchLength = x.all_variant_swatch_1?.length;
        (x.all_variant_swatch_1 || []).map((y, j) => {
            const variant_swatch_link = Shopify.routes.root + "products/" + y.link;
            product_available_color +=
                '<div class="frenzy_swatch_item" key="' + j + '">';
            var swatch_product_images = '';
            if(y?.image_url){
              if(y.image_url !== null){
                var images = y.image_url.split(' ');
                swatch_product_images = ' data-frenzy_img_first="'+images[0]+'" data-frenzy_img_second="'+images[1]+'"';
              }
            }
            if (y.color_img !== null) {
                product_available_color +=
                    '<a aria-label="'+y?.link+'" style="background-image: url(' +
                    y?.color_img +
                    ')" href="' + frenzy_root_url +
                    variant_swatch_link +
                    '" onclick="frenzyEventsClick(this)" data-sku="' +
                    x.sku +
                    '" data-config_id="' +
                    dataConfig +
                    '" data-name="' +
                    frenzy_product_click +
                    '" data-request_id="' +
                    frenzy_request_id +
                    '"'+swatch_product_images+'></a>';
            } else {
                product_available_color +=
                    '<a aria-label="'+y?.link+'" style="background-color: ' +
                    y?.color_code +
                    '" href="' + frenzy_root_url +
                    variant_swatch_link +
                    '" onclick="frenzyEventsClick(this)" data-sku="' +
                    x.sku +
                    '" data-name="' +
                    frenzy_product_click +
                    '" data-request_id="' +
                    frenzy_request_id +
                    '"'+swatch_product_images+'></a>';
            }
            product_available_color += "</div>";
        });
    }
    product_grid_html =
        '<div class="' +
        grid_class_name +
        " out_of_stock_" +
        stock_available +
        " sale_available_" +
        sale_available +
        " " +
        grid_text_align +
        " " +
        grid_secondary_image +
        " " +
        grid_visibility_class_name +
        '">' +
        product_grid_html;
    product_grid_html = product_grid_html.replaceAll(
        "[[product_featured_image]]",
        main_grid_image
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_second_image]]",
        second_grid_image
    );
    product_grid_html = product_grid_html.replaceAll("[[product_id]]", x.sku);
    product_grid_html = product_grid_html.replaceAll(
        "[[product_type]]",
        x.org_product_type ? x.org_product_type : ""
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_tags]]",
        x.org_product_tags
    );
    product_grid_html = product_grid_html.replaceAll("[[id]]", x.product_id);
    product_grid_html = product_grid_html.replaceAll(
        "[[product_title]]",
        x.org_product
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_brand]]",
        x.org_brand
    );
    const splitTitle = (x && x.org_product).split("|");
    product_grid_html = product_grid_html.replaceAll(
        "[[product_title_split_1]]",
        splitTitle[0]
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_title_split_2]]",
        splitTitle[1] ? splitTitle[1] : ""
    );

    product_grid_html = product_grid_html.replaceAll(
        '[[product_url]]"',
        pro_url +
            '" onclick="frenzyEventsClick(this)" data-sku="' +
            x.sku +
            '" data-config_id="' +
            dataConfig +
            '" data-name="' +
            frenzy_product_click +
            '" data-request_id="' +
            frenzy_request_id +
            '" '
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_url]]'",
        pro_url +
            "' onclick='frenzyEventsClick(this)' data-sku='" +
            x.sku +
            "' data-config_id='" +
            dataConfig +
            "' data-name='" +
            frenzy_product_click +
            "' data-request_id='" +
            frenzy_request_id +
            "'"
    );
    product_grid_html = product_grid_html.replaceAll("[[url]]", pro_url);

    product_grid_html = product_grid_html.replaceAll(
        '[[product_add_to_cart]]"',
        "frenzy_add_to_cart_btn" +
            '" onclick="frenzyAddToCartEvent(this)" data-redirect="' +
            frenzy_cart_redirect +
            '" data-sku="' +
            x.sku +
            '" data-config_id="' +
            dataConfig +
            '" data-name="' +
            frenzy_product_click +
            '" data-request_id="' +
            frenzy_request_id +
            '" '
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_add_to_cart]]'",
        "frenzy_add_to_cart_btn" +
            "' onclick='frenzyAddToCartEvent(this)' data-redirect='" +
            frenzy_cart_redirect +
            "' data-sku='" +
            x.sku +
            "' data-config_id='" +
            dataConfig +
            "' data-name='" +
            frenzy_product_click +
            "' data-request_id='" +
            frenzy_request_id +
            "' "
    );

    product_grid_html = product_grid_html.replaceAll(
        '[[product_quickview]]"',
        "frenzy_quickView_btn" +
            '" onclick="frenzyQuickView(this)" data-handle="' +
            x.org_prod_url +
            '" data-sku="' +
            x.sku +
            '" data-config_id="' +
            dataConfig +
            '" data-name="' +
            frenzy_product_click +
            '" data-request_id="' +
            frenzy_request_id +
            '" '
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_quickview]]'",
        "frenzy_quickView_btn" +
            "' onclick='frenzyQuickView(this)' data-handle='" +
            x.org_prod_url +
            "' data-sku='" +
            x.sku +
            "' data-config_id='" +
            dataConfig +
            "' data-name='" +
            frenzy_product_click +
            "' data-request_id='" +
            frenzy_request_id +
            "' "
    );

    product_grid_html = product_grid_html.replaceAll(
        "[[product_available_colors]]",
        product_available_color
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_sale_tag]]",
        "sale_tag"
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_stock_out_tag]]",
        "stock_out_tag"
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_sale_price]]",
        money_format_Frenzy(x.org_price * 100, frenzy_shop_currency)
    );
    product_grid_html = product_grid_html.replaceAll(
        "[[product_compare_price]]",
        x && x.org_msrp_price && x.org_msrp_price > x.org_price
            ? money_format_Frenzy(x.org_msrp_price * 100, frenzy_shop_currency)
            : ""
    );
    let frenzyProductOption = "",
        frenzy_product_option_label = "Select a size",
        frenzyOptionCount = 0;
    const frenzy_switch_type =
        settingData?.product_option_type == "switch"
            ? "frenzy_switch_type"
            : "frenzy_dropdown_type";
    const frenzy_select_option_type =
        settingData?.select_option == "all_options" ? "all_options" : "size";

    const frenzyMetafieldArray = html.split("[[metafield_");
    (frenzyMetafieldArray || []).map((metaKey, ind) => {
        if (ind != 0) {
            const frenzyMetafieldKey = metaKey.split("]]")[0];
            const frenzyMetafieldGetValue = x.org_metafield[frenzyMetafieldKey];
            product_grid_html = product_grid_html.replaceAll(
                "[[metafield_" + frenzyMetafieldKey + "]]",
                frenzyMetafieldGetValue == undefined
                    ? ""
                    : frenzyMetafieldGetValue
            );
        }
    });

    frenzy_product_option_label = settingData?.product_option_label
        ? settingData.product_option_label
        : "Select a size";
    let frenzySplitVariantId = x.sku;
    frenzySplitVariantId = frenzySplitVariantId.split("_");
    if (x && x.options) {
        frenzyProductOption +=
            '<div class="frenzy_variant_option frenzy_vp_' +
            frenzy_select_option_type +
            " " +
            frenzy_switch_type +
            '">';
        (x.options || []).map((y, index) => {
            if (y.name == frenzy_select_option_type && y.data) {
                if (
                    y.data[0]?.label != null &&
                    y.data[0]?.label != "Default Title"
                ) {
                    frenzyProductOption +=
                        '<label class="frenzy_option_label">' +
                        frenzy_product_option_label +
                        "</label>";
                }
                if (settingData?.product_option_type === "dropdown") {
                    if (
                        y.data[0]?.label != null &&
                        y.data[0]?.label != "Default Title"
                    ) {
                        frenzyProductOption +=
                            '<select class="frenzy_pro_select_option frenzySelectBox" data-request_id="' +
                            frenzy_request_id +
                            '" data-config_id="' +
                            dataConfig +
                            '" data-name="' +
                            frenzy_product_click +
                            '" onchange="frenzySelectOptionEvent(this)">';
                        (y.data || []).map((z, subIndex) => {
                            if (z.stock_amount > 0) {
                                frenzyOptionCount = frenzyOptionCount + 1;
                                let frenzyOptionselectedImg = "";
                                if (z.org_image_url?.includes(" ")) {
                                    const optionImg =
                                        z.org_image_url.split(" ");
                                    frenzyOptionselectedImg =
                                        FrenzyImageResizer(
                                            optionImg[0],
                                            FrenzyProImgSize
                                        );
                                } else {
                                    frenzyOptionselectedImg =
                                        FrenzyImageResizer(
                                            z.org_image_url,
                                            FrenzyProImgSize
                                        );
                                }
                                const frenzyCheckSelectedVid =
                                    frenzySplitVariantId[1] == z.variant_id
                                        ? "selected"
                                        : "";
                                if (z.stock_amount >= 1) {
                                    frenzyProductOption +=
                                        '<option data-image="' +
                                        frenzyOptionselectedImg +
                                        '" data-price="' +
                                        z.org_price +
                                        '" data-name="' +
                                        frenzy_product_click +
                                        '" value="' +
                                        x.product_id +
                                        "_" +
                                        z.variant_id +
                                        '" data-request_id="' +
                                        frenzy_request_id +
                                        '" ' +
                                        frenzyCheckSelectedVid +
                                        ">" +
                                        z.label +
                                        "</option>";
                                }
                            }
                        });
                        frenzyProductOption += "</select>";
                    }
                } else {
                    frenzyProductOption += '<div class="frenzy_product_option">';
                    (y.data || []).map((z, subIndex) => {
                        let frenzyOptionselectedImg = "";
                        if (z.org_image_url?.includes(" ")) {
                            const optionImg = z.org_image_url.split(" ");
                            frenzyOptionselectedImg = FrenzyImageResizer(
                                optionImg[0],
                                FrenzyProImgSize
                            );
                        } else {
                            frenzyOptionselectedImg = FrenzyImageResizer(
                                z.org_image_url,
                                FrenzyProImgSize
                            );
                        }
                        if (
                            y.data[0]?.label != null &&
                            y.data[0]?.label != "Default Title"
                        ) {
                            frenzyProductOption +=
                                z.stock_amount > 0
                                    ? '<button type="button" onclick="frenzyQuickAddEvent(this)" data-image="' +
                                      frenzyOptionselectedImg +
                                      '" data-config_id="' +
                                      dataConfig +
                                      '" data-price="' +
                                      z.org_price +
                                      '" data-name="' +
                                      frenzy_product_click +
                                      '" data-sku="' +
                                      x.product_id +
                                      "_" +
                                      z.variant_id +
                                      '" data-request_id="' +
                                      frenzy_request_id +
                                      '">' +
                                      z.label +
                                      "</button>"
                                    : '<button disabled data-sku="' +
                                      x.product_id +
                                      "_" +
                                      z.variant_id +
                                      '">' +
                                      z.label +
                                      "</button>";
                        }
                    });
                    frenzyProductOption += "</div>";
                }
            }
        });
        frenzyProductOption += "</div>";
        if (frenzy_product_click === "add_cart") {
            const frenzy_disabled_btn =
                settingData?.product_option_type == "switch" ? "disabled" : "";
            frenzyProductOption +=
                '<button type="button" class="frenzy_auickAdd_cart" onclick="frenzyAddToCartEvent(this)" data-redirect="' +
                frenzy_cart_redirect +
                '" data-config_id="' +
                dataConfig +
                '" data-name="' +
                frenzy_product_click +
                '" data-sku="' +
                x.sku +
                '" data-request_id="' +
                frenzy_request_id +
                '" ' +
                frenzy_disabled_btn +
                ">"+add_to_cart_label+"</button>";
        }
    }

    product_grid_html = product_grid_html.replaceAll(
        "[[product_options]]",
        frenzyProductOption
    );
    product_grid_html = product_grid_html + "</div>";
    let doc_html = document.createElement("div");
    doc_html.className = "frenzy_outer_class";
    doc_html.innerHTML = product_grid_html;
    let FrenzyOrgLabelHtml = "";
    if (typeof FrenzyOrgLabelCallBack == "function") {
        FrenzyOrgLabelHtml += FrenzyOrgLabelCallBack(x?.org_label);
    } else {
        ((x && x.org_label) || []).map((x) => {
            FrenzyOrgLabelHtml +=
                '<span class="frenzy_tag custom_tag" data-label="' +
                x +
                '">' +
                x +
                "</span>";
        });
    }
    doc_html
        .querySelector(".frenzy_product_tags")
        .insertAdjacentHTML("beforeend", FrenzyOrgLabelHtml);

    // if(x?.org_stock_amount < 5){
    //   doc_html.querySelector('.frenzy_quickView_btn').innerHTML = 'Low Stock';
    // }
    if (x.org_stock_available === "False" || x.org_stock_available === false) {
        doc_html.querySelector(".frenzy_add_to_cart_btn") ? doc_html.querySelector(".frenzy_add_to_cart_btn").innerHTML = "Out of Stock" : '';
        doc_html.querySelector(".frenzy_add_to_cart_btn") ? doc_html.querySelector(".frenzy_add_to_cart_btn").setAttribute("disabled", true) : '';
        // doc_html.querySelector('.frenzy_quickView_btn').innerHTML = 'Out of Stock';
    }

    if (sale_available == "true") {
        doc_html
            .querySelector(".frenzy_product_price_sale")
            .classList.add("is-sale");
    }
    if (productSwatchLength !== 0) {
        doc_html
            .querySelector(".frenzy_product_item")
            .classList.add("swatch-available");
    }
    if (
        frenzyOptionCount < 1 &&
        settingData?.product_option_type === "dropdown"
    ) {
        doc_html
            .querySelectorAll(".frenzy_variant_option")
            .forEach(function (this_hide) {
                this_hide.classList.add("frenzyHideOption");
            });
    }
    if (typeof FrenzyProductGridChangeCallBack == "function") {
        FrenzyProductGridChangeCallBack(doc_html, x);
    }

    return doc_html.querySelector(".frenzy_grid").outerHTML;
}

/* Product Grid Format */
function getCollectionFeaturedImageElement(
    image,
    text,
    image_link,
    image_length
) {
    var element = `<div class="frenzy_grid frenzy_collection_featured_image_wrapper frenzy_collection_featured_image_length_${image_length}">`;

    if (image_link) {
        element += `<a class="frenzy_collection_featured_image_link" href="${image_link}">`;
    }

    if (image) {
        element += `<img class="frenzy_collection_featured_image" src="${image}" />`;
    }

    if (text && text != '') {
        element += `<div class="frenzy_collection_featured_text">${text}</div>`;
    }

    if (image_link) {
        element += '</a>';
    }

    element += '</div>';

    return element;
}

/* Cross Sell Carousel Section */
let get_frenzy_cross_sell_carousel_section = document.querySelector(
    ".frenzy_cross_sell_carousel_section"
);
const getCrossSellCarouselApi = async () => {

    document.querySelectorAll('.frenzy_cross_sell_carousel_section').forEach(function(self,index){
        const frenzyApiName = "cross_sell_carousel";
        const sectionIndex = index + 1;
        const swiperContainerClass = frenzyApiName+'-'+sectionIndex;
        self.classList.add(swiperContainerClass);
        if (self.getAttribute('data-variantID')) {
            variant_id_Frenzy = self.getAttribute('data-variantID');
        }
        if (product_id_Frenzy && variant_id_Frenzy) {
            frenzy_sku = product_id_Frenzy + "_" + variant_id_Frenzy;
        }
        const frenzy_recommendation_section_config = self.getAttribute("config_id");
        var data_json = JSON.stringify({
            sku: frenzy_sku,
            user_id: user_id_Frenzy.toString(),
            page: __st.p,
            shop: frenzyShop,
            num_matching: 15,
            full_description: true,
            config_id: frenzy_recommendation_section_config,
            currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
            country: Shopify.country ? Shopify.country : '',
            company_id: frenzy_company_id ? frenzy_company_id : null,
            location_id: frenzy_location_id ? frenzy_location_id : null
        });
        const  frenzy_recom_api = "/pair-with";
        getRecommendationAPIWithStructure(data_json, frenzy_recom_api, self,frenzyApiName,sectionIndex);
    });
};

/* Most Clicked Skus Section */
let get_frenzy_most_clicked_skus_section = document.querySelector(
    ".frenzy_most_clicked_skus_section"
);
const getMostClickedSkusApi = async () => {
    document.querySelectorAll('.frenzy_most_clicked_skus_section').forEach(function(self,index){
        const frenzyApiName = "most_clicked_skus_carousel";
        const sectionIndex = index + 1;
        const swiperContainerClass = frenzyApiName+'-'+sectionIndex;
        self.classList.add(swiperContainerClass);
        const frenzy_recommendation_section_config = self.getAttribute("config_id");
        var data_json = JSON.stringify({
            shop: frenzyShop,
            full_description: true,
            config_id: frenzy_recommendation_section_config,
            user_id: user_id_Frenzy.toString(),
            currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
            country: Shopify.country ? Shopify.country : '',
            company_id: frenzy_company_id ? frenzy_company_id : null,
            location_id: frenzy_location_id ? frenzy_location_id : null
        });
        const frenzy_recom_api = '/most-clicked-skus';
        getRecommendationAPIWithStructure(data_json, frenzy_recom_api, self,frenzyApiName, sectionIndex);
    });
};

/* Get cart items */
var getCartItems;
if (isCommunityEnabled) {
    getCartItems = ()=> {}
} else {
    getCartItems = async () => {
        frenzyAllSkus = [];
        const response = await fetch(Shopify.routes.root + "cart.js", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        frenzyCartProductId =
            data && data.items && data.items[0] && data.items[0].product_id
                ? data.items[0].product_id
                : "";
        frenzyCartVariantId =
            data && data.items && data.items[0] && data.items[0].variant_id
                ? data.items[0].variant_id
                : "";
        (data?.items || []).map((x, i) => {
            const getSkuVal = x.product_id + "_" + x.variant_id;
            const findSkuIndex = (frenzyAllSkus || []).findIndex(
                (y) => y == getSkuVal
            );
            if (findSkuIndex === -1) {
                frenzyAllSkus.push(x.product_id + "_" + x.variant_id);
            }
        });
        if (data && data.items && data.items[0] && data.items[0].product_id) {
            get_cart_items = true;
        }
        if(data?.items.length == 0){
        if(document.querySelectorAll('.frenzy_cart_popup_section')){
            document.querySelectorAll('.frenzy_cart_popup_section').forEach(function(this_click){
              this_click.innerHTML = '';
            });
        }
        }
        if (get_frenzy_cart_page_section) {
        if(data?.items.length != 0){
            getCartPageApi();
        }
        }
        if (get_frenzy_cart_popup_section) {
          let empty_cart_carousel = get_frenzy_cart_popup_section.getAttribute('data-empty_cart_carousel');
            if(data?.items.length == 0 && empty_cart_carousel && empty_cart_carousel == "true"){
              empty_cart_carousel_status = true;
              getAddCartApi();  
            }else if(data?.items.length != 0){
              empty_cart_carousel_status = false;
              getAddCartApi();
            }
            // if(data?.items.length != 0){
            
            // }
        } else {
            setTimeout(function () {
                get_frenzy_cart_popup_section = document.querySelector(
                    ".frenzy_cart_popup_section"
                );
                if (get_frenzy_cart_popup_section) {
                  let empty_cart_carousel = get_frenzy_cart_popup_section.getAttribute('data-empty_cart_carousel');
                    if(data?.items.length == 0 && empty_cart_carousel && empty_cart_carousel == "true"){
                      empty_cart_carousel_status = true;
                      getAddCartApi();
                    }else if(data?.items.length != 0){
                      empty_cart_carousel_status = false;
                      getAddCartApi();
                    }
                }
            }, 1000);
        }
    };
}

/* Cart Page */
let get_frenzy_cart_page_section = document.querySelector(
    ".frenzy_cart_page_section"
);
const getCartPageApi = async () => {
    document.querySelectorAll('.frenzy_cart_page_section').forEach(function(self,index){
        const frenzyApiName = "cart";
        const sectionIndex = index + 1;
        const swiperContainerClass = frenzyApiName+'-'+sectionIndex;
        self.classList.add(swiperContainerClass);
        const frenzy_recommendation_section_config = self.getAttribute("config_id");
        var data_json = JSON.stringify({
            shop: frenzyShop,
            user_id: user_id_Frenzy.toString(),
            sku: frenzyCartProductId + "_" + frenzyCartVariantId,
            cart_skus: frenzyAllSkus,
            config_id: frenzy_recommendation_section_config,
            currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
            country:Shopify.country ? Shopify.country : '',
            company_id: frenzy_company_id ? frenzy_company_id : null,
            location_id: frenzy_location_id ? frenzy_location_id : null
        });
        const frenzy_recom_api = '/cart';
        getRecommendationAPIWithStructure(data_json, frenzy_recom_api, self,frenzyApiName, sectionIndex);
    });
};

/* Add to cart pop up */
let get_frenzy_cart_popup_section = document.querySelector(
    ".frenzy_cart_popup_section"
);
const getAddCartApi = async () => {
    if (get_frenzy_cart_popup_section) {
        frenzy_recommendation_section_config =
            get_frenzy_cart_popup_section.getAttribute("config_id");
    }
    let sku = "";
    if (frenzyCartProductId != "" && frenzyCartVariantId != "") {
        sku = frenzyCartProductId + "_" + frenzyCartVariantId;
    }
    var data_json = {
        shop: frenzyShop,
        user_id: user_id_Frenzy.toString(),
        sku: sku,
        cart_skus: frenzyAllSkus,
        config_id: frenzy_recommendation_section_config,
        currency:Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : '',
        company_id: frenzy_company_id || 'null',
        location_id: frenzy_location_id || 'null'
    };
    data_json = Object.entries(
        data_json
    )
    .map((e) => e.join("="))
    .join("&");
    const response = await fetch(authUrl_Frenzy + "/add-cart?"+data_json, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    if (data.status === 200) {
       const cartSettings = data?.data?.settings ? data?.data?.settings : data?.data?.cart_popup;
       const globalSetting = data?.data?.global_setting;
        dataConfig = data.data.config_id !== undefined ? data.data.config_id : data.config_id !== undefined ? data.config_id : null;
        let hide_carousel_after_cart = cartSettings?.hide_carousel_after_cart ? cartSettings?.hide_carousel_after_cart : globalSetting?.hide_carousel_after_cart ? globalSetting?.hide_carousel_after_cart : "0";
        let session_hide_carousel_after_cart = sessionStorage.getItem(
            "hide_carousel_after_cart"
        )
            ? sessionStorage.getItem("hide_carousel_after_cart")
            : "0";
        FrenzyProductImgResize(globalSetting);
        let frenzy_products = data?.data?.matching_products ? data?.data?.matching_products : data?.data?.products;
        const all_product_data = data.data;
        let hide_carousel_status = true;
        if (hide_carousel_after_cart == 1) {
            if (session_hide_carousel_after_cart == 1) {
                hide_carousel_status = false;
                document.querySelector(
                    ".frenzy_cart_popup_section"
                ).style.display = "none";
            }
        }
        if (hide_carousel_status) {
            if (get_frenzy_cart_popup_section) {
                getAddCartProducts(
                    frenzy_products,
                    cartSettings,
                    data?.data?.recommendation_html,
                    data?.data?.request_id,
                    "add_cart",
                    dataConfig,
                    all_product_data
                );
            } else {
                setTimeout(function () {
                    get_frenzy_cart_popup_section = document.querySelector(
                        ".frenzy_cart_popup_section"
                    );
                    if (get_frenzy_cart_popup_section) {
                        getAddCartProducts(
                            frenzy_products,
                            cartSettings,
                            data.data.recommendation_html,
                            data.data.request_id,
                            "add_cart",
                            dataConfig,
                            all_product_data
                        );
                    }
                }, 1000);
            }
            const cartPopupCss = data?.data?.css ? data?.data?.css : data?.data?.cart_popup_css;
            let cssdata =
                ".frenzy_cart_popup_section .frenzy_product_item figure{border-color: #" +
                cartPopupCss.card_border_color +
                ";} " +
                ".frenzy_cart_popup_section .frenzy_product_item_detail, .frenzy_cart_popup_section .frenzy_product_item_detail h3 a{color:#" +
                cartPopupCss.text_color +
                "} " +
                ".frenzy_cart_popup_section .frenzy_product_price_sale.is-sale{color:#" +
                  cartPopupCss?.sale_price_color +
                "} " +
                ".frenzy_cart_popup_section .frenzy_product_price_sale{color:#" +
                cartPopupCss.price_color +
                "} " +
                ".frenzy_cart_popup_section .frenzy_product_price_compare{color:#" +
                cartPopupCss.compare_price_color +
                "} " +
                ".frenzy_cart_popup_section .swiper-button-next:after, .frenzy_cart_popup_section .swiper-button-prev:after{color:#" +
                cartPopupCss.arrow_color +
                "} " +
                ".frenzy_cart_popup_section .frenzy_recommendation_title {font-size:" +
                cartPopupCss.title_font_size +
                "px}" +
                ".frenzy_cart_popup_section .frenzy_product_item .frenzy_quickView_btn{display:none !important}" +
                ".frenzy_cart_popup_section .frenzy_product_item .frenzy_product_tags .custom_tag{display:none !important}";
            if (cartSettings.image_border_show == "0") {
                cssdata +=
                    ".frenzy_cart_popup_section .frenzy_product_item figure{border:none !important;}";
            }
            if (cartSettings.show_add_to_cart_button == "0") {
                cssdata +=
                    ".frenzy_cart_popup_section .frenzy_product_item .frenzy_add_to_cart_btn{display:none !important;}";
            }
            if (cartSettings?.show_variant_option != "1") {
                cssdata +=
                    ".frenzy_cart_popup_section .frenzy_product_item .frenzy_variant_option{display:none !important}";
            }
            let head_Frenzy =
                    document.head || document.getElementsByTagName("head")[0],
                style_Frenzy = document.createElement("style");
            head_Frenzy.appendChild(style_Frenzy);
            style_Frenzy.type = "text/css";
            if (style_Frenzy.styleSheet) {
                style_Frenzy.styleSheet.cssText = cssdata;
            } else {
                style_Frenzy.appendChild(document.createTextNode(cssdata));
            }
        }
    }
};

function getAddCartProducts(
    productData,
    settingData,
    gridHtml,
    frenzy_request_id,
    frenzy_product_click,
    dataConfig,
    all_product_data
) {
    if (!get_frenzy_cart_popup_section) {
        get_frenzy_cart_popup_section = document.querySelector(
            ".frenzy_cart_popup_section"
        );
    }
    let product_grid_html = gridHtml;

    const title_align =
        settingData.title_align === "1"
            ? "text_align-left"
            : settingData.title_align === "2"
            ? "text_align-right"
            : "text_align-center";
    const shop_currency =
        get_frenzy_cart_popup_section.getAttribute("data-currency");
    check_shop_currency_frenzy(shop_currency || "");
    let homeCarouselProductHTML = "";
    (productData || []).map((x, i) => {
        homeCarouselProductHTML += getProductGridItem(
            product_grid_html,
            x,
            settingData,
            frenzy_shop_currency,
            frenzy_request_id,
            frenzy_product_click,
            dataConfig
        );
    });
    let cart_popup_title = empty_cart_carousel_status == true ? settingData?.empty_cart_carousel_title : settingData?.grid_title;
    let cartPopupHtml =
        '<h2 class="frenzy_recommendation_title ' +
        title_align +
        '">' +
        cart_popup_title +
        "</h2>";
    cartPopupHtml +=
        '<div class="frenzy_recommendation_wraper frenzy_vertical_grid frenzy_slider"><div class="frenzy_recommendation_contain">';
    cartPopupHtml +=
        '<div class="recommendation_product_items frenzy_product_row swiper-wrapper ltg_1">' +
        homeCarouselProductHTML +
        "</div>";
    cartPopupHtml +=
        '</div><button class="swiper-button-prev"></button><button class="swiper-button-next"></button></div>';
    document
        .querySelectorAll(".frenzy_cart_popup_section")
        .forEach(function (this_section) {
            this_section.innerHTML = cartPopupHtml;
            if (productData.length === 0) {
                this_section.style.display = "none";
            } else {
                this_section.style.display = "block";
            }
        });
    if (productData.length) {
        const frenzy_infinite_loop =
            settingData?.infinite_loop === "1" ? true : false;
        setTimeout(function () {
            var swiper = new Swiper(
                ".frenzy_cart_popup_section .frenzy_recommendation_contain",
                {
                    spaceBetween: 0,
                    slidesPerView: "auto",
                    loop: frenzy_infinite_loop,
                    a11y: false,
                    keyboard: {
                        enabled: true,
                    },
                    //shortSwipes: false,
                    navigation: {
                        nextEl: ".frenzy_cart_popup_section .swiper-button-next",
                        prevEl: ".frenzy_cart_popup_section .swiper-button-prev",
                    },
                    paginationClickable: true,
                }
            );
        }, 250);
    }
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
}

/* Search Page */
let get_frenzy_search_page_section = document.querySelector(".frenzy_search_page");
let search_query = "";

const getSearchPageApi = async () => {
    let productRequestURL = '';
    let productSession_url = "";
    let get_session_product_current_url =sessionStorage.getItem("frenzy-session");
    if (get_session_product_current_url != null) {
        get_session_product_current_url = JSON.parse(get_session_product_current_url);
        productSession_url = get_session_product_current_url.requestURL;
    }
    search_query = new URL(window.location.href).searchParams.get("q");
    useSpellCheckParam = new URL(window.location.href).searchParams.get("use_spell_check");
    let frenzy_search_page_section_config = get_frenzy_search_page_section.getAttribute("data-config_id") ? get_frenzy_search_page_section.getAttribute("data-config_id") : '';
    if (useSpellCheckParam == "false") {
        useSpellCheck = false;
    }

    let frenzy_search_data_json = {
        raw_query: encodeURIComponent(search_query),
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        shop: frenzyShop,
        mode: 1,
        page_index: 0,
        use_spell_check: useSpellCheck,
        config_id: frenzy_search_page_section_config,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country: Shopify.country ? Shopify.country : '',
        company_id: frenzy_company_id || 'null',
        location_id: frenzy_location_id || 'null'
    };
    filter_query = [];
    Object.entries(filterArray_Frenzy || {}).map((x, i) => {
        if (x[0] === "org_price") {
            if (x[1].min || x[1].min == 0) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + ">" + x[1].min,
                });
            }
            if (x[1].max) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + "<" + x[1].max,
                });
            }
        } else {
            (x[1] || []).map((y, z) => {
                filter_query.push({ key: "filters=", value: x[0] + ":" + encodeURIComponent(y) });
            });
        }
    });
    frenzy_search_data_json = Object.entries(frenzy_search_data_json)
        .map((e) => e.join("="))
        .join("&");
    let params = "";
    filter_query.forEach((filter) => {
        params += "&" + filter.key + filter.value;
    });
    productRequestURL = authUrl_Frenzy + '/search?' + frenzy_search_data_json + params;
    if(productRequestURL == productSession_url && controlPageRefresh != true){
      revert_data(get_session_product_current_url);
      frenzyAsyncItems();
    }else{
      const response = await fetch(productRequestURL,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "x-frenzy-authorization": frenzy_api_key,
                  "X-Shop": frenzyShop
              },
          }
      );
      const data = await response.json();

      useSpellCheck = data.data.results.use_spell_check;

      if (useSpellCheck == false) {
          const url = new URL(window.location);
          url.searchParams.set('use_spell_check', 'false');
          window.history.pushState({}, '', url);
      }

      if (data?.data?.results?.redirect_url) {
          window.location.href = data.data.results.redirect_url;
      } else {
          dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
          let productResults = data.data.results.results;
          let productSearchPageSetting = data.data.search_page;
          let productGridHtml = data.data.recommendation_html;
          let sideBarFields = data.data.results.facet_fields;
          let total_record = data.data.results.products_found;
          let total_page = data.data.results.page_count;
          let corrected_query = data.data.results.corrected_query;
          let searchPageCss = data.data.search_page_css;
          let no_search_result = productSearchPageSetting?.no_search_result;
          let no_search_result_html = productSearchPageSetting?.no_search_result_html;
          const all_product_data = data.data;
          if(isSelectedFilterClickEvent != true){
              sessionStorage.setItem("search_sidebar_filter_hide",'');
          }
          const getSidebar_filter_hide = sessionStorage.getItem("search_sidebar_filter_hide");
          if(getSidebar_filter_hide != null && getSidebar_filter_hide != ''){
            sidebar_filter_open_hide = getSidebar_filter_hide;
          }else{
            if(productSearchPageSetting?.sidebar_filter_open_hide == '1'){
              sidebar_filter_open_hide = productSearchPageSetting?.sidebar_filter_open_hide; // 1 is show and 0 is hide
            }
          }
          (data.data.filter_order || []).map((x) => {
              let boj = {
                  ...x,
                  selected: 0,
              };
              filter_order_Frenzy.push(boj);
          });
          const obj_filters = data.data.results.filters;
          const obj_facet_fields = data.data.results.facet_fields;
          Object.keys(obj_filters).map((key, index) => {
              if (obj_facet_fields[key] && key != "org_price") {
                  filterArray_Frenzy[key] = [];
                  (obj_filters[key] || []).map((x, i) => {
                      filterArray_Frenzy[key].push(x);
                  });
              }
          });
          const frenzy_request_id = data.data.results.request_id;
          const frenzy_product_click = "search";
          const colorSwatches = data.data.results.color_swatches || [];
          updatePriceRangeValues(data.data.results.stats.org_price, data.data.results.filters.org_price);

          const languageText = data.data.label_text;
          const globalSetting = data?.data?.global_setting;
          old_dataResults = old_dataResults.concat(data.data.results.results);
          var his_data = {
              ...data.data,
              results: { ...data.data.results, results: old_dataResults },
          };
          var SessionData = {
              frenzycollectdata: his_data,
              frenzypageNo: 0,
              url: window.location.href,
              position: current_position,
              country:Shopify.country,
              requestURL: productRequestURL
          };
          sessionStorage.setItem("search_sidebar_filter_hide", sidebar_filter_open_hide);
          sessionStorage.setItem("frenzy-session", JSON.stringify(SessionData));
          FrenzyProductImgResize(globalSetting);
          getSearchPage(
              productResults,
              productSearchPageSetting,
              searchPageCss,
              productGridHtml,
              sideBarFields,
              filter_order_Frenzy,
              total_record,
              total_page,
              corrected_query,
              filterArray_Frenzy,
              frenzy_request_id,
              frenzy_product_click,
              colorSwatches,
              languageText,
              dataConfig,
              all_product_data
          );
          if (data?.data?.results?.products_found === 0) {
             if(no_search_result == true){
               if(no_search_result_html.includes("frenzy_recommendation_section")){
                   get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                   get_frenzy_recommendation_section = document.querySelector(".frenzy_recommendation_section");
                   frenzy_recom_api = "/personalized-recommendation";
                   getRecommendationProductsApi();
               }else if(no_search_result_html.includes("frenzy_most_clicked_skus_section")){
                  get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                  get_frenzy_most_clicked_skus_section = document.querySelector(".frenzy_most_clicked_skus_section");
                  getMostClickedSkusApi();
               }else if(no_search_result_html.includes("frenzy_cross_sell_carousel_section")){
                  get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                  get_frenzy_cross_sell_carousel_section = document.querySelector(".frenzy_cross_sell_carousel_section");
                  getCrossSellCarouselApi();
               }else if(no_search_result_html.includes("frenzy_cart_page_section")){
                  get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                  get_frenzy_cart_page_section = document.querySelector(".frenzy_cart_page_section");
                  getCartPageApi();
               }
               get_frenzy_search_page_section.style.minHeight = 'initial';
             }
              //getSearchCarouselApi();
          }
      }
    }
};
const getSearchPAgeFilterChangeApi = async (
    filter,
    page_no,
    frenzy_url_push
) => {
    let productRequestURL = '';
    let productSession_url = "";
    let get_session_product_current_url =sessionStorage.getItem("frenzy-session");
    if (get_session_product_current_url != null) {
        get_session_product_current_url = JSON.parse(get_session_product_current_url);
        productSession_url = get_session_product_current_url.requestURL;
    }
    if (frenzy_url_push) {
      if (typeof frenzyFilterClickCallBack == "function") {
          frenzyFilterClickCallBack();
      }else{
        const scrollDemo = document.querySelector(".frenzy_search_page .frenzy_flex_row");
        const bodyOffset = document.body.getBoundingClientRect().top + 100;
        if(!collectionSearchQueryVal){
          window.scrollTo({
            top: scrollDemo.getBoundingClientRect().top - bodyOffset,
            behavior: "smooth",
          });
        }
      }
    }
    let frenzy_search_page_section_config = get_frenzy_search_page_section.getAttribute("data-config_id") ? get_frenzy_search_page_section.getAttribute("data-config_id") : '';
    if (typeof frenzyAnimationCallBack == "function") {
        document
            .querySelector(".frenzy_search_page")
            .insertAdjacentHTML(
                "beforeend",
                '<div class="frenzyPreloader">' +
                    frenzyAnimationCallBack() +
                    "</div>"
            );
    } else {
      if(document.querySelector(".frenzy_search_page .frenzy_flex_contain_area")){
        document.querySelector(".frenzy_search_page .frenzy_flex_contain_area").innerHTML = PlaceHolderGridLoad(get_frenzy_search_page_section,false,6);
      }
    }

    old_dataResults = [];
    search_query = new URL(window.location.href).searchParams.get("q");
    useSpellCheckParam = new URL(window.location.href).searchParams.get("use_spell_check");

    if (useSpellCheckParam == "false") {
        useSpellCheck = false;
    }

    if (!filter.org_price) {
        filter.org_price = { min: FRENZY_MIN_PRICE, max: FRENZY_MAX_PRICE };
    }

    let frenzy_filter_data_json = {
        raw_query: encodeURIComponent(search_query),
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        shop: frenzyShop,
        mode: 2,
        page_index: page_no > 0 ? page_no : 0,
        use_spell_check: useSpellCheck,
        config_id:frenzy_search_page_section_config,
        currency:Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    };
    filter_query = [];
    Object.entries(filter || {}).map((x, i) => {
        if (x[0] === "org_price") {
            if (x[1].min || x[1].min == 0) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + ">" + x[1].min,
                });
            }
            if (x[1].max) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + "<" + x[1].max,
                });
            }
        } else {
            (x[1] || []).map((y, z) => {
                filter_query.push({ key: "filters=", value: x[0] + ":" + encodeURIComponent(y) });
            });
        }
    });
    frenzy_filter_data_json = Object.entries(frenzy_filter_data_json)
        .map((e) => e.join("="))
        .join("&");
    let params = "";
    filter_query.forEach((filter) => {
        params += "&" + filter.key + filter.value;
    });
    productRequestURL = authUrl_Frenzy + '/search?' + frenzy_filter_data_json + params;
    if(productRequestURL == productSession_url && controlPageRefresh != true){
      revert_data(get_session_product_current_url);
      frenzyAsyncItems();
    }else{
      const response = await fetch(productRequestURL,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "x-frenzy-authorization": frenzy_api_key,
                  "X-Shop": frenzyShop
              },
          }
      );
      const data = await response.json();
      dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
      const productResults = data.data.results.results;
      const productSearchPageSetting = data.data.search_page;
      const productGridHtml = data.data.recommendation_html;
      const sideBarFields = data.data.results.facet_fields;
      const total_record = data.data.results.products_found;
      const total_page = data.data.results.page_count;
      const corrected_query = data.data.results.corrected_query;
      const searchPageCss = data.data.search_page_css;
      const all_product_data = data.data;
      const frenzyPaginationType = productSearchPageSetting?.pagination_type
          ? productSearchPageSetting.pagination_type
          : "0";
      var filter_data = data.data.filter_order;
      if(isSelectedFilterClickEvent != true){
        sessionStorage.setItem("search_sidebar_filter_hide",'');
      }
      const getSidebar_filter_hide = sessionStorage.getItem("search_sidebar_filter_hide");
      if(getSidebar_filter_hide != null && getSidebar_filter_hide != ''){
        sidebar_filter_open_hide = getSidebar_filter_hide;
      }else{
        if(productSearchPageSetting?.sidebar_filter_open_hide == '1'){
          sidebar_filter_open_hide = productSearchPageSetting?.sidebar_filter_open_hide; // 1 is show and 0 is hide
        }
      }
      let newcollection_filter_order = [];
      (filter_data || []).map((x,i)=>{
      const findOldData = filter_order_Frenzy.find((y) => y.key === x.key);
      if(findOldData != undefined && findOldData.selected == 1){
          x = {...x,selected:1}
          newcollection_filter_order.push(x);
        }else{
            newcollection_filter_order.push(x);
        }
      });
      filter_order_Frenzy = newcollection_filter_order;
      let getRawQuery = "";
      if (urlParams_Frenzy.get("q")) {
          // getRawQuery = urlParams_Frenzy.get("q").replace(" ", "+");
          getRawQuery = urlParams_Frenzy.get("q");
      }
      const createQueryString = (data) => {
          return Object.keys(data)
              .map((key) => {
                  let val = data[key];
                  if (val !== null && typeof val === "object")
                      val = createQueryString(val);
                  return `${key}=${encodeURIComponent(`${val}`)}`;
              })
              .join("&");
      };
      let urlfilterArray = filterArray_Frenzy;
      if (
          filterArray_Frenzy &&
          filterArray_Frenzy.org_price &&
          filterArray_Frenzy.org_price.min == FRENZY_MIN_PRICE &&
          filterArray_Frenzy &&
          filterArray_Frenzy.org_price &&
          filterArray_Frenzy.org_price.max == FRENZY_MAX_PRICE
      ) {
          delete urlfilterArray.org_price;
      }
      let urlCreateQuery = createQueryString(urlfilterArray);

      useSpellCheck = data.data.results.use_spell_check;
      let useSpellCheckQuery = '';

      if (useSpellCheck == false) {
          useSpellCheckQuery = "&use_spell_check=false";
      }

      if (frenzy_url_push) {
          if (frenzyPaginationType == 1) {
              window.history.pushState(
                  {},
                  "",
                  shopURL_Frenzy +
                      searchURL_Frenzy +
                      "?q=" +
                      encodeURIComponent(getRawQuery) +
                      useSpellCheckQuery +
                      "&" +
                      urlCreateQuery +
                      "&filterchange=true" +
                      "&sort=" +
                      isSeletedSortValue_Frenzy
              );
          } else {
              window.history.pushState(
                  {},
                  "",
                  shopURL_Frenzy +
                      searchURL_Frenzy +
                      "?q=" +
                      encodeURIComponent(getRawQuery) +
                      useSpellCheckQuery +
                      "&" +
                      urlCreateQuery +
                      "&filterchange=true&page=" +
                      selected_page_Frenzy +
                      "&sort=" +
                      isSeletedSortValue_Frenzy
              );
          }
      }
      const frenzy_request_id = data.data.results.request_id;
      const frenzy_product_click = "search";
      const colorSwatches = data.data.results.color_swatches || [];

      updatePriceRangeValues(data.data.results.stats.org_price, data.data.results.filters.org_price);

      const languageText = data.data.label_text;
      const globalSetting = data?.data?.global_setting;
      FrenzyProductImgResize(globalSetting);
      getSearchPage(
          productResults,
          productSearchPageSetting,
          searchPageCss,
          productGridHtml,
          sideBarFields,
          filter_order_Frenzy,
          total_record,
          total_page,
          corrected_query,
          filterArray_Frenzy,
          frenzy_request_id,
          frenzy_product_click,
          colorSwatches,
          languageText,
          dataConfig,
          all_product_data
      );
      old_dataResults = old_dataResults.concat(data.data.results.results);
      var his_data = {
          ...data.data,
          results: { ...data.data.results, results: old_dataResults },
      };
      var SessionData = {
          frenzycollectdata: his_data,
          frenzypageNo: page_no,
          url: window.location.href,
          position: current_position,
          country:Shopify.country,
          requestURL: productRequestURL
      };
      sessionStorage.setItem("search_sidebar_filter_hide", sidebar_filter_open_hide);
      sessionStorage.setItem("frenzy-session", JSON.stringify(SessionData));
      if (data?.data?.results?.products_found === 0) {
          getSearchCarouselApi();
      }
      if (data?.data?.results?.products_found != 0) {
          if (
              document
                  .querySelector("body")
                  .classList.contains("is-open-filter") == true
          ) {
              document
                  .querySelector(".frenzy_flex_row")
                  .insertAdjacentHTML(
                    "beforeend",
                    '<div class="frenzy_overlay_wrap"></div>'
                  );
            } else {
            }
        }
        frenzyFilterClose();
        setTimeout(function () {
            if (0 + 1 == total_page) {
                frenzyPageScroll = false;
            }
        }, 500);
    }
};
let filter_seleted_list = "";
function frenzySelectedFilterList(sideBarFieldsKeys) {
    const collection_handle = document
      .querySelector(".frenzy_collections_page")
      ?.getAttribute("data-handle");
    filter_seleted_list = "";
    let displayClearAllBtn = false;
    Object.keys(filterArray_Frenzy).map((key, index) => {
        if (key == "org_price") {
            if (filterArray_Frenzy[key].min != FRENZY_MIN_PRICE || filterArray_Frenzy[key].max != FRENZY_MAX_PRICE) {
                // if (frenzyMinPriceRange != frenzyAbsoluteMinPriceRange || frenzyMaxPriceRange != frenzyAbsoluteMaxPriceRange) {
                filter_seleted_list += '<li><div aria-label="selected range" class="filter_clear_item">' +
                  '<button class="filter_clear_icon filter_price_clear_btn">' +
                  '<span class="filter_clear_label">' +
                  currency_symbol_Frenzy +
                  frenzyMinPriceRange +
                  "-" +
                  currency_symbol_Frenzy +
                  frenzyMaxPriceRange +
                  '</span>' +
                  close_arrow_Frenzy +
                  "</button>";
                filter_seleted_list += "</div></li>";
                displayClearAllBtn = true;
            }
        } else {
            if (key != "use_spell_check" && sideBarFieldsKeys.includes(key)) {
                (filterArray_Frenzy[key] || []).map((x, i) => {
                    const frenzy_seleted_key = x?.replaceAll(" ", "-").replaceAll('"', '__');
                    if (
                      (collection_handle != frenzy_seleted_key ||
                        key != "collections") &&
                      key != "tags" &&
                      key != "q"
                    ) {
                        filter_seleted_list +=
                          '<li><div aria-label="'+x+'" class="filter_clear_item">' +
                          '<button class="filter_clear_icon" for="' +
                          key +
                          "-" +
                          frenzy_seleted_key +
                          '">' +
                          '<span class="filter_clear_label">' +
                          x +
                          '</span>' +
                          close_arrow_Frenzy +
                          "</button>";
                        filter_seleted_list += "</div></li>";
                        displayClearAllBtn = true;
                    }
                });
            }
        }
    });
    if (displayClearAllBtn) {
        filter_seleted_list +=
          '<li class="FSL_ClearItem"><div class="filter_clear_item">';
        filter_seleted_list +=
          '<button class="filter_clear_label filter_clear_all_btn" >Clear All</button>';
        filter_seleted_list += "</div></li>";
    }
}
function getSearchPage(
  productData,
  settingData,
  settingCss,
  gridHtml,
  sideBarFields,
  filter_order_Frenzy,
  total_record,
  total_page,
  corrected_query,
  filterArray_Frenzy,
  frenzy_request_id,
  frenzy_product_click,
  colorSwatches,
  languageText,
  dataConfig,
  all_product_data
) {
    let product_grid_html = gridHtml;
    const shop_currency =
      get_frenzy_search_page_section.getAttribute("data-currency");
    check_shop_currency_frenzy(shop_currency || "");
    const hide_frenzy_filter =
      settingData.filter == "0" ? "hide_frenzy_filter" : "";
    currency_symbol_Frenzy = frenzy_shop_currency.split("{")[0];
    let searchPageProductList = "";
    (productData || []).map((x, i) => {
        searchPageProductList += getProductGridItem(
          product_grid_html,
          x,
          settingData,
          frenzy_shop_currency,
          frenzy_request_id,
          frenzy_product_click,
          dataConfig
        );
    });
    let siderbar_filter_section_html = "";
    let topbar_filter_section_html = "";
    let FrenzyFilterOrderCount = 1;
    let defaultNumberOfFilterItems = 6;
    let singleFilterLayoutOptionLimit = 5;
    if(settingData.single_filter_layout_options_limit){
        singleFilterLayoutOptionLimit = parseInt(settingData.single_filter_layout_options_limit);
    }
    if (settingData.default_number_of_filter_items) {
        defaultNumberOfFilterItems = settingData.default_number_of_filter_items;
    }

    if (settingData.filter != "0") {
        (filter_order_Frenzy || []).map((x, i) => {
            let filter_name = x.key;
            let filter_label = x.value;
            let filter_info_box = x.info_box;
            let filter_display_type = x.display_type;
            let filter_swatch = x.swatch;
            let filter_data = sideBarFields[filter_name] ?? [];
            if (
              (filter_data.length != 0 ||
                filter_name === "price range" || filter_name === "org_price" ||
                (filter_name === "sortby" && settingData.sort === "2")) &&
              (x.status == "1" || x.status === true)
            ) {
                if (settingData.filter_layout === '0') {
                    if (
                      FrenzyFilterOrderCount <= singleFilterLayoutOptionLimit &&
                      (filter_name !== "price range" ||
                        filter_name !== "org_price")
                    ) {
                        topbar_filter_section_html += sideBarFilter(
                          filter_name,
                          filter_data,
                          filter_display_type,
                          filter_swatch,
                          x.selected,
                          filter_label,
                          settingData,
                          true,
                          colorSwatches,
                          languageText,
                          defaultNumberOfFilterItems,
                          filter_info_box
                        );
                    }
                    FrenzyFilterOrderCount = FrenzyFilterOrderCount + 1;
                    siderbar_filter_section_html += sideBarFilter(
                      filter_name,
                      filter_data,
                      filter_display_type,
                      filter_swatch,
                      x.selected,
                      filter_label,
                      settingData,
                      false,
                      colorSwatches,
                      languageText,
                      defaultNumberOfFilterItems,
                      filter_info_box
                    );
                } else {
                    siderbar_filter_section_html += sideBarFilter(
                      filter_name,
                      filter_data,
                      filter_display_type,
                      filter_swatch,
                      x.selected,
                      filter_label,
                      settingData,
                      false,
                      colorSwatches,
                      languageText,
                      defaultNumberOfFilterItems,
                      filter_info_box
                    );
                }
            }
        });
    }

    let frenzySortingHtml = '';

    if (settingData.sort !== '0') {
        frenzySortingHtml = `
            <div class="frenzy_collection__sort">
                <div class="frenzy_popout--navbar">
                    <h2 class="visually-hidden" id="frenzy_sort-heading">
                        Sort
                    </h2>
                    <popout-select>
                        <div class="frenzy_popout" data-sort-enabled="manual" data-popout="">
                            <button type="button" class="frenzy_popout__toggle" aria-expanded="false" aria-controls="frenzy_sort-list" aria-describedby="frenzy_sort-heading" aria-label="Sort" data-popout-toggle="">
                                <span data-sort-button-text="" class="frenzy_sort-heading-desktop">Sort</span>
                                <span class="frenzy_sort-heading-mobile">Sort</span>
                                <svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 9 15"><path fill-rule="evenodd" d="M6.875 7.066L.87 1.06 1.93 0l6.006 6.005L7.94 6 9 7.06l-.004.006.005.005-1.06 1.06-.006-.004-6.005 6.005-1.061-1.06 6.005-6.006z"></path></svg>
                            </button>
                            <ul id="frenzy_sort-list" class="frenzy_popout-list"></ul>
                        </div>
                    </popout-select>
                </div>
            </div>
        `;
    }

    let search_page_html = `<div class="frenzy_container frenzy_filter_checkbox_visibility_${settingData.filter_checkbox_visibliity} frenzy_filter_sidebar_dropdown_arrow_show_${settingData.filter_sidebar_dropdown_arrow}">`;

    let hasCorrectedQuery = false;

    if (corrected_query) {
        if(search_query){
            if(search_query.trim().toLowerCase() !== corrected_query.trim().toLowerCase()) {
                hasCorrectedQuery = true;
            }
        }
    }

    if (search_query != "") {
        if (hasCorrectedQuery) {
            search_page_html +=
              '<h1 class="frenzy_search_title">Showing results for "<span class="frenzy_search_title_query">' +
              corrected_query +
              '</span>"</h1>';

            search_page_html +=
              '<h3 class="frenzy_search_title_alt">Search instead for "<span class="frenzy_search_title_alt_query">' +
              search_query +
              '</span>"</h3>';
        } else {
            search_page_html +=
              '<h1 class="frenzy_search_title">Showing results for "<span class="frenzy_search_title_query_no_link">' +
              search_query +
              '</span>"</h1>';
        }
    }

    // Sidbar Filter Navigation
    if (settingData.filter_layout !== '0') {
        var filter_toggle = '';
        if(sidebar_filter_open_hide == '1'){
            filter_toggle = 'data-filters-toggle="filters"';
            document.querySelector('body').classList.remove('hide-frenzy-filter');
        }else{
            document.querySelector('body').classList.add('hide-frenzy-filter');
        }
        search_page_html += `
            <nav class="frenzy_collection__nav">
                <div class="frenzy_collection__nav__buttons">
                    <button class="frenzy_collection__nav__filters__toggle" `+filter_toggle+`>
                        <span class="frenzy_collection__nav_hide_filters">Hide filters</span>
                        <span class="frenzy_collection__nav_show_filters">Filter</span>
                        <svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-filter" viewBox="0 0 10 6"><path d="M0 0h10v1H0zm2 2.5h6v1H2zM6.5 5h-3v1h3z" fill-rule="evenodd"></path></svg>
                    </button>
                    <div class="frenzy_collection__sort">
                        <div class="frenzy_popout--navbar">
                            <h2 class="visually-hidden" id="frenzy_sort-heading">
                                Sort
                            </h2>
                            <popout-select>
                                <div class="frenzy_popout" data-sort-enabled="manual" data-popout="">
                                    <button type="button" class="frenzy_popout__toggle" aria-expanded="false" aria-controls="frenzy_sort-list" aria-describedby="frenzy_sort-heading" aria-label="Sort" data-popout-toggle="">
                                        <span data-sort-button-text="" class="frenzy_sort-heading-desktop">Sort</span>
                                        <span class="frenzy_sort-heading-mobile">Sort</span>
                                        <svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-sort" viewBox="0 0 10 6"><path d="M0 0h10v1H0zm0 2.5h6v1H0zM3 5H0v1h3z" fill-rule="evenodd"></path></svg>
                                    </button>
                                    <ul id="frenzy_sort-list" class="frenzy_popout-list"></ul>
                                </div>
                            </popout-select>
                        </div>
                    </div>
                </div>
        `;

        // Display orientation buttons
        if (settingData.filter_display_orientation !== '0') {
            search_page_html += nav_layout_grid(settingData);
        }

        search_page_html += '</nav>';

        // Result count text
        search_page_html +=
          `<div class="frenzy_topbar_count_col"><span>Showing ${total_record} results</span></div>`;
    }

    if (settingData.filter_show_more_button !== "0") {
        search_page_html += `<style>.fwc_filters_list:nth-child(n+${+defaultNumberOfFilterItems + 1}) {display: none;} .filter_widget_section.show_all .fwc_filters_list {display: block;}</style>`;
    }

    const frenzy_topbar_filter_cls =
      settingData.filter_layout === '0' ? "frenzy_topbar_filter" : "";
    const filter_title = settingData?.filter_title;
    search_page_html +=
      '<div class="frenzy_flex_row ' + frenzy_topbar_filter_cls + '">';
    if (settingData.filter_layout === '0' && total_record != "0") {
        search_page_html += `<div class="frenzy_filter_container_element frenzy_flex_topbar_contain frenzy_flex_topbar_top_border_${settingData.filter_single_row_filter_top_border} frenzy_flex_topbar_bottom_border_${settingData.filter_single_row_filter_bottom_border}">`;
        search_page_html +=
          '<div class="frenzy_flex_topbar_btn_col"><button type="button" class="frenzy_filter_toggle">'+filter_title+'<svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 9 15"><path fill-rule="evenodd" d="M6.875 7.066L.87 1.06 1.93 0l6.006 6.005L7.94 6 9 7.06l-.004.006.005.005-1.06 1.06-.006-.004-6.005 6.005-1.061-1.06 6.005-6.006z"></path></svg></button></div>';
        search_page_html +=
          '<div class="frenzy_flex_topbar_filter_col"><div class="swiper-wrapper">' +
          topbar_filter_section_html +
          "</div></div>";
        if (settingData.sort == "1") {
            search_page_html +=
              '<div class="frenzy_topbar_sorting_col">' +
              frenzySortingHtml +
              "</div>";
        }

        // Display orientation buttons
        if (settingData.filter_display_orientation !== '0') {
            search_page_html += nav_layout_grid(settingData);
        }

        search_page_html += "</div>";
    }

    // Result count text
    search_page_html +=
      `<div class="frenzy_topbar_count_col"><span>Showing ${total_record} results</span></div>`;

    if (
      settingData.filter != "0" &&
      settingData.seleted_filter_type == "1"
    ) {
        frenzySelectedFilterList(Object.keys(sideBarFields));
        search_page_html +=
          '<div class="frenzy_topbar_seleted_Filter_col"><ul class="filterSeletedList">' +
          filter_seleted_list +
          "</ul></div>";
    }

    if (settingData.filter != "0") {
        search_page_html +=
          '<div class="frenzy_filter_container_element frenzy_flex_col ffc_sidebar_col">';

        if (settingData.filter_sticky == '1') {
            search_page_html += '<div class="frenzy_sidebar_panel frenzy_sidebar_panel_sticky">';
        } else {
            search_page_html += '<div class="frenzy_sidebar_panel">';
        }

        search_page_html += '<div class="frenzy_sidebar_header">';
        if (settingData.filter_title) {
            search_page_html += "<h3>" + settingData.filter_title + "</h3>";
        }
        search_page_html +=
          '<button type="button" class="frenzy_filter_close">' +
          close_arrow_Frenzy +
          "</button>";
        if (settingData.seleted_filter_type == "2") {
            frenzySelectedFilterList(Object.keys(sideBarFields));
            search_page_html +=
              '<div class="filter_widget_seleted_Filter"><ul class="filterSeletedList">' +
              filter_seleted_list +
              "</ul></div>";
        }
        search_page_html += "</div>";
        search_page_html +=
          '<div class="filter_widget_section_contain">' +
          siderbar_filter_section_html +
          "</div>";
        search_page_html += `
            <div class="frenzy_filter_widget_footer">
                <div class="frenzy_filter_widget_footer_button_show_all">
                    <div class="frenzy_filter_widget_footer_button">SHOW ${total_record} RESULTS</div>
                </div>
                <div class="frenzy_filter_widget_footer_button_clear">
                    <div class="frenzy_filter_widget_footer_button">CLEAR ALL</div>
                </div>
            </div>
        `;
        search_page_html += "</div></div>";
    }
    search_page_html +=
      '<div class="frenzy_flex_col frenzy_flex_contain_area">';
    search_page_html +=
      '<div class="frenzy_topbar_contain ' + hide_frenzy_filter + '">';
    if (settingData.filter != "0") {
        search_page_html +=
          '<div class="frenzy_filter_btn_col"><button type="button" class="frenzy_filter_toggle">' +
          filter_icon_Frenzy +
          "<span>Filters</span></button></div>";
    }
    if (settingData.sort == "1") {
        search_page_html +=
          '<div class="frenzy_topbar_sorting_col">' +
          frenzySortingHtml +
          "</div>";
    }
    search_page_html += "</div>";
    if (total_record <= 0) {
        const frenzy_searchQueryText =
          search_query != "" ? search_query : "Query";
        searchPageProductList =
          '<div class="resultNotFoundText">We are sorry, but no results were found for: "' +
          frenzy_searchQueryText +
          '"</div>';
        searchPageProductList += '<div class="frenzySearchCarousel"></div>';
    }
    const frenzyPaginationType = settingData?.pagination_type
      ? settingData.pagination_type
      : "0";

    let frenzyPagination = frenzyPaginationType;

    let frenzyMobilePaginationType = frenzyPaginationType;
    if(settingData?.mobile_pagination_type && window.innerWidth < 768){
       frenzyMobilePaginationType = settingData?.mobile_pagination_type;
       frenzyMobilePaginationType = (frenzyMobilePaginationType == 'loadmore') ? "1" : "0";
       frenzyPagination = frenzyMobilePaginationType;
    }
    search_page_html +=
      '<div class="frenzy_search_page_contain frenzy_product_row" id="frenzyProductList">' +
      searchPageProductList +
      "</div>";
    if (1 < total_page && frenzyPagination === "0") {
        search_page_html +=
          '<div class="frenzy_pagination_nav"><div class="pagination" id="pagination"></div></div>';
    }
    if (frenzyPagination === "1" && total_page > 1) {
        search_page_html +=
          '<div class="frenzy_load_more" id="frenzyAutoLoad"></div>';
    }
    search_page_html += "</div>";
    search_page_html += "</div>";
    search_page_html += "</div>";
    get_frenzy_search_page_section.innerHTML = search_page_html;
    // selected filter unclick event
    if(document.querySelectorAll('.filter_clear_icon').length > 0){
        document.querySelectorAll('.filter_clear_icon').forEach(function(this_click){
            this_click.addEventListener('click', function(){
                if(document.getElementById(this_click.getAttribute('for'))){
                    document.getElementById(this_click.getAttribute('for')).dispatchEvent(new Event('change', { 'bubbles': true }));
                }
            });
        });
    }
    if (
      performance.navigation.type == performance.navigation.TYPE_RELOAD
    ) {
        // setTimeout(function(){
        //   window.scrollTo({
        //     top: 0,
        //     behavior: "smooth"
        //   });
        // }, 110);
    }

    let gridClass = "ltg_" + settingData.grid_items_per_row + "";
    let collectionNavLayout = localStorage.getItem('collectionNavLayout');

    if (collectionNavLayout) {
        gridClass = "ltg_" + collectionNavLayout;
    }

    document
      .querySelector(".frenzy_search_page_contain")
      .classList.add(
      "layout_type_grid",
      gridClass
    );

    // Filter Toggle Button Click Handler
    var frenzyCollectionNavFiltersToggle = document.querySelector('.frenzy_collection__nav__filters__toggle');

    if (frenzyCollectionNavFiltersToggle) {
        frenzyCollectionNavFiltersToggle.addEventListener('click', function() {
            var toggleValue = frenzyCollectionNavFiltersToggle.getAttribute('data-filters-toggle');

            if (toggleValue == 'filters') {
                frenzyCollectionNavFiltersToggle.setAttribute('data-filters-toggle', '');
                document.querySelector('body').classList.add('hide-frenzy-filter');
                sidebar_filter_open_hide = '0';
            } else {
                frenzyCollectionNavFiltersToggle.setAttribute('data-filters-toggle', 'filters');
                document.querySelector('body').classList.remove('hide-frenzy-filter');
                sidebar_filter_open_hide = '1';
            }
            sessionStorage.setItem("search_sidebar_filter_hide", sidebar_filter_open_hide);
            document.querySelector("body").classList.add("is-open-filter");
            document
              .querySelector(".frenzy_flex_row")
              .insertAdjacentHTML(
                "beforeend",
                '<div class="frenzy_overlay_wrap"></div>'
              );
            frenzyFilterClose();
        });
    }

    // Add Sort options
    if(languageText?.sorting_value){
        (languageText.sorting_value || []).map((sortVal) => {
            const sortingStatus =
              (sortVal && sortVal.status === true) ||
              (sortVal && sortVal.status === false)
                ? sortVal.status
                : true;
            if (sortingStatus) {
                if (document.querySelector('.frenzy_popout-list')) {
                    document.querySelector('.frenzy_popout-list').innerHTML += `
                    <li class="frenzy_popout-list__item">
                        <a class="frenzy_popout-list__option ${isSeletedSortValue_Frenzy == sortVal.value ? "frenzy_popout-list__item--current" : ""}" data-value="${sortVal.value}" href="#">
                        <span>${sortVal.name}</span>
                        </a>
                    </li>
                `;
                }
            }

            if (isSeletedSortValue_Frenzy == sortVal.value) {
                if (document.querySelector('.frenzy_sort-heading-desktop')) {
                    document.querySelector('.frenzy_sort-heading-desktop').innerHTML = sortVal.name;
                }
            }
        });
    }

    // Sort Toggle Button Click Handler
    var frenzyCollectionNavSortToggle = document.querySelector('.frenzy_popout__toggle');
    var frenzyCollectionnavSortList = document.querySelector('.frenzy_popout-list');

    if (frenzyCollectionNavSortToggle) {
        frenzyCollectionNavSortToggle.addEventListener('click', function() {
            frenzyCollectionnavSortList.classList.toggle('frenzy_popout-list--visible');
        });
    }

    // Sort Option Click Handler
    document.querySelectorAll('.frenzy_popout-list__option').forEach((option) => {
        option.addEventListener('click', function(event) {
            event.preventDefault();

            var optionValue = option.getAttribute('data-value');
            var frenzySortHeadingDesktop = document.querySelector('.frenzy_sort-heading-desktop');

            // Update current option
            document.querySelector('.frenzy_popout-list__item--current').classList.remove('frenzy_popout-list__item--current');
            option.classList.add('frenzy_popout-list__item--current');

            // Update sort heading
            frenzySortHeadingDesktop.innerHTML = optionValue;

            // Sort products
            frenzyPageScroll = true;
            frenzyPageScrollNo = 0;
            isSeletedSortValue_Frenzy = optionValue;
            if (get_frenzy_search_page_section) {
                getSearchPAgeFilterChangeApi(filterArray_Frenzy, 0, true);
            }
            if (get_frenzy_collection_page_section) {
                getCollectionsPageFilterChangeApi(
                  filterArray_Frenzy,
                  0,
                  true
                );
            }
            selected_page_Frenzy = 1;
            document
              .querySelector("body")
              .classList.remove("is-open-filter");
        });
    });

    // Collection Nav Grid Layout Button Click Handler
    var frenzyLayoutTypeGrid = document.querySelector('.layout_type_grid');

    if (frenzyLayoutTypeGrid) {
        var frenzyCollectionNavLayouts = document.querySelectorAll('.frenzy_collection__nav__layout button');

        frenzyCollectionNavLayouts.forEach((item) => {
            item.addEventListener('click', function() {
                var gridNumber = item.getAttribute('data-toggle-grid');
                for (let item of frenzyCollectionNavLayouts) {
                    item.classList.remove('active');
                }
                item.classList.add('active');
                for (let i = frenzyLayoutTypeGrid.classList.length - 1; i >= 0; i--) {
                    const className = frenzyLayoutTypeGrid.classList[i];
                    if (className.startsWith('ltg_')) {
                        frenzyLayoutTypeGrid.classList.remove(className);
                        localStorage.removeItem('collectionNavLayout');
                    }
                }

                switch (gridNumber) {
                    case "1":
                        frenzyLayoutTypeGrid.classList.add('ltg_1');
                        localStorage.setItem('collectionNavLayout', 1);

                        break;
                    case "2":
                        frenzyLayoutTypeGrid.classList.add('ltg_2');
                        localStorage.setItem('collectionNavLayout', 2);

                        break;
                    case "3":
                        frenzyLayoutTypeGrid.classList.add('ltg_3');
                        localStorage.setItem('collectionNavLayout', 3);

                        break;
                    case "4":
                        frenzyLayoutTypeGrid.classList.add('ltg_4');
                        localStorage.setItem('collectionNavLayout', 4);

                        break;
                    case "5":
                        frenzyLayoutTypeGrid.classList.add('ltg_5');
                        localStorage.setItem('collectionNavLayout', 5);

                        break;
                    case "6":
                        frenzyLayoutTypeGrid.classList.add('ltg_6');
                        localStorage.setItem('collectionNavLayout', 6);

                        break;
                    default:
                        localStorage.removeItem('collectionNavLayout');

                        break;
                }
            });
        });
    }

    sideBarFilterScript(settingData);
    total_page_no_Frenzy = total_page;
    if (1 < total_page && frenzyPagination === "0") {
        init_Frenzy(total_page);
    }
    if (is_frenzy_page_css) {
        let cssdata =
          `@media (min-width: 768px) {.frenzy_container .frenzy_sidebar_panel_sticky {top: ${settingData.filter_sticky_top_position}; max-height: ${settingData.filter_sticky_max_height};}}` +
          ".frenzy_grid .frenzy_product_item figure{border-color: #" +
          settingCss.card_border_color +
          ";} " +
          ".frenzy_product_item .frenzy_product_item_detail, .frenzy_product_item .frenzy_product_item_detail h3.frenzy_product_title a{color:#" +
          settingCss.text_color +
          "} " +
          ".frenzy_product_item .frenzy_product_price_sale.is-sale{color:#" +
          settingCss?.sale_price_color +
          "} " +
          ".frenzy_product_item .frenzy_product_price_sale{color:#" +
          settingCss.price_color +
          "} " +
          ".frenzy_product_item .frenzy_product_price_compare{color:#" +
          settingCss.compare_price_color +
          "} " +
          ".frenzy_sidebar_panel .fwc_filters_search input.fwc_search_input,.frenzy_sidebar_panel .filter_price_contain .filter_price_box input{border-color:#" +
          settingCss.filter_input_border_color +
          "}" +
          ".frenzy_sidebar_panel .filter_price_contain .filter_price_box input,.frenzy_sidebar_panel .filter_price_contain .filter_price_box label,.frenzy_sidebar_panel .fwc_filters_search input.fwc_search_input{background-color:#" +
          settingCss.filter_bg_color +
          ";color:#" +
          settingCss.filter_text_color +
          "}" +
          ".frenzy_search_page .frenzy_sidebar_panel{background-color:#" +
          settingCss.filter_bg_color +
          ";border-color:#" +
          settingCss.filter_border_color +
          "}" +
          ".frenzy_sidebar_panel .filter_widget_section,.frenzy_sidebar_panel .filter_widget_section_contain{border-color:#" +
          settingCss.filter_border_color +
          "}" +
          ".frenzy_sidebar_panel .filter_widget_trigger{color:#" +
          settingCss.filter_subtitle_color +
          "}" +
          ".frenzy_sidebar_panel .filter_widget_trigger_icon svg{fill:#" +
          settingCss.filter_subtitle_color +
          "}" +
          ".frenzy_sidebar_panel .filter_checkbox .filter_checkbox_label, .frenzy_sidebar_panel .filter_checkbox .checkbox_count{color:#" +
          settingCss.filter_text_color +
          "}" +
          ".frenzy_topbar_contain .frenzy_topbar_count_col span,.frenzy_topbar_contain .frenzy_topbar_sorting_col .sorting_label{color:#" +
          settingCss.topbar_text_color +
          "}" +
          ".frenzy_topbar_contain .filter_clear_item, .frenzy_topbar_contain select.frenzy_sorting_btn{color:#" +
          settingCss.seleted_text_color +
          ";background-color:#" +
          settingCss.seleted_bg_color +
          "}" +
          ".frenzy_topbar_contain .filter_clear_item .filter_clear_icon svg{fill:#" +
          settingCss.seleted_text_color +
          "}" +
          ".frenzy_topbar_contain::before{background-color:" +
          settingCss.topbar_border_color +
          "}" +
          ".frenzy_flex_contain_area .frenzy_pagination_nav .pagination{background-color:#" +
          settingCss.pagination_bg_color +
          ";border-color:#" +
          settingCss.pagination_border_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain{border-color:#" +
          settingCss.pagination_border_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain a, .frenzy_pagination_nav .frenzy_pagination_contain i{color:#" +
          settingCss.pagination_text_color +
          "}" +
          ".frenzy_pagination_nav button.frenzy_pagination_btn svg{fill:#" +
          settingCss.pagination_text_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain a.current, .frenzy_pagination_nav button.frenzy_pagination_btn:hover{background-color:#" +
          settingCss.pagination_seleted_bg_color +
          ";color:#" +
          settingCss.pagination_seleted_text_color +
          "}" +
          ".frenzy_pagination_nav button.frenzy_pagination_btn:hover svg{fill:#" +
          settingCss.pagination_seleted_text_color +
          "}" +
          ".frenzy_sidebar_panel .frenzy_sidebar_header h3{color:#" +
          settingCss.filter_title_color +
          "}";
        if (settingData.image_border_show == "0") {
            cssdata += ".frenzy_product_item figure{border:none !important;}";
        }
        if (settingData.filter_layout === '0') {
            cssdata +=
              ".frenzy_topbar_filter .filter_widget_content{background-color:#" +
              settingCss.filter_bg_color +
              ";border-color:#" +
              settingCss.filter_border_color +
              "}" +
              ".frenzy_topbar_filter .filter_widget_trigger{border-color:#" +
              settingCss.filter_border_color +
              "}";
        } else {
            cssdata +=
              ".frenzy_search_page .frenzy_sidebar_panel{background-color:#" +
              settingCss.filter_bg_color +
              ";border-color:#" +
              settingCss.filter_border_color +
              "}" +
              ".frenzy_sidebar_panel .filter_widget_section,.frenzy_sidebar_panel .filter_widget_section_contain{border-color:#" +
              settingCss.filter_border_color +
              "}";
        }
        if (settingData.filter_clear_all == "0") {
            cssdata += "ul.filterSeletedList li.FSL_ClearItem{display:none}";
        }
        if (settingData.quickview == "0") {
            cssdata +=
              ".frenzy_product_item .frenzy_quickView_btn{display:none !important}";
        }
        if (settingData.tags == "0") {
            cssdata +=
              ".frenzy_product_item .frenzy_product_tags .custom_tag{display:none !important}";
        }
        if (settingData.range_price == "0") {
            cssdata +=
              ".filter_type_price-range{display:none !important;}";
        }
        if (settingData?.show_variant_option != "1") {
            cssdata +=
              ".frenzy_search_page .frenzy_product_item .frenzy_variant_option{display:none !important}";
        }
        if (settingData.show_add_to_cart_button == "0") {
            cssdata +=
              ".frenzy_search_page .frenzy_product_item .frenzy_add_to_cart_btn{display:none !important;}";
        }
        let head = document.head || document.getElementsByTagName("head")[0],
          style = document.createElement("style");
        head.appendChild(style);
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = cssdata;
        } else {
            style.appendChild(document.createTextNode(cssdata));
        }
        is_frenzy_page_css = false;
    }
    if (total_record <= 0) {
        document.querySelector(".ffc_sidebar_col").style.display = "none";
    }
    if (settingData.filter_layout === '0') {
        setTimeout(function () {
            if(document.querySelector(".frenzy_flex_topbar_filter_col")){
                var swiper = new Swiper(".frenzy_flex_topbar_filter_col", {
                    direction: "horizontal",
                    loop: false,
                    slidesPerView: "auto",
                    slideToClickedSlide: true,
                    touchStartPreventDefault: false,
                    allowTouchMove : false,
                    spaceBetween: 10,
                });
            }
        }, 500);
    }

    // Expanded Filter Show All Button Click Handler
    var frenzyFilterFooterShowAllButton = document.querySelector('.frenzy_filter_widget_footer_button_show_all');
    var frenzyFilterCloseButton = document.querySelector('.frenzy_filter_close');

    if (frenzyFilterFooterShowAllButton) {
        frenzyFilterFooterShowAllButton.addEventListener('click', function() {
            frenzyFilterCloseButton.click();
        });
    }

    // Expanded Filter Clear Button Click Handler
    var frenzyFilterFooterClearButtons = document.querySelectorAll('.frenzy_filter_widget_footer_button_clear');

    frenzyFilterFooterClearButtons.forEach(function(frenzyFilterFooterClearButton) {
        frenzyFilterFooterClearButton.addEventListener('click', function() {
            const scrollDemo = document.querySelector(".frenzy_search_page .frenzy_flex_row");
            const bodyOffset = document.body.getBoundingClientRect().top + 100;
            window.scrollTo({
              top: scrollDemo.getBoundingClientRect().top - bodyOffset,
              behavior: "smooth",
            });
            var frenzySelectedFilterClearButton = document.querySelector('.filter_clear_all_btn');

            if (frenzySelectedFilterClearButton) {
                frenzySelectedFilterClearButton.click();
            }
        });
    });

    // Filter Show More/Less Button Handler
    document.querySelectorAll('.frenzy_filter_item_show_more_button').forEach((button) => {
        const buttonTitle = button.getAttribute('data-title');

        button.addEventListener('click', function(event) {
            event.preventDefault();

            let filterWidgetSection = button.closest('.filter_widget_section');

            if (filterWidgetSection) {
                filterWidgetSection.classList.toggle('show_all');

                if (filterWidgetSection.classList.contains('show_all')) {
                    localStorage.setItem(buttonTitle, 'open');
                } else {
                    localStorage.removeItem(buttonTitle);
                }
            }
        });

        // Restore Filter Show More/Less Button Status
        if (localStorage.getItem(buttonTitle)) {
            button.click();

        }
    });

    // Close Expanded Filter when click outside
    window.addEventListener('click', ({ target }) => {
        if (!target.closest('.frenzy_filter_toggle') && !target.closest('.filter_is_click') && !target.closest('.ffc_sidebar_col') && !target.closest('.frenzy_collection__nav__filters__toggle')) {
            document
              .querySelector("body")
              .classList.remove("is-open-filter");
            document.querySelector(".frenzy_overlay_wrap")?.remove();
        }
    });

    if (search_query != "") {
        // Search Query Update
        window.addEventListener('click', ({ target }) => {
            // Corrected Query
            if (target.closest('.frenzy_search_title_query')) {
                let url = new URL(window.location.href);
                let search_params = new URLSearchParams(url.search);
                search_params.set('q', corrected_query);
                url.search = search_params.toString();

                const new_url = url.toString();
                window.location.href = new_url;
            }

            // Original Query
            if (target.closest('.frenzy_search_title_alt_query')) {
                let url = new URL(window.location.href);
                let search_params = new URLSearchParams(url.search);
                search_params.set('q', search_query);
                search_params.set('use_spell_check', 'false');
                url.search = search_params.toString();

                const new_url = url.toString();
                window.location.href = new_url;
            }
        });
    }

    if (frenzyPagination === "1" && total_page > 1) {
        frenzyAutoScroll();
    }
    if (frenzyPagination === "0") {
        frenzyPaginationScroll();
    }
    if (typeof frenzyQuickViewProductCallBack == "function") {
        frenzyQuickViewProductCallBack(productData);
    }
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
}
function sideBarFilter(
  key,
  data,
  filter_display_type,
  filter_swatch,
  selected,
  filter_label,
  settingData,
  topbarFilter,
  colorSwatches,
  languageText,
  defaultNumberOfFilterItems,
  filter_info_box
) {
    let filter_list = "";
    let frenzySwatchType = "";
    if (filter_swatch) {
        frenzySwatchType =
          filter_swatch == "round-swatches"
            ? "swatch-type-2 sw-round"
            : filter_swatch == "square-swatches"
            ? "swatch-type-2 sw-square "
            : filter_swatch == "text-swatch"
              ? "swatch-type-2 sw-list"
              : "swatch-type-1";
    }
    if (key === "price range" || key === "org_price") {
        filter_list += `<div class="frenzy-range-slider-input-area">
                          <div class="frenzy-range-min-box">
                            <label for="min-input-box">Min</label>
                            <input type="number" step="10" id="min-input-box" class="frenzy-range-slider-input-min-box" max="${frenzyAbsoluteMaxPriceRange}" min="${frenzyAbsoluteMinPriceRange}" value="${frenzyMinPriceRange}"/>
                          </div>
                          <div class="frenzy-range-max-box">
                            <label for="max-input-box">Max</label>
                            <input type="number" step="10" id="max-input-box" class="frenzy-range-slider-input-max-box" max="${frenzyAbsoluteMaxPriceRange}" min="${frenzyAbsoluteMinPriceRange}" value="${frenzyMaxPriceRange}"/>
                          </div>
                        </div>
                      <div class="frenzy-range-slide">
                        <div class="frenzy-slide">
                          <div class="frenzy-line" id="frenzy-line" style="left: 0%; right: 0%;"></div>
                          <span class="frenzy-thumb frenzy-thumbMin" id="frenzy-thumbMin" style="left: 0%;"></span>
                          <span class="frenzy-thumb frenzy-thumbMax" id="frenzy-thumbMax" style="left: 100%;"></span>
                        </div>
                        <input class="frenzy_range_min" id="frenzy-rangeMin" type="range" max="${frenzyAbsoluteMaxPriceRange}" min="${frenzyAbsoluteMinPriceRange}" step="10" value="${frenzyMinPriceRange}">
                        <input class="frenzy_range_max" id="frenzy-rangeMax" type="range" max="${frenzyAbsoluteMaxPriceRange}" min="${frenzyAbsoluteMinPriceRange}" step="10" value="${frenzyMaxPriceRange}">
                    </div>
                    <div class="frenzy-display">
                        <span>$</span><span class="frenzy-min" id="frenzy-min">${frenzyMinPriceRange}</span>
                          -
                        <span>$</span><span class="frenzy-max" id="frenzy-max">${frenzyMaxPriceRange}</span>
                    </div>`;
    } else if (key === "sortby" && settingData.sort == "2") {
        (languageText.sorting_value || []).map((sortVal) => {
            const sortingStatus =
              (sortVal && sortVal.status === true) ||
              (sortVal && sortVal.status === false)
                ? sortVal.status
                : true;
            if (sortingStatus) {
                filter_list += `<div class="fwc_filters_list" ${(isSeletedSortValue_Frenzy == sortVal.value ? 'style="order: -1"' : '')}>`;
                filter_list +=
                  '<label aria-label="'+sortVal.value+'" for="sort-' +
                  sortVal.value.replace(" ", "-") +
                  '" data-type="' +
                  key +
                  '" data-value="' +
                  sortVal.value +
                  '" class="filter_checkbox filter_radio">';
                filter_list +=
                  '<input id="sort-' +
                  sortVal.value.replace(" ", "-") +
                  '" name="' +
                  key +
                  '" class="filter_input_value frenzy_sort_val" type="checkbox" value="' +
                  sortVal.value +
                  '" ' +
                  (isSeletedSortValue_Frenzy == sortVal.value
                    ? "checked"
                    : "") +
                  ">";
                filter_list +=
                  '<span class="filter_checkbox_icon"></span><span class="filter_checkbox_label">' +
                  sortVal.name +
                  "</span>";
                filter_list += "</label>";
                filter_list += "</div>";
            }
        });
    } else {
        (data || []).map((x, i) => {
            let filter_checked_val = filterArray_Frenzy[key];
            let is_checked_val = "";
            if (filter_checked_val) {
                if (filter_checked_val.includes(x[0])) {
                    is_checked_val = "checked";
                }
            }
            filter_list += `<div class="fwc_filters_list" ${(is_checked_val == "checked" ? 'style="order: -1"' : '')}>`;
            if (key === "category") {
                filter_list +=
                  '<label aria-label="'+x[0].replace(/"/gi, '&quot;')+'" for="' +
                  key +
                  "-" +
                  x[0].replaceAll(" ", "-").replaceAll('"', '__') +
                  '" data-type="' +
                  key +
                  '" data-value="' +
                  x[0].replace(/"/gi, '&quot;') +
                  '" class="filter_radio filter_checkbox filter_is_click">';
                filter_list +=
                  '<input id="' +
                  key +
                  "-" +
                  x[0].replaceAll(" ", "-").replaceAll('"', '__') +
                  '" class="filter_input_value" type="checkbox" ' +
                  is_checked_val +
                  ' value="' +
                  x[0] +
                  '">';
            } else {
                filter_list +=
                  '<label aria-label="'+x[0].replace(/"/gi, '&quot;')+'" for="' +
                  key +
                  "-" +
                  x[0].replaceAll(" ", "-").replaceAll('"', '__') +
                  '" data-type="' +
                  key +
                  '" data-value="' +
                  x[0].replace(/"/gi, '&quot;') +
                  '" class="filter_checkbox filter_is_click">';
                filter_list +=
                  '<input id="' +
                  key +
                  "-" +
                  x[0].replaceAll(" ", "-").replaceAll('"', '__') +
                  '" class="filter_input_value" type="checkbox" ' +
                  is_checked_val +
                  ' value="' +
                  x[0] +
                  '">';
            }
            if (filter_swatch && filter_swatch != "text-list") {
                const swatch_color = colorSwatches[key+':'+x[0]] ? colorSwatches[key+':'+x[0]].color_code : colorSwatches[x[0]]?.color_code;
                const swatch_image = colorSwatches[key+':'+x[0]] ? colorSwatches[key+':'+x[0]].color_img : colorSwatches[x[0]]?.color_img;
                if (swatch_image) {
                    filter_list +=
                      '<span class="filter_checkbox_icon swatchOption" style="background-image:url(' +
                      swatch_image +
                      ')"></span>';
                } else if (swatch_color) {
                    filter_list +=
                      '<span class="filter_checkbox_icon swatchOption" style="background-color:' +
                      swatch_color +
                      '"></span>';
                } else {
                    filter_list +=
                      '<span class="filter_checkbox_icon swatchOption"></span>';
                }
                filter_list +=
                  '<span class="filter_checkbox_label">' + x[0] + "</span>";
                if (settingData.counts == "1") {
                    filter_list +=
                      '<span class="checkbox_count">' + x[1] + "</span>";
                }
                filter_list += '<span class="checkbox_border"></span>';
            } else {
                filter_list +=
                  `<span class="filter_checkbox_icon">
                        <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-box" viewBox="0 0 20 20"><g fill="none" fill-rule="evenodd"><path class="checkbox-border" stroke="#3333" d="M.5.5h19v19H.5z"></path><path class="checkbox-core" fill="#3333" d="M5 5h10v10H5z"></path></g></svg>
                        <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-reset" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M20 10a9.73 9.73 0 01-.794 3.88 10.088 10.088 0 01-2.136 3.19 10.089 10.089 0 01-3.19 2.136A9.73 9.73 0 0110 20a9.93 9.93 0 01-4.258-.944 9.776 9.776 0 01-3.437-2.663.465.465 0 01-.085-.293.384.384 0 01.11-.267l1.785-1.797a.468.468 0 01.325-.117c.139.018.239.07.3.157a6.535 6.535 0 002.33 1.914c.92.451 1.897.677 2.93.677a6.49 6.49 0 002.585-.528 6.717 6.717 0 002.129-1.425 6.717 6.717 0 001.425-2.13c.352-.82.528-1.681.528-2.584s-.176-1.764-.528-2.585a6.717 6.717 0 00-1.425-2.129 6.717 6.717 0 00-2.13-1.425A6.494 6.494 0 0010 3.333c-.85 0-1.667.154-2.448.463A6.469 6.469 0 005.47 5.117l1.784 1.797c.269.26.33.56.182.899-.148.347-.404.52-.768.52H.833a.8.8 0 01-.586-.247A.8.8 0 010 7.5V1.667c0-.365.174-.621.52-.769.34-.147.639-.086.9.183l1.692 1.68A10.107 10.107 0 016.296.722 9.809 9.809 0 0110 0a9.73 9.73 0 013.88.794 10.088 10.088 0 013.19 2.136 10.088 10.088 0 012.136 3.19A9.73 9.73 0 0120 10z"></path></svg>
                    </span><span class="filter_checkbox_label">` +
                  x[0] +
                  "</span>";
                if (settingData.counts == "1") {
                    filter_list +=
                      '<span class="checkbox_count">' + x[1] + "</span>";
                }
            }
            filter_list += "</label>";
            filter_list += "</div>";
        });
    }

    const filterSwiperSlideCls = topbarFilter ? "swiper-slide" : "";
    const filterTriggerType = topbarFilter ? "topbar" : "sidebar";
    let frenzy_filter_option = "1";
    // if (screen.width > 991) {
    frenzy_filter_option = settingData.filter_option;
    // }
    let selected_class = "";
    let selected_acc_style = "";
    if (topbarFilter != true && frenzy_filter_option === "1") {
        selected_class = "is-open";
        selected_acc_style = "initial";
    }
    if (this_click_event == "topbar") {
        if (topbarFilter && selected === 1) {
            selected_class = "is-open";
            selected_acc_style = "initial";
        }
        if (topbarFilter != true && frenzy_filter_option === "1") {
            selected_class = "is-open";
            selected_acc_style = "initial";
        }
    }
    if (this_click_event == "sidebar") {
        if (
          (topbarFilter != true && selected === 1) ||
          frenzy_filter_option === "1"
        ) {
            selected_class = "is-open";
            selected_acc_style = "initial";
        }
        if (topbarFilter) {
            selected_class = "";
            selected_acc_style = "";
        }
    }
    let sideBarGridItem = "";
    let filter_info_icon_html = '';
    if(filter_info_box != '' && filter_info_box != null){
        filter_info_icon_html += '<span data-tooltip="'+filter_info_box+'">' + filter_info_icon + '</span>';
    }
    sideBarGridItem +=
      '<div class="filter_widget_section ' +
      filterSwiperSlideCls +
      " filter_type_" +
      key.replaceAll(" ", "-").replaceAll('"', '__') +
      '">';
    sideBarGridItem +=
      '<button class="filter_widget_trigger ' +
      selected_class +
      '" aria-label="Filter by: '+filter_label+' Expand/Collapse button" data-triggerType="' +
      filterTriggerType +
      '" data-key="' +
      key +
      '">' +
      '<span class="filter_trigger_text_icon">' +
      filter_label +
      filter_info_icon_html +
      '</span><span class="filter_widget_trigger_icon"><svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 9 15"><path fill-rule="evenodd" d="M6.875 7.066L.87 1.06 1.93 0l6.006 6.005L7.94 6 9 7.06l-.004.006.005.005-1.06 1.06-.006-.004-6.005 6.005-1.061-1.06 6.005-6.006z"></path></svg></span></button>';
    sideBarGridItem +=
      '<div class="filter_widget_content" style="max-height:' +
      selected_acc_style +
      '">';

    let filter_show_more_button = '';
    let isShowMoreButtonEligible = false;

    if (filter_display_type != "box") {
        if (settingData.filter_show_more_button !== "0") {
            if (key === "sortby" && settingData.sort == "2") {
                if (languageText.sorting_value.length > defaultNumberOfFilterItems) {
                    isShowMoreButtonEligible = true;
                }
            } else if (data.length > defaultNumberOfFilterItems) {
                isShowMoreButtonEligible = true;
            }
        }
    }

    if (isShowMoreButtonEligible) {
        if (
          key != "color" ||
          (key == "color" &&
            (filter_swatch == "text-list" || filter_swatch == "text-swatch"))
        ) {
            sideBarGridItem +=
              '<div class="fwc_filters_search"><input type="text" class="fwc_search_input" placeholder="Search" data-type="frenzy_' +
              key.replaceAll(" ", "-").replaceAll('"', '__') +
              '_input" /><svg width="14" height="15" class="fwc_filters_search_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15"><path d="M4.896 9.262c.612 0 1.176-.153 1.692-.459A3.396 3.396 0 0 0 7.812 7.57c.3-.516.45-1.08.45-1.692 0-.612-.15-1.176-.45-1.692a3.327 3.327 0 0 0-1.224-1.224c-.516-.3-1.08-.45-1.692-.45-.612 0-1.176.15-1.692.45-.516.3-.927.708-1.233 1.224a3.257 3.257 0 0 0-.459 1.692c0 .612.153 1.176.459 1.692.306.516.717.927 1.233 1.233.516.306 1.08.459 1.692.459zm4.5 0l3.726 3.726-1.134 1.134-3.726-3.744v-.594l-.216-.198c-.42.372-.903.657-1.449.855a4.951 4.951 0 0 1-1.701.297 4.837 4.837 0 0 1-2.457-.648A4.806 4.806 0 0 1 .666 8.344 4.784 4.784 0 0 1 0 5.878c0-.888.219-1.707.657-2.457a4.812 4.812 0 0 1 1.782-1.773A4.837 4.837 0 0 1 4.896 1c.888 0 1.71.222 2.466.666A4.757 4.757 0 0 1 9.099 3.43a4.84 4.84 0 0 1 .639 2.448c0 .6-.099 1.173-.297 1.719a4.451 4.451 0 0 1-.855 1.449l.198.216h.612z" fill="currentColor" fill-rule="evenodd"></path></svg></div>';
        }
    }

    if (isShowMoreButtonEligible) {
        filter_show_more_button += `
            <button class="frenzy_filter_item_show_more_button" data-title="${filter_label}">
                <span class="frenzy_filter_item_show_more_text">+ MORE</span>
                <span class="frenzy_filter_item_show_less_text">- LESS</span>
            </button>
        `;
    }

    sideBarGridItem +=
      '<div class="fwc_filters_block frenzy_' +
      key.replaceAll(" ", "-").replaceAll('"', '__') +
      "_input " +
      frenzySwatchType +
      ` filter_display_type_${filter_display_type} ` +
      ` filter_swatch_${filter_display_type} ` +
      ' ">' +
      filter_list +
      "</div>";
    sideBarGridItem += filter_show_more_button;
    sideBarGridItem += "</div>";
    sideBarGridItem += "</div>";
    return sideBarGridItem;
}
function sideBarFilterScript(settingData) {
    // Filter Accordion
    const accordionBtns = document.querySelectorAll(".filter_widget_trigger");
    accordionBtns.forEach((accordion) => {
        accordion.onclick = function (e) {
            if(e.target == accordion.querySelector('svg')){
                if(document.querySelectorAll('.filter_trigger_text_icon span').length > 0){
                    document.querySelectorAll('.filter_trigger_text_icon span').forEach(function(this_loop){
                        this_loop.classList.remove('active');
                    });
                }
                if(e.target.closest('.filter_trigger_text_icon')){
                    e.target.closest('.filter_trigger_text_icon').querySelector('span').classList.toggle("active");
                }
            }
            if(e.target != accordion.querySelector('svg')){
                if(document.querySelector('.filter_trigger_text_icon')){
                    if(document.querySelector('.filter_trigger_text_icon').querySelector('span')){
                        if(document.querySelector('.filter_trigger_text_icon').querySelector('span').classList.contains('active')){
                            document.querySelector('.filter_trigger_text_icon').querySelector('span').classList.remove('active');
                        }
                    }
                }
                const closestFrenzyFilterContainerElement = this.closest('.frenzy_filter_container_element');

                if (this.closest(".ffc_sidebar_col")) {
                    this_click_event = "sidebar";

                    if (this.closest(".frenzy_container.frenzy_filter_sidebar_dropdown_arrow_show_0")) {
                        return;
                    }
                } else {
                    this_click_event = "topbar";
                }
                let selectedKey = this.getAttribute("data-key");
                const selectedTriggerType = this.getAttribute("data-triggertype");
                if (settingData.filter != "0") {
                    if (settingData.filter_layout === '0') {
                        if (selectedTriggerType === "topbar") {
                            filter_order_Frenzy = (filter_order_Frenzy || []).map(
                              (x) => {
                                  x.selected = 0;
                                  return x;
                              }
                            );
                            const frenzy_open_trigger = closestFrenzyFilterContainerElement?.querySelector(
                              ".filter_widget_trigger.is-open"
                            );
                            if (frenzy_open_trigger != null) {
                                const frenzy_open_key =
                                  frenzy_open_trigger.getAttribute("data-key");
                                if (frenzy_open_key != selectedKey) {
                                    frenzy_open_trigger?.classList?.remove(
                                      "is-open"
                                    );
                                    frenzy_open_trigger.nextElementSibling.style.maxHeight =
                                      null;
                                }
                            }
                        }
                    }
                    if(old_selected_key != selectedKey){
                        let findIndex = filter_order_Frenzy.findIndex(
                          (x) => x.key === selectedKey
                        );
                        filter_order_Frenzy[findIndex] = {
                            ...filter_order_Frenzy[findIndex],
                            selected:
                              filter_order_Frenzy[findIndex].selected === 1 ? 0 : 1,
                        };
                    }
                    old_selected_key = selectedKey;
                }
                let content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    this.classList.remove("is-open");
                } else {
                    this.classList.add("is-open");
                    content.style.maxHeight = content.scrollHeight + "px";
                }
                if(document.querySelector('.frenzy_popout-list') && document.querySelector('.frenzy_popout-list').classList.contains("frenzy_popout-list--visible")){
                    document.querySelector('.frenzy_popout-list').classList.remove('frenzy_popout-list--visible');
                }
            }
        };
        accordion.onmouseover = function(e){
            if(document.querySelectorAll('.filter_trigger_text_icon span').length > 0){
                document.querySelectorAll('.filter_trigger_text_icon span').forEach(function(this_loop){
                    this_loop.classList.remove('active');
                });
            }
        };
    });
    window.onclick = (event) => {
        if (
          !event.target.matches(".frenzy_flex_topbar_contain .filter_widget_trigger") &&
          !event.target.closest(".frenzy_flex_topbar_contain .filter_widget_trigger_icon") &&
          !event.target.closest(".frenzy_flex_topbar_contain .filter_trigger_text_icon") &&
          !event.target.closest(".frenzy_flex_topbar_contain .filter_widget_content")
        ) {
            const accordionBtns = document.querySelectorAll(
              ".frenzy_flex_topbar_contain .filter_widget_trigger"
            );
            accordionBtns.forEach((accordion) => {
                let content = accordion.nextElementSibling;
                if (content.style.maxHeight) {
                    filter_order_Frenzy = (filter_order_Frenzy || []).map(
                      (x) => {
                          x.selected = 0;
                          return x;
                      }
                    );
                    content.style.maxHeight = null;
                    accordion.classList.remove("is-open");
                }
            });
        }
        // sort hide
        if(!event.target.closest('.frenzy_popout__toggle') && !event.target.closest(".frenzy_popout-list")){
            const sortElement = document.querySelectorAll(
              ".frenzy_popout-list"
            );
            sortElement.forEach((accordion) => {
                accordion.classList.remove("frenzy_popout-list--visible");
            });
        }
    };

    // Build Price Range Filter
    const updatePriceRange = (price_range_min_value, price_range_max_value) => {
        const minVal = price_range_min_value;
        const maxVal = price_range_max_value;

        if ((minVal != frenzyMinPriceRange || maxVal != frenzyMaxPriceRange) || isFrenzyFilterPriceRangeInitialize) {
            frenzyPageScroll = true;
            frenzyPageScrollNo = 0;
            frenzyMinPriceRange = price_range_min_value;
            frenzyMaxPriceRange = price_range_max_value;
            const filter_price = {
                min: minVal,
                max: maxVal,
            };

            filterArray_Frenzy.org_price = filter_price;

            if (get_frenzy_search_page_section) {
                getSearchPAgeFilterChangeApi(
                  filterArray_Frenzy,
                  0,
                  true
                );
            }
            if (get_frenzy_collection_page_section) {
                getCollectionsPageFilterChangeApi(
                  filterArray_Frenzy,
                  0,
                  true
                );
            }
            selected_page_Frenzy = 1;
        }
    }

    let min = frenzyAbsoluteMinPriceRange;
    let max = frenzyAbsoluteMaxPriceRange;
    let fix_range_min = frenzyAbsoluteMinPriceRange;
    let fix_range_max = frenzyAbsoluteMaxPriceRange;
    const calcLeftPosition = value => 100 / (fix_range_max - fix_range_min) * (value - fix_range_min);

    let current_inputMinBox = '';
    let current_inputMaxBox = '';

    document.querySelectorAll('.frenzy-range-slider-input-min-box').forEach(function(this_loop){
        this_loop.addEventListener('input', frenzy_debounce(() => {
            document.querySelectorAll('.frenzy_range_min').forEach(function(range_loop){
                range_loop.value = this_loop.value;
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                range_loop.dispatchEvent(event);
                const events = new Event('mouseup', {
                    bubbles: true,
                    cancelable: true,
                });
                range_loop.dispatchEvent(events);
                const touchend_events = new Event('touchend', {
                    bubbles: true,
                    cancelable: true,
                });
                range_loop.dispatchEvent(touchend_events);
            });
        }, 1000));
    });
    document.querySelectorAll('.frenzy-range-slider-input-max-box').forEach(function(this_loop){
        this_loop.addEventListener('input', frenzy_debounce(() => {
            document.querySelectorAll('.frenzy_range_max').forEach(function(range_loop){
                range_loop.value = this_loop.value;
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                range_loop.dispatchEvent(event);
                const events = new Event('mouseup', {
                    bubbles: true,
                    cancelable: true,
                });
                range_loop.dispatchEvent(events);
                const touchend_events = new Event('touchend', {
                    bubbles: true,
                    cancelable: true,
                });
                range_loop.dispatchEvent(touchend_events);
            });
        }, 1000));
    });

    document.querySelectorAll('.frenzy_range_min').forEach(function(this_loop){
        current_inputMinBox = this_loop.value;
        this_loop.addEventListener('input', function(e) {
            const newValue = parseInt(e.target.value);
            if (newValue > max) return;
            min = newValue;
            document.querySelectorAll('.frenzy-thumbMin').forEach(function(this_thumb){
                this_thumb.style.left = calcLeftPosition(newValue) + '%';
            });
            document.querySelectorAll('.frenzy-min').forEach(function(this_min){
                this_min.innerHTML = newValue;
            });
            document.querySelectorAll('.frenzy-range-slider-input-min-box').forEach(function(this_min){
                this_min.value = newValue;
            });
            document.querySelectorAll('.frenzy-line').forEach(function(this_line){
                this_line.style.left = calcLeftPosition(newValue) + '%';
                this_line.style.right = (100 - calcLeftPosition(max)) + '%';
            });

            // updatePriceRange(min, max);
        });
        this_loop.addEventListener('mouseup', (event) => {
            event.preventDefault();
            updatePriceRange(min, max);
        });
        this_loop.addEventListener('touchend', (event) => {
            event.preventDefault();
            updatePriceRange(min, max);
        });
    });
    document.querySelectorAll('.frenzy_range_max').forEach(function(this_loop){
        current_inputMaxBox = this_loop.value;
        this_loop.addEventListener('input', function(e) {
            const newValue = parseInt(e.target.value);
            if (newValue < min) return;
            max = newValue;
            document.querySelectorAll('.frenzy-thumbMax').forEach(function(this_thumb){
                this_thumb.style.left = calcLeftPosition(newValue) + '%';
            });
            document.querySelectorAll('.frenzy-max').forEach(function(this_max){
                this_max.innerHTML = newValue;
            });
            document.querySelectorAll('.frenzy-range-slider-input-max-box').forEach(function(this_max){
                this_max.value = newValue;
            });
            document.querySelectorAll('.frenzy-line').forEach(function(this_line){
                this_line.style.left = calcLeftPosition(min) + '%';
                this_line.style.right = (100 - calcLeftPosition(newValue)) + '%';
            });
            // updatePriceRange(min, max);
        });
        this_loop.addEventListener('mouseup', (event) => {
            event.preventDefault();
            updatePriceRange(min, max);
        });
        this_loop.addEventListener('touchend', (event) => {
            event.preventDefault();
            updatePriceRange(min, max);
        });
    });
    min_range_col();
    max_range_col();
    function min_range_col(){
        if(current_inputMinBox > max) return;
        min = current_inputMinBox;
        document.querySelectorAll('.frenzy-thumbMin').forEach(function(this_thumb){
            this_thumb.style.left = calcLeftPosition(current_inputMinBox) + '%';
        });
        document.querySelectorAll('.frenzy-min').forEach(function(this_min){
            this_min.innerHTML = current_inputMinBox;
        });
        document.querySelectorAll('.frenzy-line').forEach(function(this_line){
            this_line.style.left = calcLeftPosition(current_inputMinBox) + '%';
            this_line.style.right = (100 - calcLeftPosition(max)) + '%';
        });
    }
    function max_range_col(){
        if (current_inputMaxBox < min) return;
        max = current_inputMaxBox;
        document.querySelectorAll('.frenzy-thumbMax').forEach(function(this_thumb){
            this_thumb.style.left = calcLeftPosition(current_inputMaxBox) + '%';
        });
        document.querySelectorAll('.frenzy-max').forEach(function(this_max){
            this_max.innerHTML = current_inputMaxBox;
        });
        document.querySelectorAll('.frenzy-line').forEach(function(this_line){
            this_line.style.left = calcLeftPosition(min) + '%';
            this_line.style.right = (100 - calcLeftPosition(current_inputMaxBox)) + '%';
        });
    }

    // Filter click
    document
      .querySelectorAll(".filter_is_click")
      .forEach(function (this_click) {
          this_click.addEventListener("change", function (event) {
              frenzyPageScroll = true;
              frenzyPageScrollNo = 0;
              collectionSearchQueryVal = false;
              let filter_type = this_click.getAttribute("data-type");
              let filter_value = this_click.getAttribute("data-value");
              if (filterArray_Frenzy[filter_type]) {
                  let index = filterArray_Frenzy[filter_type].findIndex(
                    (x) => x === filter_value
                  );
                  if (filter_type == "category" && index === -1) {
                      filterArray_Frenzy[filter_type] = [filter_value];
                  } else if (index === -1) {
                      filterArray_Frenzy[filter_type].push(filter_value);
                  } else {
                      filterArray_Frenzy[filter_type].splice(index, 1);
                      if (filterArray_Frenzy[filter_type].length == 0) {
                          delete filterArray_Frenzy[filter_type];
                      }
                  }
              } else {
                  filterArray_Frenzy[filter_type] = [filter_value];
              }
              setTimeout(function () {
                  if (get_frenzy_search_page_section) {
                      getSearchPAgeFilterChangeApi(
                        filterArray_Frenzy,
                        0,
                        true
                      );
                  }
                  if (get_frenzy_collection_page_section) {
                      getCollectionsPageFilterChangeApi(
                        filterArray_Frenzy,
                        0,
                        true
                      );
                  }
              }, 500);
              selected_page_Frenzy = 1;
          });
      });

    // Single Row Filter Toggle
    document
      .querySelectorAll("button.frenzy_filter_toggle")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              document.querySelector("body").classList.add("is-open-filter");
              document
                .querySelector(".frenzy_flex_row")
                .insertAdjacentHTML(
                  "beforeend",
                  '<div class="frenzy_overlay_wrap"></div>'
                );
              document.querySelector('.frenzy_filter_close')? document.querySelector('.frenzy_filter_close').focus():'';
              frenzyFilterClose();
          });
      });

    // Filter sort
    document
      .querySelectorAll(".frenzy_sorting_btn, .frenzy_sort_val")
      .forEach(function (this_click) {
          this_click.addEventListener("change", function (event) {
              frenzyPageScroll = true;
              frenzyPageScrollNo = 0;
              collectionSearchQueryVal = false;
              isSeletedSortValue_Frenzy = event.target.value;
              if (get_frenzy_search_page_section) {
                  getSearchPAgeFilterChangeApi(filterArray_Frenzy, 0, true);
              }
              if (get_frenzy_collection_page_section) {
                  getCollectionsPageFilterChangeApi(
                    filterArray_Frenzy,
                    0,
                    true
                  );
              }
              selected_page_Frenzy = 1;
              document
                .querySelector("body")
                .classList.remove("is-open-filter");
          });
      });

    // Filter Clear price
    document
      .querySelectorAll(".filter_price_clear_btn")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              frenzyPageScroll = true;
              frenzyPageScrollNo = 0;
              collectionSearchQueryVal = false;
              frenzyMinPriceRange = FRENZY_MIN_PRICE,
                frenzyMaxPriceRange = FRENZY_MAX_PRICE;
              isFrenzyFilterPriceUpdated = true;
              isFrenzyFilterPriceRangeInitialize = true;

              delete filterArray_Frenzy.org_price;

              if (get_frenzy_search_page_section) {
                  getSearchPAgeFilterChangeApi(filterArray_Frenzy, 0, true);
              }
              if (get_frenzy_collection_page_section) {
                  getCollectionsPageFilterChangeApi(
                    filterArray_Frenzy,
                    0,
                    true
                  );
              }
              selected_page_Frenzy = 1;
              document
                .querySelector("body")
                .classList.remove("is-open-filter");
          });
      });

    // Filter clear all
    document
      .querySelectorAll(".filter_clear_all_btn")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              isSelectedFilterClickEvent = true;
              frenzyPageScroll = true;
              frenzyPageScrollNo = 0;
              collectionSearchQueryVal = false;
              frenzyMinPriceRange = FRENZY_MIN_PRICE,
                frenzyMaxPriceRange = FRENZY_MAX_PRICE;
              isFrenzyFilterPriceUpdated = true;
              isFrenzyFilterPriceRangeInitialize = true;

              document
                .querySelector("body")
                .classList.remove("is-open-filter");


              const newfilterArray = {};
              let collection_handle = '';
              if(get_frenzy_collection_page_section){
                  collection_handle = get_frenzy_collection_page_section.getAttribute('data-handle');
              }
              let queryParam = '';
              if(collection_handle == 'types' || collection_handle == 'vendors'){
                  search_query = new URL(window.location.href).searchParams.get("q");
                  queryParam = '?q='+search_query;
                  filterArray_Frenzy = {};
              }else{
                  filterArray_Frenzy = {};
                  search_query = "";
                  queryParam = "";
              }
              if (get_frenzy_search_page_section) {
                  getSearchPAgeFilterChangeApi(newfilterArray, 0, true);
              }
              if (get_frenzy_collection_page_section) {
                  isSeletedSortValue_Frenzy = "best match";
                  window.history.pushState(
                    {},
                    "",
                    shopURL_Frenzy + searchURL_Frenzy + queryParam
                  );
                  getCollectionsPageApi();
              }
              selected_page_Frenzy = 1;
              if (typeof frenzyFilterClickCallBack == "function") {
                  frenzyFilterClickCallBack();
              }else{
                  document.querySelector("body").scrollIntoView({ behavior: "smooth" });
              }
              if(__st && __st.p == "searchresults"){
                const scrollDemo = document.querySelector(".frenzy_search_page .frenzy_flex_row");
                const bodyOffset = document.body.getBoundingClientRect().top + 100;
                if(!collectionSearchQueryVal){
                  window.scrollTo({
                    top: scrollDemo.getBoundingClientRect().top - bodyOffset,
                    behavior: "smooth",
                  });
                }
              }
              if(__st && __st.p == "collection"){
                const scrollDemo = document.querySelector(".frenzy_collections_page .frenzy_flex_row");
                const bodyOffset = document.body.getBoundingClientRect().top + 100;
                if(!collectionSearchQueryVal){
                  window.scrollTo({
                    top: scrollDemo.getBoundingClientRect().top - bodyOffset,
                    behavior: "smooth",
                  });
                }
              }
            });
      });

    // Filter Search
    document
      .querySelectorAll(".fwc_search_input")
      .forEach(function (this_click) {
          this_click.addEventListener("keyup", function (event) {
              const et_val = event.target.value.toUpperCase();
              const filter_type = this_click.getAttribute("data-type");
              document
                .querySelectorAll(
                  "." + filter_type + " .filter_checkbox_label"
                )
                .forEach(function (e) {
                    if (e.textContent.toUpperCase().indexOf(et_val) > -1) {
                        e.parentElement.parentElement.style.display = "";
                    } else {
                        e.parentElement.parentElement.style.display =
                          "none";
                    }
                });
          });
      });
}
/* Filter Grid Close */
function frenzyFilterClose() {
    document
      .querySelectorAll(".frenzy_overlay_wrap,button.frenzy_filter_close")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              document
                .querySelector("body")
                .classList.remove("is-open-filter");
              document.querySelector(".frenzy_overlay_wrap")?.remove();
          });
      });
}
/* Range Slider col */
function frenzyCalRangeSlider(this_click, event_name) {
    const [min, max] = [parseInt(this_click.min), parseInt(this_click.max)];
    if (event_name === "min") {
        this_click.value = Math.min(
          parseInt(this_click.value),
          parseInt(this_click.value)
        );
        const percent = ((this_click.value - min) / (max - min)) * 100;
        frenzy_thumbLeft.forEach(function (this_click) {
            this_click.style.left = percent + "%";
        });
        frenzy_range.forEach(function (this_click) {
            this_click.style.left = percent + "%";
        });
    } else {
        this_click.value = Math.max(
          parseInt(this_click.value),
          parseInt(this_click.value)
        );
        const percent = ((this_click.value - min) / (max - min)) * 100;
        frenzy_thumbRight.forEach(function (this_click) {
            this_click.style.right = 100 - percent + "%";
        });
        frenzy_range.forEach(function (this_click) {
            this_click.style.right = 100 - percent + "%";
        });
    }
}
/* Search Page Carousel  */
const getSearchCarouselApi = async () => {
    frenzy_recommendation_section_config = null;
    const get_frenzy_SearchCarousel_section = document.querySelector(
      ".frenzySearchCarousel"
    );
    if (get_frenzy_SearchCarousel_section) {
        frenzy_recommendation_section_config =
          get_frenzy_SearchCarousel_section.getAttribute("config_id");
    }
    var data_json = JSON.stringify({
        shop: frenzyShop,
        full_description: true,
        user_id: user_id_Frenzy.toString(),
        config_id: frenzy_recommendation_section_config,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    });
    const response = await fetch(authUrl_Frenzy + "/search-carousel", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    if (data.status === 200) {
        dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
        const dataResults = data.data.matching_products;
        const dataSetting = data.data.settings ? data.data.settings : data.data.search_carousel_settings;
        const dataCss = data.data.css ? data.data.css : data.data.search_carousel_settings_css;
        const dataGridHtml = data.data.recommendation_html;
        const frenzy_request_id = data.data.request_id;
        const frenzy_product_click = "search_carousel";
        const globalSetting = data?.data?.global_setting;
        const all_product_data = data.data;
        FrenzyProductImgResize(globalSetting);
        frenzySearchPageCarousel(
          dataResults,
          dataSetting,
          dataCss,
          dataGridHtml,
          frenzy_request_id,
          frenzy_product_click,
          "frenzySearchCarousel",
          dataConfig,
          all_product_data
        );
    }
};
function frenzySearchPageCarousel(
  dataResults,
  dataSetting,
  dataCss,
  dataGridHtml,
  frenzy_request_id,
  frenzy_product_click,
  sectionClass,
  dataConfig,
  sectionIndex,
  all_product_data
) {
    let product_grid_html = dataGridHtml;
    const frenzy_layout_mode = dataSetting.layout_type;
    const frenzySectionClass = sectionClass;
    const apply_link_to_main_title = dataSetting?.apply_link_to_main_title;
    const view_all_button_position = dataSetting?.view_all_button_position;
    const slider_short_description = dataSetting?.short_description;
    if (dataResults.length === 0) {
        frenzySectionClass.style.display = "none";
    } else {
        frenzySectionClass.style.display = "block";
    }
    let title_align = 'text_align-center';
    if(view_all_button_position == '2' || view_all_button_position == '3'){
        title_align =
          dataSetting.title_align === "1"
            ? "text_align-left"
            : dataSetting.title_align === "2"
            ? "text_align-right"
            : "text_align-center";
    }
    let view_all_html = '';
    if(dataSetting?.view_all_button_text && dataSetting?.view_all_button_text != '' && dataSetting?.view_all_button_link && dataSetting?.view_all_button_link != ''){
        view_all_html += '<a class="frenzy_view_all_btn '+title_align+'" href="'+Shopify.routes.root+dataSetting?.view_all_button_link+'">'+dataSetting?.view_all_button_text+'</a>';
    }
    const shop_currency = frenzySectionClass.getAttribute("data-currency");
    check_shop_currency_frenzy(shop_currency || "");
    let homeCarouselProductHTML = "";
    (dataResults || []).map((x, i) => {
        homeCarouselProductHTML += getProductGridItem(
          product_grid_html,
          x,
          dataSetting,
          frenzy_shop_currency,
          frenzy_request_id,
          frenzy_product_click,
          dataConfig
        );
    });
    let homeCarouselHtml = '<div class="frenzy_container">';
    let className = 'frenzy_recommendation_wraper';
    if (sectionClass == 'frenzy_cart_popup_section') {
        className += ' frenzy_vertical_grid';
    }
    const view_block_class= view_all_button_position == "1" ? 'next_to_title' : '' || view_all_button_position == "2" ? 'below_the_title' : '';
    homeCarouselHtml += '<div class="frenzy_recommendation_topbar view_all-'+view_block_class+' '+title_align+'">';
        if(apply_link_to_main_title && dataSetting?.view_all_button_link != ''){
            homeCarouselHtml += '<a href="'+Shopify.routes.root+dataSetting?.view_all_button_link+'">';
        }
        homeCarouselHtml += '<h2 class="frenzy_recommendation_title ' + title_align + '">';
        if (dataSetting.grid_title != undefined) {
            homeCarouselHtml += dataSetting.grid_title;
        }
        homeCarouselHtml += "</h2>";
        if(apply_link_to_main_title && dataSetting?.view_all_button_link != ''){
            homeCarouselHtml += '</a>';
        }
    if(slider_short_description != '' && slider_short_description != undefined && (view_all_button_position == "2" || view_all_button_position == "3")){
        homeCarouselHtml += '<div class="short_desc '+title_align+'">'+slider_short_description+'</div>';
    }
    if(view_all_button_position == "1" || view_all_button_position == "2"){
        homeCarouselHtml += view_all_html;
    }
    if(slider_short_description != '' && slider_short_description != undefined && view_all_button_position == "1"){
        homeCarouselHtml += '<div class="short_desc '+title_align+'">'+slider_short_description+'</div>';
    }
    homeCarouselHtml += '</div>';
    homeCarouselHtml +=
      '<div class="'+ className +'"><div class="frenzy_recommendation_contain">';
    homeCarouselHtml +=
      '<div class="recommendation_product_items frenzy_product_row">' +
      homeCarouselProductHTML +
      "</div>";
    homeCarouselHtml += "</div></div>";
    if(view_all_button_position == "3"){
        homeCarouselHtml += '<div class="view_all_below_the_carousel">'+view_all_html+'</div>';
    }
    homeCarouselHtml += "</div>";

    frenzySectionClass.innerHTML = homeCarouselHtml;
    const swiperContainerClass = frenzy_product_click+'-'+sectionIndex;
    if (frenzy_layout_mode === "2") {
        const frenzy_infinite_loop =
          dataSetting?.infinite_loop === "1" ? true : false;
        document
          .querySelector("." + swiperContainerClass + " .frenzy_recommendation_title")
          .classList.add("frenzy_slider_title");
        document
          .querySelector(
            "." + swiperContainerClass + " .frenzy_recommendation_wraper"
          )
          .classList.add("frenzy_slider");
        document
          .querySelector(
            "." + swiperContainerClass + " .recommendation_product_items"
          )
          .classList.add(
          "swiper-wrapper",
          "ltg_" + dataSetting.grid_items_per_row + ""
        );
        document
          .querySelectorAll(
            "." + swiperContainerClass + " .frenzy_recommendation_wraper"
          )[0]
          .insertAdjacentHTML(
            "beforeend",
            '<button class="swiper-button-prev"></button><button class="swiper-button-next"></button><div class="swiper-scrollbar"></div>'
          );
        setTimeout(function () {
            if (typeof frenzySwiperSliderCallBack == "function") {
                var swiper = frenzySwiperSliderCallBack("." + swiperContainerClass ,frenzy_infinite_loop);
            }else{
                var swiper = new Swiper(
                  "." + swiperContainerClass + " .frenzy_recommendation_contain",
                  {
                      slidesPerView: "auto",
                      freeMode: true,
                      spaceBetween: 0,
                      loop: frenzy_infinite_loop,
                      a11y: false,
                      keyboard: {
                          enabled: true,
                      },
                      navigation: {
                          nextEl: "." + swiperContainerClass + " .swiper-button-next",
                          prevEl: "." + swiperContainerClass + " .swiper-button-prev",
                      },
                      scrollbar: {
                          hide: false,
                          el: "." + swiperContainerClass + " .swiper-scrollbar",
                          draggable: true,
                      },
                      paginationClickable: true,
                  }
                );
            }
        }, 250);
    } else {
        let gridClass = "ltg_" + dataSetting && dataSetting.grid_items_per_row !== undefined ? dataSetting.grid_items_per_row : 1 + "";
        let collectionNavLayout = localStorage.getItem('collectionNavLayout');

        document
          .querySelector(
            "." + swiperContainerClass + " .recommendation_product_items"
          )
          .classList.add(
          "layout_type_grid",
          gridClass
        );
    }
    let cssdata =
      "." +
      swiperContainerClass +
      " .frenzy_product_item figure{border-color: #" +
      dataCss.card_border_color +
      ";} " +
      "." +
      swiperContainerClass +
      " .frenzy_product_item_detail, ." +
      swiperContainerClass +
      " .frenzy_product_item_detail h3 a{color:#" +
      dataCss.text_color +
      "} " +
      "." +
      swiperContainerClass +
      " .frenzy_product_price_sale.is-sale{color:#" +
      dataCss?.sale_price_color +
      "} " +
      "." +
      swiperContainerClass +
      " .frenzy_product_price_sale{color:#" +
      dataCss.price_color +
      "} " +
      "." +
      swiperContainerClass +
      " .frenzy_product_price_compare{color:#" +
      dataCss.compare_price_color +
      "} " +
      "." +
      swiperContainerClass +
      " .swiper-button-next:after, ." +
      swiperContainerClass +
      " .swiper-button-prev:after{color:#" +
      dataCss.arrow_color +
      "} " +
      "." +
      swiperContainerClass +
      " .frenzy_recommendation_title {font-size:" +
      dataCss.title_font_size +
      "px}";
    if (dataSetting.image_border_show == "0") {
        cssdata +=
          "." +
          swiperContainerClass +
          " .frenzy_product_item figure{border:none !important;}";
    }
    if (dataSetting.show_add_to_cart_button == "0") {
        cssdata +=
          "." +
          swiperContainerClass +
          " .frenzy_product_item .frenzy_add_to_cart_btn{display:none !important;}";
    }
    if (dataSetting.quickview == "0") {
        cssdata +=
          "." +
          swiperContainerClass +
          " .frenzy_product_item .frenzy_quickView_btn{display:none !important}";
    }
    if (dataSetting.tags == "0") {
        cssdata +=
          "." +
          swiperContainerClass +
          " .frenzy_product_item .frenzy_product_tags .custom_tag{display:none !important}";
    }
    if (dataSetting?.show_variant_option != "1") {
        cssdata +=
          "." +
          swiperContainerClass +
          " .frenzy_product_item .frenzy_variant_option{display:none !important}";
    }
    let head_Frenzy = document.head || document.getElementsByTagName("head")[0],
      style_Frenzy = document.createElement("style");
    head_Frenzy.appendChild(style_Frenzy);
    style_Frenzy.type = "text/css";
    if (style_Frenzy.styleSheet) {
        style_Frenzy.styleSheet.cssText = cssdata;
    } else {
        style_Frenzy.appendChild(document.createTextNode(cssdata));
    }
    if (typeof frenzyQuickViewProductCallBack == "function") {
        frenzyQuickViewProductCallBack(dataResults);
    }
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
}

/* Collections Page */
if (__st.p == "collection") {
    const frenzy_collection_url = searchURL_Frenzy.split("/");
    if (frenzy_collection_url[3]) {
        if (frenzy_collection_url[3].indexOf("+") > -1) {
            frenzy_collection_tags = frenzy_collection_url[3]
              .toLowerCase()
              .split("+");
        } else {
            frenzy_collection_tags.push(frenzy_collection_url[3].toLowerCase());
        }
    }
}
let get_frenzy_collection_page_section = document.querySelector(
  ".frenzy_collections_page"
);
const getCollectionsPageApi = async () => {
    let productRequestURL = '';
    let productSession_url = "";
    let get_session_product_current_url =sessionStorage.getItem("frenzy-session");
    if (get_session_product_current_url != null) {
        get_session_product_current_url = JSON.parse(get_session_product_current_url);
        productSession_url = get_session_product_current_url.requestURL;
    }
    const collection_handle =
      get_frenzy_collection_page_section.getAttribute("data-handle");
    if(!collectionSearchQueryVal){
        document.querySelector("body").scrollIntoView({ behavior: "smooth" });
    }
    const search_query = new URL(window.location.href).searchParams.get("q");
    var collection_type = '';
    var collection_vendor = '';
    if((collection_handle == 'types' && search_query) || (collection_handle == 'vendors' && search_query)){
        collection_type = collection_handle == 'types' ? search_query : '';
        collection_vendor = collection_handle == 'vendors' ? search_query : '';
    }
    let frenzy_collection_page_section_config = get_frenzy_collection_page_section.getAttribute("data-config_id") ? get_frenzy_collection_page_section.getAttribute("data-config_id") : '';
    const filtersData =
      frenzy_collection_tags && frenzy_collection_tags.length? { collections: [collection_handle], tags: frenzy_collection_tags } :
        collection_type ? { org_product_type: [collection_type] } : collection_vendor ? { org_brand:[collection_vendor]}  : { collections: [collection_handle] };


    let frenzy_default_collection_data_json = {};

    const frenzy_collection_page_collection_id = get_frenzy_collection_page_section.getAttribute("data-collection_id") ? get_frenzy_collection_page_section.getAttribute("data-collection_id") : null;
    const frenzy_collection_page_collection_handle = get_frenzy_collection_page_section.getAttribute("data-collection_handle") ? get_frenzy_collection_page_section.getAttribute("data-collection_handle") : null;

    frenzy_default_collection_data_json = {
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        collection_id: frenzy_collection_page_collection_id,
        collection_handle:frenzy_collection_page_collection_handle,
        shop: frenzyShop,
        mode: 2,
        page_index: 0,
        config_id: frenzy_collection_page_section_config,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country: Shopify.country ? Shopify.country : '',
        company_id: frenzy_company_id || 'null',
        location_id: frenzy_location_id || 'null'
    };

    if (search_query) {
        if(collection_type == '' && collection_vendor == ''){
            frenzy_default_collection_data_json.raw_query = encodeURIComponent(search_query);
        }
    }

    filter_query = [];
    Object.entries(filterArray_Frenzy || {}).map((x, i) => {
        if (x[0] === "org_price") {
            if (x[1].min || x[1].min == 0) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + ">" + x[1].min,
                });
            }
            if (x[1].max) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + "<" + x[1].max,
                });
            }
        } else {
            (x[1] || []).map((y, z) => {
                filter_query.push({ key: "filters=", value: x[0] + ":" + encodeURIComponent(y) });
            });
        }
    });
    Object.entries(filtersData || {}).map((x, i) => {
        (x[1] || []).map((y, z) => {
            filter_query.push({ key: "filters=", value: x[0] + ":" + encodeURIComponent(y) });
        });
    });
    frenzy_default_collection_data_json = Object.entries(
      frenzy_default_collection_data_json
    )
      .map((e) => e.join("="))
      .join("&");
    let params = "";
    filter_query.forEach((filter) => {
        params += "&" + filter.key + filter.value;
    });
    let frenzyCollPageAPIType = '/collection-search?';
    if(collection_type != '' && collection_type != null || collection_vendor != '' && collection_vendor != null){
        frenzyCollPageAPIType = "/search?";
    }
    productRequestURL = authUrl_Frenzy + frenzyCollPageAPIType + frenzy_default_collection_data_json + params;
    if(productRequestURL == productSession_url && controlPageRefresh != true){
        revert_data(get_session_product_current_url);
        frenzyAsyncItems();
    }else{
        var response = await fetch(productRequestURL,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "x-frenzy-authorization": frenzy_api_key,
                  "X-Shop": frenzyShop
              },
          }
        );
        const data = await response.json();
        let productResults = '';
        let productSearchPageSetting = '';
        let productGridHtml = '';
        let sideBarFields = '';
        let total_record = '';
        let total_page = '';
        let collectionImg = '';
        let collectionBody = '';
        let collectionPageCss = '';
        let collection_filter_order = '';
        let all_product_data = '';
        dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
        if(collection_type != '' && collection_type != null || collection_vendor != '' && collection_vendor != null){
            productResults = data.data.results.results;
            productSearchPageSetting = data.data.search_page;
            productGridHtml = data.data.recommendation_html;
            sideBarFields = data.data.results.facet_fields;
            total_record = data.data.results.products_found;
            total_page = data.data.results.page_count;
            collectionImg = data.data.results.collection_image;
            collectionBody = data.data.results.collection_body;
            collectionPageCss = data.data.search_page_css;
            collection_filter_order = data.data.filter_order;
            all_product_data = data.data;
        }else{
            productResults = data.data.results.results;
            productSearchPageSetting = data.data.collection_page;
            productGridHtml = data.data.recommendation_html;
            sideBarFields = data.data.results.facet_fields;
            total_record = data.data.results.products_found;
            total_page = data.data.results.page_count;
            collectionImg = data.data.results.collection_image;
            collectionBody = data.data.results.collection_body;
            collectionPageCss = data.data.collection_css;
            collection_filter_order = data.data.collection_filter_order;
            all_product_data = data.data;
        }

        if(isSelectedFilterClickEvent != true){
            sessionStorage.setItem("sidebar_filter_hide",'');
        }
        const getSidebar_filter_hide = sessionStorage.getItem("sidebar_filter_hide");
        if(getSidebar_filter_hide != null && getSidebar_filter_hide != ''){
            sidebar_filter_open_hide = getSidebar_filter_hide;
        }else{
            if(productSearchPageSetting?.sidebar_filter_open_hide == '1'){
                sidebar_filter_open_hide = productSearchPageSetting?.sidebar_filter_open_hide; // 1 is show and 0 is hide
            }
        }

        updatePriceRangeValues(data.data.results.stats.org_price, data.data.results.filters.org_price);

        const colorSwatches = data.data.results.color_swatches || [];
        const languageText = data.data.label_text;
        filter_order_Frenzy = [];
        (collection_filter_order || []).map((x) => {
            let boj = {
                ...x,
                selected: 0,
            };
            filter_order_Frenzy.push(boj);
        });
        const obj_filters = data.data.results.filters;
        const obj_facet_fields = data.data.results.facet_fields;
        Object.keys(obj_filters).map((key, index) => {
            if (obj_facet_fields[key] && key != "org_price") {
                filterArray_Frenzy[key] = [];
                (obj_filters[key] || []).map((x, i) => {
                    filterArray_Frenzy[key].push(x);
                });
            }
        });
        const frenzy_request_id = data.data.results.request_id;
        const frenzy_product_click = "collection";
        const globalSetting = data?.data?.global_setting;
        old_dataResults = old_dataResults.concat(data.data.results.results);
        var his_data = {
            ...data.data,
            results: { ...data.data.results, results: old_dataResults },
        };
        var SessionData = {
            frenzycollectdata: his_data,
            frenzypageNo: 0,
            url: window.location.href,
            position: current_position,
            country:Shopify.country,
            requestURL: productRequestURL
        };
        sessionStorage.setItem("sidebar_filter_hide", sidebar_filter_open_hide);
        sessionStorage.setItem("frenzy-session", JSON.stringify(SessionData));
        FrenzyProductImgResize(globalSetting);
        getCollectionsPage(
          productResults,
          productSearchPageSetting,
          collectionPageCss,
          productGridHtml,
          sideBarFields,
          filter_order_Frenzy,
          total_record,
          total_page,
          frenzy_request_id,
          frenzy_product_click,
          collectionImg,
          collectionBody,
          colorSwatches,
          languageText,
          dataConfig,
          all_product_data
        );
        if(collectionSearchQueryVal){
            setTimeout(function(){
                if(document.getElementById('frenzy_searchBar_input')){
                    const frenzy_searchBar_input = document.getElementById('frenzy_searchBar_input');
                    const frenzy_searchBar_input_end = frenzy_searchBar_input.value.length;
                    frenzy_searchBar_input.setSelectionRange(frenzy_searchBar_input_end, frenzy_searchBar_input_end);
                    frenzy_searchBar_input.focus();
                }
            },200);
        }
        collectionSearchQueryVal = false;
        if (0 + 1 == total_page) {
            frenzyPageScroll = false;
        }
    }
};
const getCollectionsPageFilterChangeApi = async (
  filter,
  page_no,
  frenzy_url_push
) => {
    let productFilterRequestURL = '';
    let productFilterSession_url = "";
    let get_session_product_filter_current_url =sessionStorage.getItem("frenzy-session");
    if (get_session_product_filter_current_url != null) {
        get_session_product_filter_current_url = JSON.parse(get_session_product_filter_current_url);
        productFilterSession_url = get_session_product_filter_current_url.requestURL;
    }
    let frenzy_collection_page_section_config = get_frenzy_collection_page_section.getAttribute("data-config_id") ? get_frenzy_collection_page_section.getAttribute("data-config_id") : '';
    if (typeof frenzyAnimationCallBack == "function") {
        document
          .querySelector(".frenzy_collections_page")
          .insertAdjacentHTML(
            "beforeend",
            '<div class="frenzyPreloader">' +
            frenzyAnimationCallBack() +
            "</div>"
          );
    } else {
        if(document.querySelector(".frenzy_collections_page .frenzy_flex_contain_area")){
            document.querySelector(".frenzy_collections_page .frenzy_flex_contain_area").innerHTML = PlaceHolderGridLoad(get_frenzy_collection_page_section,false,6);
        }
    }

    old_dataResults = [];

    const collection_handle =
      get_frenzy_collection_page_section.getAttribute("data-handle");
    if (frenzy_url_push) {
        if (typeof frenzyFilterClickCallBack == "function") {
            if(!collectionSearchQueryVal){
                frenzyFilterClickCallBack();
            }
        }else{
            const scrollDemo = document.querySelector(".frenzy_collections_page .frenzy_flex_row");
            const bodyOffset = document.body.getBoundingClientRect().top + 100;
            if(!collectionSearchQueryVal){
              window.scrollTo({
                top: scrollDemo.getBoundingClientRect().top - bodyOffset,
                behavior: "smooth",
              });
            }
        }
    }

    const search_query = new URL(window.location.href).searchParams.get("q");
    var collection_type = '';
    var collection_vendor = '';
    if((collection_handle == 'types' && search_query) || (collection_handle == 'vendors' && search_query)){
        collection_type = collection_handle == 'types' ? search_query : '';
        collection_vendor = collection_handle == 'vendors' ? search_query : '';
    }
    const frenzy_colection_mode = { ...filter, tags: frenzy_collection_tags };
    const filtersData =
      frenzy_collection_tags && frenzy_collection_tags.length
        ? { collections: [collection_handle], tags: frenzy_collection_tags }  :
        collection_type ? { org_product_type: [collection_type] } : collection_vendor ? { org_brand:[collection_vendor]} : { collections: [collection_handle] };


    var frenzy_collection_filter_data_json = {};
    const frenzy_collection_page_collection_id = get_frenzy_collection_page_section.getAttribute("data-collection_id") ? get_frenzy_collection_page_section.getAttribute("data-collection_id") : null;
    const frenzy_collection_page_collection_handle = get_frenzy_collection_page_section.getAttribute("data-collection_handle") ? get_frenzy_collection_page_section.getAttribute("data-collection_handle") : null;
    frenzy_collection_filter_data_json = {
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        collection_id: frenzy_collection_page_collection_id,
        collection_handle:frenzy_collection_page_collection_handle,
        shop: frenzyShop,
        mode: 2,
        page_index: page_no,
        config_id: frenzy_collection_page_section_config,
        currency:Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    };
    if (search_query) {
        if(collection_type == '' && collection_vendor == ''){
            frenzy_collection_filter_data_json.raw_query = encodeURIComponent(search_query);
        }
    }

    if (!filterArray_Frenzy.org_price) {
        filterArray_Frenzy.org_price = { min: FRENZY_MIN_PRICE, max: FRENZY_MAX_PRICE };
    }
    filter_query = [];
    if (filter_query.length == 0) {
        Object.entries(filterArray_Frenzy || {}).map((x, i) => {
            if (x[0] === "org_price") {
                if (x[1].min || x[1].min == 0) {
                    filter_query.push({
                        key: "filters=",
                        value: x[0] + ">" + x[1].min,
                    });
                }
                if (x[1].max) {
                    filter_query.push({
                        key: "filters=",
                        value: x[0] + "<" + x[1].max,
                    });
                }
            } else {
                (x[1] || []).map((y, z) => {
                    if (x[0] != "collections") {
                        filter_query.push({
                            key: "filters=",
                            value: x[0] + ":" + encodeURIComponent(y),
                        });
                    }
                });
            }
        });
        Object.entries(filtersData || {}).map((x, i) => {
            (x[1] || []).map((y, z) => {
                filter_query.push({ key: "filters=", value: x[0] + ":" + encodeURIComponent(y) });
            });
        });
    }
    frenzy_collection_filter_data_json = Object.entries(
      frenzy_collection_filter_data_json
    )
      .map((e) => e.join("="))
      .join("&");
    let params = "";
    filter_query.forEach((filter) => {
        params += "&" + filter.key + filter.value;
    });
    let frenzyCollPageAPIType = '/collection-search?';
    if(collection_type != '' || collection_vendor != ''){
        frenzyCollPageAPIType = "/search?";
    }
    productFilterRequestURL = authUrl_Frenzy + frenzyCollPageAPIType + frenzy_collection_filter_data_json + params;
    if(productFilterRequestURL == productFilterSession_url && controlPageRefresh != true){
        revert_data(get_session_product_filter_current_url);
        frenzyAsyncItems();
    }else{
        var response = await fetch(productFilterRequestURL,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "x-frenzy-authorization": frenzy_api_key,
                  "X-Shop": frenzyShop
              },
          }
        );
        const data = await response.json();
        let productResults = '';
        let productSearchPageSetting = '';
        let productGridHtml = '';
        let sideBarFields = '';
        let total_record = '';
        let total_page = '';
        let frenzy_request_id = '';
        let frenzy_product_click = '';
        let collectionImg = '';
        let collectionBody = '';
        let collectionPageCss = '';
        let filter_data = '';
        let product_data = '';
        dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
        if(collection_type != '' || collection_vendor != ''){
            productResults = data.data.results.results;
            productSearchPageSetting = data.data.search_page;
            productGridHtml = data.data.recommendation_html;
            sideBarFields = data.data.results.facet_fields;
            total_record = data.data.results.products_found;
            total_page = data.data.results.page_count;
            collectionImg = data.data.results.collection_image;
            collectionBody = data.data.results.collection_body;
            collectionPageCss = data.data.search_page_css;
            filter_data = data.data.filter_order;
            product_data = data.data;
        }else{
            productResults = data.data.results.results;
            productSearchPageSetting = data.data.collection_page;
            productGridHtml = data.data.recommendation_html;
            sideBarFields = data.data.results.facet_fields;
            total_record = data.data.results.products_found;
            total_page = data.data.results.page_count;
            frenzy_request_id = data.data.results.request_id;
            frenzy_product_click = "collection";
            collectionImg = data.data.results.collection_image;
            collectionBody = data.data.results.collection_body;
            collectionPageCss = data.data.collection_css;
            filter_data = data.data.collection_filter_order;
            product_data = data.data;
        }

        if(isSelectedFilterClickEvent != true){
            sessionStorage.setItem("sidebar_filter_hide",'');
        }
        const getSidebar_filter_hide = sessionStorage.getItem("sidebar_filter_hide");
        if((getSidebar_filter_hide != null && getSidebar_filter_hide != '')){
            sidebar_filter_open_hide = getSidebar_filter_hide;
        }else{
            if(sidebar_filter_open_hide !== '0' && productSearchPageSetting?.sidebar_filter_open_hide === '1'){
                sidebar_filter_open_hide = productSearchPageSetting?.sidebar_filter_open_hide; // 1 is show and 0 is hide
            }
        }
        updatePriceRangeValues(data.data.results.stats.org_price, data.data.results.filters.org_price);

        const colorSwatches = data.data.results.color_swatches || [];
        const languageText = data.data.label_text;
        const frenzyPaginationType = productSearchPageSetting?.pagination_type;
        // var filter_data = data.data.collection_filter_order;
        let newcollection_filter_order = [];
        (filter_data || []).map((x,i)=>{
            const findOldData = filter_order_Frenzy.find((y) => y.key === x.key);
            if(findOldData != undefined && findOldData.selected == 1){
                x = {...x,selected:1}
                newcollection_filter_order.push(x);
            }else{
                newcollection_filter_order.push(x);
            }
        });
        filter_order_Frenzy = newcollection_filter_order;
        let getRawQuery = "";
        if (urlParams_Frenzy.get("q")) {
            getRawQuery = urlParams_Frenzy.get("q").replace(" ", "+");
        }
        const createQueryString = (data) => {
            return Object.keys(data)
              .map((key) => {
                  let val = data[key];
                  if (val !== null && typeof val === "object")
                      val = createQueryString(val);
                  return `${key}=${encodeURIComponent(`${val}`)}`;
              })
              .join("&");
        };
        let urlfilterArray = filterArray_Frenzy;
        if (
          filterArray_Frenzy?.org_price?.min == FRENZY_MIN_PRICE &&
          filterArray_Frenzy?.org_price?.max == FRENZY_MAX_PRICE
        ) {
            delete urlfilterArray.org_price;
        }
        var getRawQueryParam = '';
        if(getRawQuery != ''){
            getRawQueryParam = "q="+getRawQuery+'&';
        }else{
            if(filterArray_Frenzy?.q){
                delete urlfilterArray.q;
            }
            frenzy_url_push = true;
        }
        let urlCreateQuery = createQueryString(urlfilterArray);
        if (frenzy_url_push) {
            if (frenzyPaginationType == 1) {
                window.history.pushState(
                  {},
                  "",
                  shopURL_Frenzy +
                  searchURL_Frenzy +
                  "?" +
                  getRawQueryParam +
                  urlCreateQuery +
                  "&filterchange=true" +
                  "&sort=" +
                  isSeletedSortValue_Frenzy
                );
            } else {
                window.history.pushState(
                  {},
                  "",
                  shopURL_Frenzy +
                  searchURL_Frenzy +
                  "?" +
                  getRawQueryParam +
                  urlCreateQuery +
                  "&filterchange=true&page=" +
                  selected_page_Frenzy +
                  "&sort=" +
                  isSeletedSortValue_Frenzy
                );
            }
        }
        const globalSetting = data?.data?.global_setting;
        FrenzyProductImgResize(globalSetting);
        getCollectionsPage(
          productResults,
          productSearchPageSetting,
          collectionPageCss,
          productGridHtml,
          sideBarFields,
          filter_order_Frenzy,
          total_record,
          total_page,
          frenzy_request_id,
          frenzy_product_click,
          collectionImg,
          collectionBody,
          colorSwatches,
          languageText,
          dataConfig,
          product_data
        );
        if(collectionSearchQueryVal){
            setTimeout(function(){
                if(document.getElementById('frenzy_searchBar_input')){
                    const frenzy_searchBar_input = document.getElementById('frenzy_searchBar_input');
                    const frenzy_searchBar_input_end = frenzy_searchBar_input.value.length;
                    frenzy_searchBar_input.setSelectionRange(frenzy_searchBar_input_end, frenzy_searchBar_input_end);
                    frenzy_searchBar_input.focus();
                }
            },200);
        }
        collectionSearchQueryVal = false;
        old_dataResults = old_dataResults.concat(data.data.results.results);
        var his_data = {
            ...data.data,
            results: { ...data.data.results, results: old_dataResults },
        };
        var SessionData = {
            frenzycollectdata: his_data,
            frenzypageNo: page_no,
            url: window.location.href,
            position: current_position,
            country:Shopify.country,
            requestURL: productFilterRequestURL
        };
        sessionStorage.setItem("sidebar_filter_hide", sidebar_filter_open_hide);
        sessionStorage.setItem("frenzy-session", JSON.stringify(SessionData));
        if (data?.data?.results?.products_found != 0) {
            if (
              document
                .querySelector("body")
                .classList.contains("is-open-filter") == true
            ) {
                document
                  .querySelector(".frenzy_flex_row")
                  .insertAdjacentHTML(
                    "beforeend",
                    '<div class="frenzy_overlay_wrap"></div>'
                  );
            } else {
            }
        }
        frenzyFilterClose();
    }
};
function getCollectionsPage(
  productData,
  settingData,
  settingCss,
  gridHtml,
  sideBarFields,
  filter_order_Frenzy,
  total_record,
  total_page,
  frenzy_request_id,
  frenzy_product_click,
  collection_img,
  collection_body,
  colorSwatches,
  languageText,
  dataConfig,
  all_product_data
) {
    let product_grid_html = gridHtml;
    const shop_currency =
      get_frenzy_collection_page_section.getAttribute("data-currency");
    check_shop_currency_frenzy(shop_currency || "");
    const hide_frenzy_filter =
      settingData.filter == "0" ? "hide_frenzy_filter" : "";
    currency_symbol_Frenzy = frenzy_shop_currency.split("{")[0];

    const resultsPerPage = +settingData.results_per_page;
    let previousProductCount = resultsPerPage * (selected_page_Frenzy - 1);

    let featuredImageVisibility = settingData.featured_image_visibility;
    let featuredImageShowOnAllPages = settingData.featured_image_show_on_all_pages;

    let bannerDetails = [];    
    for( let val = 1; val <= 10; val++) { 
      if(val == 1){
        bannerDetails.push({
          'image': settingData['image'],
          'text': settingData['text'],
          'image_link': settingData['image_link'],
          'image_position': settingData['image_position'],
          'image_length': settingData['image_length']
        })
      }else{    
        bannerDetails.push({
          'image': settingData['image_'+val],
          'text': settingData['text_'+val],
          'image_link': settingData['image_link_'+val],
          'image_position': settingData['image_position_'+val],
          'image_length': settingData['image_length_'+val]
        })
      }        
    }   
   
    let searchPageProductList = "";
    let FrenzyCollectionFeaturedSettingSchema = [];
    (productData || []).map((x, i) => {
        if (typeof FrenzyCollectionFeaturedSettingCallBack == "function") {
            var settings_schema = FrenzyCollectionFeaturedSettingCallBack();
            FrenzyCollectionFeaturedSettingSchema = settings_schema;
            (settings_schema || []).map((banner_value, banner_key) => {
                featuredImage = banner_value.image;
                featuredText = banner_value.text;
                featuredImageLink = banner_value.image_link;
                featuredImagePosition = banner_value.image_position;
                featuredImageLength = banner_value.image_length;
                if(featuredImageVisibility == '1') {
                    if (featuredImageShowOnAllPages == '1') {
                    previousProductCount = 0;
                    }
                    if(featuredImage != undefined || (featuredText != undefined && featuredText != '')) {
                    if ((previousProductCount + i == featuredImagePosition - 1)) {
                        searchPageProductList += getCollectionFeaturedImageElement(featuredImage, featuredText, featuredImageLink, featuredImageLength);
                    }
                    }
                }
            });
        }else{
            (bannerDetails || [] ).map((banner_value, banner_key)=>{
                const {image,text,image_link,image_position,image_length} = banner_value;
                if(featuredImageVisibility == '1') {
                    if (featuredImageShowOnAllPages == '1') {
                       previousProductCount = 0;
                    }
                    if(image != undefined || (text != undefined && text != '')) {
                       if ((previousProductCount + i == image_position - 1)) {
                         searchPageProductList += getCollectionFeaturedImageElement(image, text, image_link, image_length);
                       }
                    }
                }  
            }) 
        }
        
        searchPageProductList += getProductGridItem(
          product_grid_html,
          x,
          settingData,
          frenzy_shop_currency,
          frenzy_request_id,
          frenzy_product_click,
          dataConfig
        );
    });
    let siderbar_filter_section_html = "";
    let topbar_filter_section_html = "";
    let FrenzyFilterOrderCount = 1;
    let defaultNumberOfFilterItems = 6;
    let singleFilterLayoutOptionLimit = 5;
    if(settingData.single_filter_layout_options_limit){
        singleFilterLayoutOptionLimit = settingData.single_filter_layout_options_limit;
    }

    if (settingData.default_number_of_filter_items) {
        defaultNumberOfFilterItems = settingData.default_number_of_filter_items;
    }
    if (settingData.filter != "0") {

        (filter_order_Frenzy || []).map((x, i) => {
            let filter_name = x.key;
            let filter_label = x.value;
            let filter_info_box = x.info_box;
            let filter_display_type = x.display_type;
            let filter_swatch = x.swatch;
            let filter_data = sideBarFields[filter_name] ?? [];

            if (
              (filter_data.length != 0 ||
                filter_name === "price range" || filter_name === "org_price" ||
                (filter_name === "sortby" && settingData.sort === "2")) &&
              (x.status == "1" || x.status === true)
            ) {
                if (settingData.filter_layout === '0') {
                    if (FrenzyFilterOrderCount <= singleFilterLayoutOptionLimit) {
                        topbar_filter_section_html += sideBarFilter(
                          filter_name,
                          filter_data,
                          filter_display_type,
                          filter_swatch,
                          x.selected,
                          filter_label,
                          settingData,
                          true,
                          colorSwatches,
                          languageText,
                          defaultNumberOfFilterItems,
                          filter_info_box
                        );
                    }
                    FrenzyFilterOrderCount = FrenzyFilterOrderCount + 1;
                    siderbar_filter_section_html += sideBarFilter(
                      filter_name,
                      filter_data,
                      filter_display_type,
                      filter_swatch,
                      x.selected,
                      filter_label,
                      settingData,
                      false,
                      colorSwatches,
                      languageText,
                      defaultNumberOfFilterItems,
                      filter_info_box
                    );
                } else {
                    siderbar_filter_section_html += sideBarFilter(
                      filter_name,
                      filter_data,
                      filter_display_type,
                      filter_swatch,
                      x.selected,
                      filter_label,
                      settingData,
                      false,
                      colorSwatches,
                      languageText,
                      defaultNumberOfFilterItems,
                      filter_info_box
                    );
                }
            }
        });
    }

    let frenzySortingHtml = '';

    if (settingData.sort !== '0') {
        frenzySortingHtml = `
            <div class="frenzy_collection__sort">
                <div class="frenzy_popout--navbar">
                    <h2 class="visually-hidden" id="frenzy_sort-heading">
                        Sort
                    </h2>
                    <popout-select>
                        <div class="frenzy_popout" data-sort-enabled="manual" data-popout="">
                            <button type="button" class="frenzy_popout__toggle" aria-expanded="false" aria-controls="frenzy_sort-list" aria-describedby="frenzy_sort-heading" aria-label="Sort" data-popout-toggle="">
                                <span data-sort-button-text="" class="frenzy_sort-heading-desktop">Sort</span>
                                <span class="frenzy_sort-heading-mobile">Sort</span>
                                <svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 9 15"><path fill-rule="evenodd" d="M6.875 7.066L.87 1.06 1.93 0l6.006 6.005L7.94 6 9 7.06l-.004.006.005.005-1.06 1.06-.006-.004-6.005 6.005-1.061-1.06 6.005-6.006z"></path></svg>
                            </button>
                            <ul id="frenzy_sort-list" class="frenzy_popout-list"></ul>
                        </div>
                    </popout-select>
                </div>
            </div>
        `;
    }

    urlParams_Frenzy = new URLSearchParams(window.location.search);
    let filterchange = urlParams_Frenzy.get("filterchange");
    let search_page_html = `<div class="frenzy_container frenzy_filter_checkbox_visibility_${settingData.filter_checkbox_visibliity} frenzy_filter_sidebar_dropdown_arrow_show_${settingData.filter_sidebar_dropdown_arrow}">`;
    if (
      (collection_img != null &&
        collection_img != "null" &&
        collection_img != "") ||
      (collection_body != null &&
        collection_body != "null" &&
        collection_body != "")
    ) {
        search_page_html +=
          '<div class="frenzy_flex_row frenzy_collection_banner">';
        if (
          collection_img != null &&
          collection_img != "null" &&
          collection_img != ""
        ) {
            const frenzyCollImg = FrenzyImageResizer(collection_img, "500x");
            search_page_html += '<div class="frenzy_collection_image">';
            search_page_html +=
              '<figure><img src="' + frenzyCollImg + '" alt="" /></figure>';
            search_page_html += "</div>";
        }
        if (
          collection_body != null &&
          collection_body != "null" &&
          collection_body != ""
        ) {
            search_page_html +=
              '<div class="frenzy_collection_body">' +
              collection_body +
              "</div>";
        }
        search_page_html += "</div>";
    }

    // Sidbar Filter Navigation
    if (settingData.filter_layout !== '0') {
        var filter_toggle = '';
        if(sidebar_filter_open_hide == '1'){
            filter_toggle = 'data-filters-toggle="filters"';
            document.querySelector('body').classList.remove('hide-frenzy-filter');
        }else{
            document.querySelector('body').classList.add('hide-frenzy-filter');
        }
        search_page_html += `
            <nav class="frenzy_collection__nav">
                <div class="frenzy_collection__nav__buttons">
                    <button class="frenzy_collection__nav__filters__toggle" `+filter_toggle+`>
                        <span class="frenzy_collection__nav_hide_filters">Hide filters</span>
                        <span class="frenzy_collection__nav_show_filters">Filter</span>
                        <svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-filter" viewBox="0 0 10 6"><path d="M0 0h10v1H0zm2 2.5h6v1H2zM6.5 5h-3v1h3z" fill-rule="evenodd"></path></svg>
                    </button>
                    <div class="frenzy_collection__sort">
                        <div class="frenzy_popout--navbar">
                            <h2 class="visually-hidden" id="frenzy_sort-heading">
                                Sort
                            </h2>
                            <popout-select>
                                <div class="frenzy_popout" data-sort-enabled="manual" data-popout="">
                                    <button type="button" class="frenzy_popout__toggle" aria-expanded="false" aria-controls="frenzy_sort-list" aria-describedby="frenzy_sort-heading" aria-label="Sort" data-popout-toggle="">
                                        <span data-sort-button-text="" class="frenzy_sort-heading-desktop">Sort</span>
                                        <span class="frenzy_sort-heading-mobile">Sort</span>
                                        <svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-sort" viewBox="0 0 10 6"><path d="M0 0h10v1H0zm0 2.5h6v1H0zM3 5H0v1h3z" fill-rule="evenodd"></path></svg>
                                    </button>
                                    <ul id="frenzy_sort-list" class="frenzy_popout-list"></ul>
                                </div>
                            </popout-select>
                        </div>
                    </div>
                </div>
        `;

        // Display orientation buttons
        if (settingData.filter_display_orientation !== '0') {
            search_page_html += nav_layout_grid(settingData);
        }

        search_page_html += '</nav>';

        // Result count text
        search_page_html +=
          `<div class="frenzy_topbar_count_col"><span>Showing ${total_record} results</span></div>`;
    }

    if (settingData.filter_show_more_button !== "0") {
        search_page_html += `<style>.fwc_filters_list:nth-child(n+${+defaultNumberOfFilterItems + 1}) {display: none;} .filter_widget_section.show_all .fwc_filters_list {display: block;}</style>`;
    }

    const frenzy_topbar_filter_cls =
      settingData.filter_layout === '0' ? "frenzy_topbar_filter" : "";
    const filter_title = settingData?.filter_title;
    search_page_html +=
      '<div class="frenzy_flex_row ' +
      frenzy_topbar_filter_cls +
      '" id="frenzy_page_contain">';
    if (settingData.filter_layout === '0' && total_record != "0") {
        search_page_html += `<div class="frenzy_filter_container_element frenzy_flex_topbar_contain frenzy_flex_topbar_top_border_${settingData.filter_single_row_filter_top_border} frenzy_flex_topbar_bottom_border_${settingData.filter_single_row_filter_bottom_border}">`;
        search_page_html +=
          '<div class="frenzy_flex_topbar_btn_col"><button type="button" class="frenzy_filter_toggle">'+filter_title+'<svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 9 15"><path fill-rule="evenodd" d="M6.875 7.066L.87 1.06 1.93 0l6.006 6.005L7.94 6 9 7.06l-.004.006.005.005-1.06 1.06-.006-.004-6.005 6.005-1.061-1.06 6.005-6.006z"></path></svg></button></div>';
        search_page_html +=
          '<div class="frenzy_flex_topbar_filter_col"><div class="swiper-wrapper">' +
          topbar_filter_section_html +
          "</div></div>";
        if (settingData.sort == "1") {
            search_page_html +=
              '<div class="frenzy_topbar_sorting_col">' +
              frenzySortingHtml +
              "</div>";
        }

        // Display orientation buttons
        if (settingData.filter_display_orientation !== '0') {
            search_page_html += nav_layout_grid(settingData);
        }

        search_page_html += "</div>";
    }

    // Result count text
    search_page_html +=
      `<div class="frenzy_topbar_count_col"><span>Showing ${total_record} results</span></div>`;

    if (
      settingData.filter != "0" &&
      filterchange == "true" &&
      settingData.seleted_filter_type == "1"
    ) {
        frenzySelectedFilterList(Object.keys(sideBarFields));
        search_page_html +=
          '<div class="frenzy_topbar_seleted_Filter_col"><ul class="filterSeletedList">' +
          filter_seleted_list +
          "</ul></div>";
    }

    if (settingData.filter != "0") {
        search_page_html +=
          '<div class="frenzy_filter_container_element frenzy_flex_col ffc_sidebar_col">';

        if (settingData.filter_sticky == '1') {
            search_page_html += '<div class="frenzy_sidebar_panel frenzy_sidebar_panel_sticky">';
        } else {
            search_page_html += '<div class="frenzy_sidebar_panel">';
        }
        search_page_html += '<div class="frenzy_sidebar_header">';
        if (settingData.filter_title) {
            search_page_html += "<h3>" + settingData.filter_title + "</h3>";
        }
        search_page_html +=
          '<button type="button" class="frenzy_filter_close">' +
          close_arrow_Frenzy +
          "</button>";
        if (settingData.seleted_filter_type == "2" && filterchange == "true") {
            frenzySelectedFilterList(Object.keys(sideBarFields));
            search_page_html +=
              '<div class="filter_widget_seleted_Filter"><ul class="filterSeletedList">' +
              filter_seleted_list +
              "</ul></div>";
        }
        search_page_html += "</div>";
        search_page_html +=
          '<div class="filter_widget_section_contain">' +
          siderbar_filter_section_html +
          "</div>";
        search_page_html += `
            <div class="frenzy_filter_widget_footer">
                <div class="frenzy_filter_widget_footer_button_show_all">
                    <div class="frenzy_filter_widget_footer_button">SHOW ${total_record} RESULTS</div>
                </div>
                <div class="frenzy_filter_widget_footer_button_clear">
                    <div class="frenzy_filter_widget_footer_button">CLEAR ALL</div>
                </div>
            </div>
        `;
        search_page_html += "</div></div>";
    }
    search_page_html +=
      '<div class="frenzy_flex_col frenzy_flex_contain_area">';
    search_page_html +=
      '<div class="frenzy_topbar_contain ' + hide_frenzy_filter + '">';
    if (settingData.filter != "0") {
        search_page_html +=
          '<div class="frenzy_filter_btn_col"><button type="button" class="frenzy_filter_toggle">' +
          filter_icon_Frenzy +
          "<span>Filters</span></button></div>";
    }
    if (settingData.sort == "1") {
        search_page_html +=
          '<div class="frenzy_topbar_sorting_col">' +
          frenzySortingHtml +
          "</div>";
    }
    search_page_html += "</div>";
    if (total_record <= 0) {
        const frenzy_collectionQueryText =
          get_frenzy_collection_page_section.getAttribute("data-handle");
        searchPageProductList =
          '<div class="resultNotFoundText">We are sorry, but no results were found for: "' +
          frenzy_collectionQueryText +
          '"</div>';
    }
    const frenzyPaginationType = settingData?.pagination_type
      ? settingData.pagination_type
      : "0";
    let frenzyPagination = frenzyPaginationType;

    let frenzyMobilePaginationType = frenzyPaginationType;
    if(settingData?.mobile_pagination_type && window.innerWidth < 768){
       frenzyMobilePaginationType = settingData?.mobile_pagination_type;
       frenzyMobilePaginationType = (frenzyMobilePaginationType == 'loadmore') ? "1" : "0";
       frenzyPagination = frenzyMobilePaginationType;
    }
    let searchQuery = "";
    if (urlParams_Frenzy.get("q")) {
        searchQuery = urlParams_Frenzy.get("q").replace("+", " ");
    }

    if (settingData.search_bar == '1') {
        search_page_html += `
                <div class="frenzy_searchbar">
                    <input class="frenzy_searchbar_input" id="frenzy_searchBar_input" placeholder="Search products" value="${searchQuery}">
                    <div class="frenzy_searchbar_button_group">
                        <button class="frenzy_searchbar_search_button">
                            <div class="frenzy_searchbar_search_button_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" height="16" width="16"><path fill="#31373D" d="M5.0707 2.24494C5.96022 1.65058 7.00601 1.33334 8.07582 1.33334C9.51036 1.33343 10.8861 1.90334 11.9005 2.91771C12.9149 3.93208 13.4848 5.30784 13.4849 6.74237C13.4849 7.81219 13.1677 8.858 12.5733 9.74752C11.9789 10.637 11.1342 11.3303 10.1458 11.7397C9.1574 12.1491 8.06982 12.2562 7.02056 12.0475C5.97131 11.8388 5.0075 11.3237 4.25103 10.5672C3.49456 9.81072 2.97939 8.84692 2.77068 7.79766C2.56197 6.74841 2.66909 5.66082 3.07849 4.67245C3.48789 3.68407 4.18119 2.83929 5.0707 2.24494ZM8.07582 2.33334C9.24515 2.33343 10.3666 2.79798 11.1934 3.62482C12.0203 4.45166 12.4848 5.57308 12.4849 6.74241M8.07582 2.33334C7.2038 2.33335 6.35133 2.59194 5.62627 3.0764C4.90121 3.56088 4.33608 4.24948 4.00237 5.05513C3.66866 5.86078 3.58135 6.7473 3.75147 7.60257C3.9216 8.45785 4.34152 9.24347 4.95814 9.86008C5.57476 10.4767 6.36038 10.8966 7.21565 11.0667C8.07093 11.2369 8.95745 11.1496 9.7631 10.8158C10.5687 10.4821 11.2574 9.91702 11.7418 9.19195C12.2263 8.46689 12.4849 7.61443 12.4849 6.74241" clip-rule="evenodd" fill-rule="evenodd"></path><path fill="#31373D" d="M11.3847 10.0514C11.58 9.85615 11.8966 9.85615 12.0918 10.0514L15.5203 13.4799C15.7155 13.6751 15.7155 13.9917 15.5203 14.187C15.325 14.3822 15.0084 14.3822 14.8132 14.187L11.3847 10.7585C11.1895 10.5633 11.1895 10.2467 11.3847 10.0514Z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                            </div>
                        </button>
                    </div>
                </div>
            `;
    }
    search_page_html +=
      '<div class="frenzy_search_page_contain frenzy_product_row" id="frenzyProductList">' +
      searchPageProductList +
      "</div>";
    if (1 < total_page && frenzyPagination === "0") {
        search_page_html +=
          '<div class="frenzy_pagination_nav"><div class="pagination" id="pagination"></div></div>';
    }
    if (frenzyPagination === "1" && total_page > 1) {
        search_page_html +=
          '<div class="frenzy_load_more" id="frenzyAutoLoad"></div>';
    }
    search_page_html += "</div>";
    search_page_html += "</div>";
    search_page_html += "</div>";
    get_frenzy_collection_page_section.innerHTML = search_page_html;
    // selected filter unclick event
    if(document.querySelectorAll('.filter_clear_icon').length > 0){
        document.querySelectorAll('.filter_clear_icon').forEach(function(this_click){
            this_click.addEventListener('click', function(){
                if(document.getElementById(this_click.getAttribute('for'))){
                    document.getElementById(this_click.getAttribute('for')).dispatchEvent(new Event('change', { 'bubbles': true }));
                }
            });
        });
    }
    if(document.querySelectorAll('.filter_input_value')){
        document.querySelectorAll('.filter_input_value').forEach(function(this_click){
            this_click.addEventListener('keypress', function(e){
                if (e.which === 13) {
                    // return false;
                    this_click.closest('label[for="'+this_click.getAttribute('id')+'"]').click();
                }
            });
        });
    }
    if (
      !collectionSearchQueryVal && performance.navigation.type == performance.navigation.TYPE_RELOAD
    ) {
        setTimeout(function(){
            //   window.scrollTo({
            //     top: 0,
            //     behavior: "smooth"
            //   });
        }, 200);
    }

    let gridClass = "ltg_" + settingData.grid_items_per_row + "";
    let collectionNavLayout = localStorage.getItem('collectionNavLayout');

    if (collectionNavLayout) {
        gridClass = "ltg_" + collectionNavLayout;
    }

    document
      .querySelector(".frenzy_search_page_contain")
      .classList.add(
      "layout_type_grid",
      gridClass
    );

    // Filter Toggle Button Click Handler
    var frenzyCollectionNavFiltersToggle = document.querySelector('.frenzy_collection__nav__filters__toggle');

    if (frenzyCollectionNavFiltersToggle) {
        frenzyCollectionNavFiltersToggle.addEventListener('click', function() {
            var toggleValue = frenzyCollectionNavFiltersToggle.getAttribute('data-filters-toggle');

            if (toggleValue == 'filters') {
                frenzyCollectionNavFiltersToggle.setAttribute('data-filters-toggle', '');
                document.querySelector('body').classList.add('hide-frenzy-filter');
                sidebar_filter_open_hide = '0';
            } else {
                frenzyCollectionNavFiltersToggle.setAttribute('data-filters-toggle', 'filters');
                document.querySelector('body').classList.remove('hide-frenzy-filter');
                sidebar_filter_open_hide = '1';
            }
            sessionStorage.setItem("sidebar_filter_hide", sidebar_filter_open_hide);
            document.querySelector("body").classList.add("is-open-filter");
            document
              .querySelector(".frenzy_flex_row")
              .insertAdjacentHTML(
                "beforeend",
                '<div class="frenzy_overlay_wrap"></div>'
              );
            frenzyFilterClose();
        });
    }

    // Add Sort options
    if(languageText?.sorting_value){
        (languageText.sorting_value || []).map((sortVal) => {
            const sortingStatus =
              (sortVal && sortVal.status === true) ||
              (sortVal && sortVal.status === false)
                ? sortVal.status
                : true;
            if (sortingStatus) {
                if (document.querySelector('.frenzy_popout-list')) {
                    document.querySelector('.frenzy_popout-list').innerHTML += `
                    <li class="frenzy_popout-list__item">
                        <a class="frenzy_popout-list__option ${isSeletedSortValue_Frenzy == sortVal.value ? "frenzy_popout-list__item--current" : ""}" data-value="${sortVal.value}" href="#">
                        <span>${sortVal.name}</span>
                        </a>
                    </li>
                `;
                }
            }

            if (isSeletedSortValue_Frenzy == sortVal.value) {
                if (document.querySelector('.frenzy_sort-heading-desktop')) {
                    document.querySelector('.frenzy_sort-heading-desktop').innerHTML = sortVal.name;
                }
            }
        });
    }

    // Sort Toggle Button Click Handler
    var frenzyCollectionNavSortToggle = document.querySelector('.frenzy_popout__toggle');
    var frenzyCollectionnavSortList = document.querySelector('.frenzy_popout-list');

    if (frenzyCollectionNavSortToggle) {
        frenzyCollectionNavSortToggle.addEventListener('click', function() {
            frenzyCollectionnavSortList.classList.toggle('frenzy_popout-list--visible');
        });
    }

    // Sort Option Click Handler
    document.querySelectorAll('.frenzy_popout-list__option').forEach((option) => {
        option.addEventListener('click', function(event) {
            event.preventDefault();

            var optionValue = option.getAttribute('data-value');
            var frenzySortHeadingDesktop = document.querySelector('.frenzy_sort-heading-desktop');

            // Update current option
            document.querySelector('.frenzy_popout-list__item--current').classList.remove('frenzy_popout-list__item--current');
            option.classList.add('frenzy_popout-list__item--current');

            // Update sort heading
            frenzySortHeadingDesktop.innerHTML = optionValue;

            // Sort products
            frenzyPageScroll = true;
            frenzyPageScrollNo = 0;
            isSeletedSortValue_Frenzy = optionValue;
            if (get_frenzy_search_page_section) {
                getSearchPAgeFilterChangeApi(filterArray_Frenzy, 0, true);
            }
            if (get_frenzy_collection_page_section) {
                getCollectionsPageFilterChangeApi(
                  filterArray_Frenzy,
                  0,
                  true
                );
            }
            selected_page_Frenzy = 1;
            document
              .querySelector("body")
              .classList.remove("is-open-filter");
        });
    });

    // Collection Nav Grid Layout Button Click Handler
    var frenzyLayoutTypeGrid = document.querySelector('.layout_type_grid');

    if (frenzyLayoutTypeGrid) {
        var frenzyCollectionNavLayouts = document.querySelectorAll('.frenzy_collection__nav__layout button');

        frenzyCollectionNavLayouts.forEach((item) => {
            item.addEventListener('click', function() {
                var gridNumber = item.getAttribute('data-toggle-grid');
                for (let item of frenzyCollectionNavLayouts) {
                    item.classList.remove('active');
                }
                item.classList.add('active');
                for (let i = frenzyLayoutTypeGrid.classList.length - 1; i >= 0; i--) {
                    const className = frenzyLayoutTypeGrid.classList[i];
                    if (className.startsWith('ltg_')) {
                        frenzyLayoutTypeGrid.classList.remove(className);
                        localStorage.removeItem('collectionNavLayout');
                    }
                }

                switch (gridNumber) {
                    case "1":
                        frenzyLayoutTypeGrid.classList.add('ltg_1');
                        localStorage.setItem('collectionNavLayout', 1);

                        break;
                    case "2":
                        frenzyLayoutTypeGrid.classList.add('ltg_2');
                        localStorage.setItem('collectionNavLayout', 2);

                        break;
                    case "3":
                        frenzyLayoutTypeGrid.classList.add('ltg_3');
                        localStorage.setItem('collectionNavLayout', 3);

                        break;
                    case "4":
                        frenzyLayoutTypeGrid.classList.add('ltg_4');
                        localStorage.setItem('collectionNavLayout', 4);

                        break;
                    case "5":
                        frenzyLayoutTypeGrid.classList.add('ltg_5');
                        localStorage.setItem('collectionNavLayout', 5);

                        break;
                    case "6":
                        frenzyLayoutTypeGrid.classList.add('ltg_6');
                        localStorage.setItem('collectionNavLayout', 6);

                        break;
                    default:
                        localStorage.removeItem('collectionNavLayout');

                        break;
                }
            });
        });
    }

    sideBarFilterScript(settingData);
    total_page_no_Frenzy = total_page;
    if (1 < total_page && frenzyPagination === "0") {
        init_Frenzy(total_page);
    }
    if (is_frenzy_page_css) {
        let cssdata =
          `@media (min-width: 768px) {.frenzy_container .frenzy_sidebar_panel_sticky {top: ${settingData.filter_sticky_top_position}; max-height: ${settingData.filter_sticky_max_height};}}` +
          ".frenzy_grid .frenzy_product_item figure{border-color: #" +
          settingCss.card_border_color +
          ";} " +
          ".frenzy_product_item .frenzy_product_item_detail, .frenzy_product_item .frenzy_product_item_detail h3.frenzy_product_title a{color:#" +
          settingCss.text_color +
          "} " +
          ".frenzy_product_item .frenzy_product_price_sale.is-sale{color:#" +
          settingCss?.sale_price_color+
          "} " +
          ".frenzy_product_item .frenzy_product_price_sale{color:#" +
          settingCss.price_color +
          "} " +
          ".frenzy_product_item .frenzy_product_price_compare{color:#" +
          settingCss.compare_price_color +
          "} " +
          ".frenzy_sidebar_panel .fwc_filters_search input.fwc_search_input,.frenzy_sidebar_panel .filter_price_contain .filter_price_box input{border-color:#" +
          settingCss.filter_input_border_color +
          "}" +
          ".frenzy_sidebar_panel .filter_price_contain .filter_price_box input,.frenzy_sidebar_panel .filter_price_contain .filter_price_box label,.frenzy_sidebar_panel .fwc_filters_search input.fwc_search_input{background-color:#" +
          settingCss.filter_bg_color +
          ";color:#" +
          settingCss.filter_text_color +
          "}" +
          ".frenzy_collections_page .frenzy_sidebar_panel{background-color:#" +
          settingCss.filter_bg_color +
          ";border-color:#" +
          settingCss.filter_border_color +
          "}" +
          ".frenzy_sidebar_panel .filter_widget_section,.frenzy_sidebar_panel .filter_widget_section_contain{border-color:#" +
          settingCss.filter_border_color +
          "}" +
          ".frenzy_sidebar_panel .filter_widget_trigger{color:#" +
          settingCss.filter_subtitle_color +
          "}" +
          ".frenzy_sidebar_panel .filter_widget_trigger_icon svg{fill:#" +
          settingCss.filter_subtitle_color +
          "}" +
          ".frenzy_sidebar_panel .filter_checkbox .filter_checkbox_label, .frenzy_sidebar_panel .filter_checkbox .checkbox_count{color:#" +
          settingCss.filter_text_color +
          "}" +
          ".frenzy_topbar_contain .frenzy_topbar_count_col span,.frenzy_topbar_contain .frenzy_topbar_sorting_col .sorting_label{color:#" +
          settingCss.topbar_text_color +
          "}" +
          ".frenzy_topbar_contain .filter_clear_item, .frenzy_topbar_contain select.frenzy_sorting_btn{color:#" +
          settingCss.seleted_text_color +
          ";background-color:#" +
          settingCss.seleted_bg_color +
          "}" +
          ".frenzy_topbar_contain .filter_clear_item .filter_clear_icon svg{fill:#" +
          settingCss.seleted_text_color +
          "}" +
          ".frenzy_topbar_contain::before{background-color:" +
          settingCss.topbar_border_color +
          "}" +
          ".frenzy_flex_contain_area .frenzy_pagination_nav .pagination{background-color:#" +
          settingCss.pagination_bg_color +
          ";border-color:#" +
          settingCss.pagination_border_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain{border-color:#" +
          settingCss.pagination_border_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain a, .frenzy_pagination_nav .frenzy_pagination_contain i{color:#" +
          settingCss.pagination_text_color +
          "}" +
          ".frenzy_pagination_nav button.frenzy_pagination_btn svg{fill:#" +
          settingCss.pagination_text_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain a.current, .frenzy_pagination_nav button.frenzy_pagination_btn:hover{background-color:#" +
          settingCss.pagination_seleted_bg_color +
          ";color:#" +
          settingCss.pagination_seleted_text_color +
          "}" +
          ".frenzy_pagination_nav button.frenzy_pagination_btn:hover svg{fill:#" +
          settingCss.pagination_seleted_text_color +
          "}" +
          ".frenzy_sidebar_panel .frenzy_sidebar_header h3{color:#" +
          settingCss.filter_title_color +
          "}" +
          "" +
          settingCss.hide_description_class +
          "{display:none}" +
          "" +
          settingCss.hide_title_class +
          "{display:none}";
        if (settingData.filter_layout === '0') {
            cssdata +=
              ".frenzy_flex_topbar_contain .filter_widget_content{background-color:#" +
              settingCss.filter_bg_color +
              ";border-color:#" +
              settingCss.filter_border_color +
              "}" +
              ".frenzy_flex_topbar_contain .filter_widget_trigger{border-color:#" +
              settingCss.filter_border_color +
              "}";
        }
        if (settingData.filter_clear_all == "0") {
            cssdata += "ul.filterSeletedList li.FSL_ClearItem{display:none}";
        }
        if (settingData.image_border_show == "0") {
            cssdata += ".frenzy_product_item figure{border:none !important;}";
        }
        if (settingData.range_price == "0") {
            cssdata +=
              ".filter_type_price-range{display:none !important;}";
        }
        if (settingData.quickview == "0") {
            cssdata +=
              ".frenzy_product_item .frenzy_quickView_btn{display:none !important}";
        }
        if (settingData.tags == "0") {
            cssdata +=
              ".frenzy_product_item .frenzy_product_tags .custom_tag{display:none !important}";
        }
        if (settingData.show_add_to_cart_button == "0") {
            cssdata +=
              ".frenzy_collections_page .frenzy_product_item .frenzy_add_to_cart_btn{display:none !important;}";
        }
        if (
          settingCss.description_font_family != "" &&
          settingCss.description_font_family != null &&
          settingCss.description_font_family != "null"
        ) {
            cssdata +=
              ".frenzy_collection_body p,.frenzy_collection_body,.frenzy_collection_body li{font-family:" +
              settingCss.description_font_family +
              "}";
        }
        if (
          settingCss.description_font_color != "" &&
          settingCss.description_font_color != null &&
          settingCss.description_font_color != "null"
        ) {
            cssdata +=
              ".frenzy_collection_body p,.frenzy_collection_body,.frenzy_collection_body li{color:#" +
              settingCss.description_font_color +
              "}";
        }
        if (
          settingCss.description_font_size != "" &&
          settingCss.description_font_size != null &&
          settingCss.description_font_size != "null"
        ) {
            cssdata +=
              ".frenzy_collection_body p,.frenzy_collection_body,.frenzy_collection_body li{font-size:" +
              settingCss.description_font_size +
              "px}";
        }
        if (
          settingCss.description_line_height != "" &&
          settingCss.description_line_height != null &&
          settingCss.description_line_height != "null"
        ) {
            cssdata +=
              ".frenzy_collection_body p,.frenzy_collection_body,.frenzy_collection_body li{line-height:" +
              settingCss.description_line_height +
              "px}";
        }
        if (settingCss.description_image_type === "1") {
            cssdata +=
              ".frenzy_collection_image figure img{height:" +
              settingCss.description_image_height +
              "px}";
        }
        if (settingData?.show_variant_option != "1") {
            cssdata +=
              ".frenzy_collections_page .frenzy_product_item .frenzy_variant_option{display:none !important}";
        }
        let head = document.head || document.getElementsByTagName("head")[0],
          style = document.createElement("style");
        head.appendChild(style);
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = cssdata;
        } else {
            style.appendChild(document.createTextNode(cssdata));
        }
        is_frenzy_page_css = false;
    }
    if (total_record <= 0) {
        document.querySelector(".ffc_sidebar_col").style.display = "none";
    }
    if (settingData.filter_layout === '0') {
        setTimeout(function () {
            if(document.querySelector(".frenzy_flex_topbar_filter_col")){
                var swiper = new Swiper(".frenzy_flex_topbar_filter_col", {
                    direction: "horizontal",
                    loop: false,
                    slidesPerView: "auto",
                    slideToClickedSlide: true,
                    allowTouchMove : false,
                    touchStartPreventDefault: false,
                    spaceBetween: 10,
                });
            }
        }, 500);
    }

    // Expanded Filter Show All Button Click Handler
    var frenzyFilterFooterShowAllButton = document.querySelector('.frenzy_filter_widget_footer_button_show_all');
    var frenzyFilterCloseButton = document.querySelector('.frenzy_filter_close');

    if (frenzyFilterFooterShowAllButton) {
        frenzyFilterFooterShowAllButton.addEventListener('click', function() {
            frenzyFilterCloseButton.click();
        });
    }

    // Expanded Filter Clear Button Click Handler
    var frenzyFilterFooterClearButtons = document.querySelectorAll('.frenzy_filter_widget_footer_button_clear');

    frenzyFilterFooterClearButtons.forEach(function(frenzyFilterFooterClearButton) {
        frenzyFilterFooterClearButton.addEventListener('click', function() {
            const scrollDemo = document.querySelector(".frenzy_collections_page .frenzy_flex_row");
            const bodyOffset = document.body.getBoundingClientRect().top + 100;
            window.scrollTo({
              top: scrollDemo.getBoundingClientRect().top - bodyOffset,
              behavior: "smooth",
            });
            var frenzySelectedFilterClearButton = document.querySelector('.filter_clear_all_btn');

            if (frenzySelectedFilterClearButton) {
                frenzySelectedFilterClearButton.click();
            }
        });
    });

    // Filter Show More/Less Button Handler
    document.querySelectorAll('.frenzy_filter_item_show_more_button').forEach((button) => {
        const buttonTitle = button.getAttribute('data-title');

        button.addEventListener('click', function(event) {
            event.preventDefault();

            let filterWidgetSection = button.closest('.filter_widget_section');

            if (filterWidgetSection) {
                filterWidgetSection.classList.toggle('show_all');

                if (filterWidgetSection.classList.contains('show_all')) {
                    localStorage.setItem(buttonTitle, 'open');
                } else {
                    localStorage.removeItem(buttonTitle);
                }
            }
        });

        // Restore Filter Show More/Less Button Status
        if (localStorage.getItem(buttonTitle)) {
            button.click();
        }
    });

    // Close Expanded Filter when click outside
    window.addEventListener('click', ({ target }) => {
        if (!target.closest('.frenzy_filter_toggle') && !target.closest('.filter_is_click') && !target.closest('.ffc_sidebar_col') && !target.closest('.frenzy_collection__nav__filters__toggle') && !target.closest('.frenzyPreloader')) {
            document
              .querySelector("body")
              .classList.remove("is-open-filter");
            document.querySelector(".frenzy_overlay_wrap")?.remove();
        }
    });

    // Search bar function
    document.querySelectorAll('.frenzy_searchbar_input').forEach(frenzySearchBarInput => {
        frenzySearchBarInput.addEventListener('input', frenzy_debounce(() => {
            collectionSearchQueryVal = true;
            const url = new URL(window.location);
            url.searchParams.set('q', frenzySearchBarInput.value);
            url.searchParams.set('page', 1);
            window.history.pushState({}, '', url);

            popstateHandler();
        }, 1000));
    });

    if (frenzyPagination === "1" && total_page > 1) {
        frenzyAutoScroll();
    }
    if (frenzyPagination === "0") {
        frenzyPaginationScroll();
    }
    if (typeof frenzyQuickViewProductCallBack == "function") {
        frenzyQuickViewProductCallBack(productData);
    }
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
}

function nav_layout_grid(settingData){
    let search_page_html = '';
    let frenzy_grid_1_active = '';
    let frenzy_grid_2_active = '';
    let frenzy_grid_3_active = '';
    let frenzy_grid_4_active = '';

    const collectionNavLayoutValue = localStorage.getItem('collectionNavLayout');

    if(collectionNavLayoutValue != null && collectionNavLayoutValue != ''){
        if(window.innerWidth < 575){
            if(collectionNavLayoutValue === '3' || collectionNavLayoutValue === '4'){
              if(isFrenzyGrid1Active){
                frenzy_grid_1_active = 'active';
              }else{
                frenzy_grid_2_active = 'active';
              }
            }else{
                frenzy_grid_1_active = collectionNavLayoutValue === '1' ? 'active' : '';
                frenzy_grid_2_active = collectionNavLayoutValue === '2' ? 'active' : '';
            }
        }else{
            frenzy_grid_1_active = collectionNavLayoutValue === '1' ? 'active' : '';
            frenzy_grid_2_active = collectionNavLayoutValue === '2' ? 'active' : '';
            frenzy_grid_3_active = collectionNavLayoutValue === '3' ? 'active' : '';
            frenzy_grid_4_active = collectionNavLayoutValue === '4' ? 'active' : '';
        }
    }else{
        if(window.innerWidth < 575){
            if(settingData?.grid_items_per_row === '3' || settingData?.grid_items_per_row === '4'){
                if(isFrenzyGrid1Active){
                  frenzy_grid_1_active = 'active';
                }else{
                  frenzy_grid_2_active = 'active';
                }
            }else{
                frenzy_grid_1_active = settingData?.grid_items_per_row === '1' ? 'active' : '';
                frenzy_grid_2_active = settingData?.grid_items_per_row === '2' ? 'active' : '';
            }
        }else{
            frenzy_grid_1_active = settingData?.grid_items_per_row === '1' ? 'active' : '';
            frenzy_grid_2_active = settingData?.grid_items_per_row === '2' ? 'active' : '';
            frenzy_grid_3_active = settingData?.grid_items_per_row === '3' ? 'active' : '';
            frenzy_grid_4_active = settingData?.grid_items_per_row === '4' ? 'active' : '';
        }
    }
    search_page_html += `
          <div class="frenzy_collection__nav__layout 123">
              <button aria-label="Show 1 product per row" data-toggle-grid="1" class="${frenzy_grid_1_active}"><svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-grid-1" viewBox="0 0 14 14"><path fill-rule="evenodd" d="M0 0h14v14H0z"></path></svg></button>
              <button aria-label="Show 2 products per row" data-toggle-grid="2" class="${frenzy_grid_2_active}"><svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-grid-2" viewBox="0 0 14 14"><path d="M8 0h6v6H8zm0 8h6v6H8zM0 0h6v6H0zm0 8h6v6H0z" fill-rule="evenodd"></path></svg></button>
              <button aria-label="Show 3 products per row" data-toggle-grid="3" class="${frenzy_grid_3_active}"><svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-grid-3" viewBox="0 0 14 14"><path d="M0 0h3v3H0zm0 11h3v3H0zm0-5.5h3v3H0zM5.5 0h3v3h-3zm0 11h3v3h-3zm0-5.5h3v3h-3zM11 0h3v3h-3zm0 11h3v3h-3zm0-5.5h3v3h-3z" fill-rule="evenodd"></path></svg></button>
              <button aria-label="Show 4 products per row" data-toggle-grid="4" class="${frenzy_grid_4_active}"><svg aria-hidden="true" focusable="false" role="presentation" class="frenzy_collection__nav_icon frenzy_collection__nav_icon-grid-4" viewBox="0 0 14 14"><path d="M0 0h2v2H0zm0 8h2v2H0zm0-4h2v2H0zm0 8h2v2H0zM4 0h2v2H4zm0 8h2v2H4zm0-4h2v2H4zm0 8h2v2H4zM8 0h2v2H8zm0 8h2v2H8zm0-4h2v2H8zm0 8h2v2H8zm4-12h2v2h-2zm0 8h2v2h-2zm0-4h2v2h-2zm0 8h2v2h-2z" fill-rule="evenodd"></path></svg></button>
          </div>
      `;
    return search_page_html;
}

/* Auto scroll product */
const collectionsPageScrollApi = async (page_no) => {
    let productRequestURL = '';
    let productSession_url = "";
    let get_session_product_current_url =sessionStorage.getItem("frenzy-session");
    if (get_session_product_current_url != null) {
        get_session_product_current_url = JSON.parse(get_session_product_current_url);
        productSession_url = get_session_product_current_url.requestURL;
    }
    let frenzy_collection_page_section_config = get_frenzy_collection_page_section.getAttribute("data-config_id") ? get_frenzy_collection_page_section.getAttribute("data-config_id") : '';
    if (typeof frenzyAnimationCallBack == "function") {
        document.getElementById("frenzyProductList").innerHTML +=
          '<div class="frenzyScrollLoader">' +
          frenzyAnimationCallBack() +
          "</div>";
    } else {
        document.getElementById("frenzyProductList").innerHTML +=
          '<div class="frenzyScrollLoader"><span class="frenzyLoaderLine"></span></div>';
    }
    const collection_handle =
      get_frenzy_collection_page_section.getAttribute("data-handle");
    const frenzy_colection_mode = {
        ...filterArray_Frenzy,
        tags: frenzy_collection_tags,
    };

    const search_query = new URL(window.location.href).searchParams.get("q");

    var frenzy_collection_filter_data_json = {};

    const frenzy_collection_page_collection_id = get_frenzy_collection_page_section.getAttribute("data-collection_id") ? get_frenzy_collection_page_section.getAttribute("data-collection_id") : null;
    const frenzy_collection_page_collection_handle = get_frenzy_collection_page_section.getAttribute("data-collection_handle") ? get_frenzy_collection_page_section.getAttribute("data-collection_handle") : null;
    frenzy_collection_filter_data_json = {
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        collection_id: frenzy_collection_page_collection_id,
        collection_handle:frenzy_collection_page_collection_handle,
        shop: frenzyShop,
        mode: 2,
        page_index: page_no,
        config_id:frenzy_collection_page_section_config,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    };
    let frenzyCollPageAPIType = '/collection-search?';
    if (search_query) {
        frenzy_collection_filter_data_json.raw_query = encodeURIComponent(search_query);;
        frenzyCollPageAPIType = "/search?";
    }

    if (!filterArray_Frenzy.org_price) {
        filterArray_Frenzy.org_price = { min: FRENZY_MIN_PRICE, max: FRENZY_MAX_PRICE };
    }
    if (filter_query.length == 0) {
        Object.entries(filterArray_Frenzy || {}).map((x, i) => {
            if (x[0] === "org_price") {
                if (x[1].min || x[1].min == 0) {
                    filter_query.push({
                        key: "filters=",
                        value: x[0] + ">" + x[1].min,
                    });
                }
                if (x[1].max) {
                    filter_query.push({
                        key: "filters=",
                        value: x[0] + "<" + x[1].max,
                    });
                }
            } else {
                (x[1] || []).map((y, z) => {
                    filter_query.push({
                        key: "filters=",
                        value: x[0] + ":" + encodeURIComponent(y),
                    });
                });
            }
        });
    }
    frenzy_collection_filter_data_json = Object.entries(
      frenzy_collection_filter_data_json
    )
      .map((e) => e.join("="))
      .join("&");
    let params = "";
    filter_query.forEach((filter) => {
        params += "&" + filter.key + filter.value;
    });
    productRequestURL = authUrl_Frenzy + frenzyCollPageAPIType + frenzy_collection_filter_data_json + params;
    if(productRequestURL == productSession_url && controlPageRefresh != true){
        revert_data(get_session_product_current_url);
        frenzyAsyncItems();
    }else{
        const response = await fetch(productRequestURL,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "x-frenzy-authorization": frenzy_api_key,
                  "X-Shop": frenzyShop
              },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
            dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
            const dataResults = data.data.results.results;
            const dataSetting = data.data.collection_page;
            const dataGridHtml = data.data.recommendation_html;
            const total_page = data.data.results.page_count;
            const products_found = data.data.results.products_found;
            const frenzy_request_id = data.data.results.request_id;
            const all_product_data = data.data;
            const frenzy_product_click = "collection";
            selected_page_Frenzy = page_no + 1;
            if (document.querySelector(".frenzy_topbar_count_col")) {
                document.querySelector(".frenzy_topbar_count_col").innerHTML =
                  "<span>Showing " +
                  products_found +
                  " results</span>";
            }
            frenzyAddScrollData(
              dataResults,
              dataSetting,
              dataGridHtml,
              total_page,
              null,
              frenzy_request_id,
              frenzy_product_click,
              dataConfig,
              all_product_data
            );
            let getRawQuery = "";
            if (urlParams_Frenzy.get("q")) {
                getRawQuery = urlParams_Frenzy.get("q").replace(" ", "+");
            }
            const createQueryString = (data) => {
                return Object.keys(data)
                  .map((key) => {
                      let val = data[key];
                      if (val !== null && typeof val === "object")
                          val = createQueryString(val);
                      return `${key}=${encodeURIComponent(`${val}`)}`;
                  })
                  .join("&");
            };
            let urlfilterArray = filterArray_Frenzy;
            if (
              filterArray_Frenzy?.org_price?.min == FRENZY_MIN_PRICE &&
              filterArray_Frenzy?.org_price?.max == FRENZY_MAX_PRICE
            ) {
                delete urlfilterArray.org_price;
            }
            const obj_filters = data.data.results.filters;
            const obj_facet_fields = data.data.results.facet_fields;
            Object.keys(obj_filters).map((key, index) => {
                if (obj_facet_fields[key] && key != "org_price") {
                    filterArray_Frenzy[key] = [];
                    (obj_filters[key] || []).map((x, i) => {
                        filterArray_Frenzy[key].push(x);
                    });
                }
            });
            let urlCreateQuery = createQueryString(urlfilterArray);
            var c_page = page_no > 0 ? page_no : 0;
            old_dataResults = old_dataResults.concat(data.data.results.results);
            var his_data = {
                ...data.data,
                results: { ...data.data.results, results: old_dataResults },
            };
            var SessionData = {
                frenzycollectdata: his_data,
                frenzypageNo: c_page,
                url: window.location.href,
                position: current_position,
                country:Shopify.country,
                requestURL: productSession_url
            };
            sessionStorage.setItem("frenzy-session", JSON.stringify(SessionData));
            setTimeout(function () {
                if (page_no < total_page - 1) {
                    frenzyPageScroll = true;
                }
            }, 500);
            if (document.querySelector(".frenzyScrollLoader")) {
                document.querySelector(".frenzyScrollLoader").remove();
            }
        }
    }
};
const searchPageScrollApi = async (page_no) => {
    let productRequestURL = '';
    let productSession_url = "";
    let get_session_product_current_url =sessionStorage.getItem("frenzy-session");
    if (get_session_product_current_url != null) {
        get_session_product_current_url = JSON.parse(get_session_product_current_url);
        productSession_url = get_session_product_current_url.requestURL;
    }
    let frenzy_search_page_section_config = get_frenzy_search_page_section.getAttribute("data-config_id") ? get_frenzy_search_page_section.getAttribute("data-config_id") : '';
    if (typeof frenzyAnimationCallBack == "function") {
        document.getElementById("frenzyProductList").innerHTML +=
          '<div class="frenzyScrollLoader">' +
          frenzyAnimationCallBack() +
          "</div>";
    } else {
        document.getElementById("frenzyProductList").innerHTML +=
          '<div class="frenzyScrollLoader"><span class="frenzyLoaderLine"></span></div>';
    }
    search_query = new URL(window.location.href).searchParams.get("q");
    useSpellCheckParam = new URL(window.location.href).searchParams.get("use_spell_check");

    if (useSpellCheckParam == "false") {
        useSpellCheck = false;
    }

    let mode = 1;
    if (page_no != 0) {
        mode = 2;
    }
    let frenzy_filter_data_json = {
        raw_query: search_query,
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        shop: frenzyShop,
        mode: mode,
        page_index: page_no > 0 ? page_no : 0,
        use_spell_check: useSpellCheck,
        config_id:frenzy_search_page_section_config,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    };

    filter_query = [];
    filter_query.splice(0, (filter_query.length + 1))
    Object.entries(filterArray_Frenzy || {}).map((x, i) => {
        if (x[0] === "org_price") {
            if (x[1].min || x[1].min == 0) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + ">" + x[1].min,
                });
            }
            if (x[1].max) {
                filter_query.push({
                    key: "filters=",
                    value: x[0] + "<" + x[1].max,
                });
            }
        } else {
            (x[1] || []).map((y, z) => {
                filter_query.push({ key: "filters=", value: x[0] + ":" + encodeURIComponent(y) });
            });
        }
    });
    frenzy_filter_data_json = Object.entries(frenzy_filter_data_json)
      .map((e) => e.join("="))
      .join("&");
    let params = "";
    if (page_no != 0) {
        filter_query.forEach((filter) => {
            params += "&" + filter.key + filter.value;
        });
    }
    productRequestURL = authUrl_Frenzy + '/search?' + frenzy_filter_data_json + params;
    if(productRequestURL == productSession_url && controlPageRefresh != true){
        revert_data(get_session_product_current_url);
        frenzyAsyncItems();
    }else{
        const response = await fetch(productRequestURL,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "x-frenzy-authorization": frenzy_api_key,
                  "X-Shop": frenzyShop
              },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
            dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
            const dataResults = data.data.results.results;
            const dataSetting = data.data.search_page;
            const dataGridHtml = data.data.recommendation_html;
            const total_page = data.data.results.page_count;
            const corrected_query = data.data.results.corrected_query;
            const products_found = data.data.results.products_found;
            const frenzy_request_id = data.data.results.request_id;
            const frenzy_product_click = "search";
            const obj_filters = data.data.results.filters;
            const obj_facet_fields = data.data.results.facet_fields;
            const all_product_data = data.data;
            // useSpellCheck = data.data.results.use_spell_check;

            // if (useSpellCheck == false) {
            //     const url = new URL(window.location);
            //     url.searchParams.set('use_spell_check', 'false');
            //     window.history.pushState({}, '', url);
            // }

            total_num_page = total_page;
            Object.keys(obj_filters).map((key, index) => {
                if (obj_facet_fields[key] && key != "org_price") {
                    filterArray_Frenzy[key] = [];
                    (obj_filters[key] || []).map((x, i) => {
                        filterArray_Frenzy[key].push(x);
                    });
                }
            });
            selected_page_Frenzy = page_no + 1;
            if (document.querySelector(".frenzy_topbar_count_col")) {
                document.querySelector(".frenzy_topbar_count_col").innerHTML =
                  "<span>Showing " +
                  products_found +
                  " results</span>";
            }
            frenzyAddScrollData(
              dataResults,
              dataSetting,
              dataGridHtml,
              total_page,
              corrected_query,
              frenzy_request_id,
              frenzy_product_click,
              dataConfig,
              all_product_data
            );
            let getRawQuery = "";
            if (urlParams_Frenzy.get("q")) {
                getRawQuery = urlParams_Frenzy.get("q").replace(" ", "+");
            }
            const createQueryString = (data) => {
                return Object.keys(data)
                  .map((key) => {
                      let val = data[key];
                      if (val !== null && typeof val === "object")
                          val = createQueryString(val);
                      return `${key}=${encodeURIComponent(`${val}`)}`;
                  })
                  .join("&");
            };
            let urlfilterArray = filterArray_Frenzy;
            if (
              filterArray_Frenzy?.org_price?.min == FRENZY_MIN_PRICE &&
              filterArray_Frenzy?.org_price?.max == FRENZY_MAX_PRICE
            ) {
                delete urlfilterArray.org_price;
            }
            let urlCreateQuery = createQueryString(urlfilterArray);
            var c_page = page_no > 0 ? page_no : 0;
            old_dataResults = old_dataResults.concat(data.data.results.results);
            var his_data = {
                ...data.data,
                results: { ...data.data.results, results: old_dataResults },
            };
            var SessionData = {
                frenzycollectdata: his_data,
                frenzypageNo: c_page,
                url: window.location.href,
                country:Shopify.country,
                requestURL: productSession_url
            };
            sessionStorage.setItem("frenzy-session", JSON.stringify(SessionData));
            setTimeout(function () {
                if (page_no < total_page - 1) {
                    frenzyPageScroll = true;
                }
            }, 500);
          if(document.querySelector(".frenzyScrollLoader")){
            document.querySelector(".frenzyScrollLoader").remove();
          }
        }
        frenzyPageScrollNo = page_no;
    }
};
function frenzyAddScrollData(
  dataResults,
  dataSetting,
  dataGridHtml,
  total_page,
  corrected_query,
  frenzy_request_id,
  frenzy_product_click,
  dataConfig,
  all_product_data
) {
    let frenzyAddScrollList = "";

    const resultsPerPage = +dataSetting.results_per_page;
    let previousProductCount = resultsPerPage * (selected_page_Frenzy - 1);

    const featuredImageVisibility = dataSetting.featured_image_visibility;
    const featuredImageShowOnAllPages = dataSetting.featured_image_show_on_all_pages;
    let bannerDetails = [];    
    for( let val = 1; val <= 10; val++) { 
      if(val == 1){
        bannerDetails.push({
          'image': dataSetting['image'],
          'text': dataSetting['text'],
          'image_link': dataSetting['image_link'],
          'image_position': dataSetting['image_position'],
          'image_length': dataSetting['image_length']
        })
      }else{    
        bannerDetails.push({
          'image': dataSetting['image_'+val],
          'text': dataSetting['text_'+val],
          'image_link': dataSetting['image_link_'+val],
          'image_position': dataSetting['image_position_'+val],
          'image_length': dataSetting['image_length_'+val]
        })
      }        
    } 

    (dataResults || []).map((x, i) => {

        if (typeof FrenzyCollectionFeaturedSettingCallBack == "function") {
            const settings_schema = FrenzyCollectionFeaturedSettingCallBack();
         
            (settings_schema || []).map((bannerData, banner_key) => {
                featuredImage = bannerData.image;
                featuredText = bannerData.text;
                featuredImageLink = bannerData.image_link;
                featuredImagePosition = bannerData.image_position;
                featuredImageLength = bannerData.image_length;
              
                if(featuredImageVisibility == '1') {
                   if (featuredImageShowOnAllPages == '1') {
                     previousProductCount = 0;
                   }
                   if(featuredImage != undefined || (featuredText != undefined && featuredText != '')) {
                     if ((previousProductCount + i == featuredImagePosition - 1)) {
                       frenzyAddScrollList += getCollectionFeaturedImageElement(featuredImage, featuredText, featuredImageLink, featuredImageLength);
                     }
                   }
                }
            });
        }else{
            (bannerDetails || [] ).map((banner_value, banner_key)=>{
                const {image,text,image_link,image_position,image_length} = banner_value;
                if(featuredImageVisibility == '1') {
                    if (featuredImageShowOnAllPages == '1') {
                       previousProductCount = 0;
                    }
                    if(image != undefined || (text != undefined && text != '')) {
                       if ((previousProductCount + i == image_position - 1)) {
                         frenzyAddScrollList += getCollectionFeaturedImageElement(image, text, image_link, image_length);
                       }
                    }
                }  
            }) 
        }
        frenzyAddScrollList += getProductGridItem(
          dataGridHtml,
          x,
          dataSetting,
          frenzy_shop_currency,
          frenzy_request_id,
          frenzy_product_click,
          dataConfig
        );
    });
    document.getElementById("frenzyProductList").innerHTML +=
      frenzyAddScrollList;
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
}
function frenzyAutoScroll() {
    let frenzyAutoLoadTop = "";
    if (document.getElementById("frenzyAutoLoad")) {
        frenzyAutoLoadTop = document.getElementById("frenzyAutoLoad").offsetTop;
    }
    let frenzyScrollPosition = 0;
    document.addEventListener("scroll", (e) => {
        setTimeout(function () {
            current_position = window.scrollY;
            let get_session_data_with_current_url =
              sessionStorage.getItem("frenzy-session");
            if (get_session_data_with_current_url != null) {
                get_session_data_with_current_url = JSON.parse(
                  get_session_data_with_current_url
                );
                get_session_data_with_current_url.position = current_position;
                sessionStorage.setItem(
                  "frenzy-session",
                  JSON.stringify(get_session_data_with_current_url)
                );
            }
        }, 1000);
        frenzyScrollPosition = window.scrollY;
        window.requestAnimationFrame(() => {
            if (document.getElementById("frenzyAutoLoad")) {
                frenzyAutoLoadTop =
                  document.getElementById("frenzyAutoLoad").offsetTop;
            }
            const frenzyDocHeight = frenzyScrollPosition + window.innerHeight;
            if (
              frenzyAutoLoadTop < frenzyDocHeight &&
              frenzyPageScroll &&
              previous_status
            ) {
                frenzyPageScroll = false;
                frenzyPageScrollNo = frenzyPageScrollNo + 1;
                if (get_frenzy_search_page_section) {
                    searchPageScrollApi(frenzyPageScrollNo);
                }
                if (get_frenzy_collection_page_section) {
                    collectionsPageScrollApi(frenzyPageScrollNo);
                }
            }
            previous_status = true;
        });
    });
}
function frenzyPaginationScroll() {
    document.addEventListener("scroll", (e) => {
        setTimeout(function () {
            current_position = window.scrollY;
            let get_session_data_with_current_url =
              sessionStorage.getItem("frenzy-session");
            if (get_session_data_with_current_url != null) {
                get_session_data_with_current_url = JSON.parse(
                  get_session_data_with_current_url
                );
                get_session_data_with_current_url.position = current_position;
                sessionStorage.setItem(
                  "frenzy-session",
                  JSON.stringify(get_session_data_with_current_url)
                );
            }
        }, 1000);
    });
}
/* Blog Page */
if (__st.p === "blog") {
    const frenzy_blogurl_path = window.location.pathname;
    let frenzy_blog_handle = frenzy_blogurl_path.split("/")[2];
    frenzyBlogfilterArray.push(frenzy_blog_handle);
}
let get_frenzy_blog_page_section = document.querySelector(".frenzy_blog_page");
const getBlogPageApi = async (page_no, frenzy_url_push) => {
    document.querySelector("body").scrollIntoView({ behavior: "smooth" });
    if (typeof frenzyAnimationCallBack == "function") {
        document
          .querySelector(".frenzy_blog_page")
          .insertAdjacentHTML(
            "beforeend",
            '<div class="frenzyPreloader">' +
            frenzyAnimationCallBack() +
            "</div>"
          );
    } else {
        document
          .querySelector(".frenzy_blog_page")
          .insertAdjacentHTML(
            "beforeend",
            '<div class="frenzyPreloader"><div id="loading-bar-spinner"><span class="spinner-icon"></span></div></div>'
          );
    }
    var data_json = JSON.stringify({
        sort: isSeletedSortValue_Frenzy,
        shop: frenzyShop,
        page_index: page_no,
        raw_query: frenzy_blog_search,
        filters: { "blog name": frenzyBlogfilterArray },
    });
    const response = await fetch(authUrl_Frenzy + "/article", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    const articleData = data.data.article;
    const articleCss = data.data.article_css;
    const articleHtml = data.data.article_grid;
    const articleResults = data.data.results?.results;
    const total_record = data.data.results?.products_found
      ? data.data.results.products_found
      : 0;
    const total_page = data.data.results?.page_count
      ? data.data.results.page_count
      : 0;
    const blog_name = data.data.results?.facet_fields?.blog_name;
    let frenzyBlogNameUrl = encodeURIComponent(frenzyBlogfilterArray);
    if (frenzy_url_push) {
        if (frenzy_blog_search != "") {
            window.history.pushState(
              {},
              "",
              shopURL_Frenzy +
              searchURL_Frenzy +
              "?" +
              "filterchange=true&blogname=" +
              frenzyBlogNameUrl +
              "&page=" +
              selected_page_Frenzy +
              "&articleSearch=" +
              frenzy_blog_search +
              "&sort=" +
              isSeletedSortValue_Frenzy
            );
        } else {
            window.history.pushState(
              {},
              "",
              shopURL_Frenzy +
              searchURL_Frenzy +
              "?" +
              "filterchange=true&blogname=" +
              frenzyBlogNameUrl +
              "&page=" +
              selected_page_Frenzy +
              "&sort=" +
              isSeletedSortValue_Frenzy
            );
        }
    }
    getBlogPage(
      articleData,
      articleHtml,
      articleResults,
      total_record,
      total_page,
      blog_name,
      frenzy_url_push
    );
    if (is_frenzy_page_css) {
        let cssdata =
          ".frenzy_article_item figure{border-color:" +
          articleCss.card_border_color +
          ";} " +
          ".frenzy_article_item .frenzy_article_item_detail .frenzy_article_title{color:" +
          articleCss.title_color +
          ";font-size:" +
          articleCss.title_font_size +
          "px}" +
          ".frenzy_article_item .frenzy_article_item_detail .frenzy_article_title a{color:" +
          articleCss.title_color +
          ";}" +
          ".frenzy_article_item .frenzy_article_meta .frenzy_article_date{color:" +
          articleCss.date_color +
          ";font-size:" +
          articleCss.date_font_size +
          "px}" +
          ".frenzy_article_item .frenzy_article_item_detail .frenzy_article_text,.frenzy_article_item .frenzy_article_item_detail .frenzy_article_text p{color:" +
          articleCss.text_color +
          ";font-size:" +
          articleCss.text_font_size +
          "px}" +
          ".frenzy_topbar_contain .frenzy_blog_title{color:" +
          articleCss.topbar_text_color +
          ";font-size:" +
          articleCss.page_title_font_size +
          "px}" +
          ".frenzy_topbar_contain::before{background-color:" +
          articleCss.topbar_border_color +
          "}" +
          ".frenzy_topbar_contain select.frenzy_sorting_btn {color: " +
          articleCss.seleted_text_color +
          ";background-color: " +
          articleCss.seleted_bg_color +
          ";}" +
          ".frenzy_flex_contain_area .frenzy_pagination_nav .pagination{background-color:" +
          articleCss.pagination_bg_color +
          ";border-color:" +
          articleCss.pagination_border_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain{border-color:" +
          articleCss.pagination_border_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain a, .frenzy_pagination_nav .frenzy_pagination_contain i{color:" +
          articleCss.pagination_text_color +
          "}" +
          ".frenzy_pagination_nav button.frenzy_pagination_btn svg{fill:" +
          articleCss.pagination_text_color +
          "}" +
          ".frenzy_pagination_nav .frenzy_pagination_contain a.current, .frenzy_pagination_nav button.frenzy_pagination_btn:hover{background-color:" +
          articleCss.pagination_seleted_bg_color +
          ";color:" +
          articleCss.pagination_seleted_text_color +
          "}" +
          ".frenzy_pagination_nav button.frenzy_pagination_btn:hover svg{fill:" +
          articleCss.pagination_seleted_text_color +
          "}" +
          ".frenzy_blog_page .frenzy_blog_banner{background-color:" +
          articleCss.search_bg_color +
          "}" +
          ".frenzy_blog_page .frenzy_blog_banner .frenzy_blog_banner_title{color:" +
          articleCss.search_title_color +
          ";font-size:" +
          articleCss.search_title_font_size +
          "px}" +
          ".frenzy_blog_page .frenzy_blog_banner .frenzy_search_form{background-color:" +
          articleCss.search_input_bg_color +
          "}" +
          ".frenzy_blog_page .frenzy_blog_banner .frenzy_search_form input{border-color:" +
          articleCss.search_input_border_color +
          ";color:" +
          articleCss.search_input_text_color +
          "}" +
          ".frenzy_blog_page .frenzy_blog_banner .frenzy_search_form button svg{fill:" +
          articleCss.search_input_text_color +
          "}";
        if (articleData.image_border_show == "0") {
            cssdata += ".frenzy_article_item figure{border:none !important;}";
        }
        let head = document.head || document.getElementsByTagName("head")[0],
          style = document.createElement("style");
        head.appendChild(style);
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = cssdata;
        } else {
            style.appendChild(document.createTextNode(cssdata));
        }
        is_frenzy_page_css = false;
    }
};
function getBlogPage(
  articleData,
  articleHtml,
  articleResults,
  total_record,
  total_page,
  blog_name,
  frenzy_url_push
) {
    const frenzy_blog_title =
      get_frenzy_blog_page_section.getAttribute("data-title");
    let frenzyBlogList = "";
    (articleResults || []).map((x, i) => {
        frenzyBlogList += getBlogGridWidget(articleHtml, x, articleData);
    });
    let frenzyArticlePageHtml = "";
    const frenzy_blogQueryText =
      frenzy_blog_search != "" ? frenzy_blog_search : "Query";
    if (total_record <= 0) {
        frenzyBlogList =
          '<div class="resultNotFoundText">We are sorry, but no results were found for: "' +
          frenzy_blogQueryText +
          '"</div>';
    }
    if (articleData.search_section == "1") {
        frenzyArticlePageHtml += '<div class="frenzy_blog_banner">';
        frenzyArticlePageHtml += '<div class="frenzy_container">';
        frenzyArticlePageHtml +=
          '<h1 class="frenzy_blog_banner_title">' +
          articleData.search_title +
          "</h1>";
        frenzyArticlePageHtml += '<div class="frenzy_search_form">';
        frenzyArticlePageHtml +=
          '<input type="text" class="frenzyArticleSearch" value="' +
          frenzy_blog_search +
          '" name="frenzyArticleSearch" placeholder="' +
          articleData.search_placeholder +
          '">';
        frenzyArticlePageHtml +=
          '<button type="submit" class="frenzyArticleSearchBtn">' +
          search_icon_Frenzy +
          "</button>";
        frenzyArticlePageHtml += "</div>";
        if (__st.p !== "blog") {
            frenzyArticlePageHtml += '<ul class="frenzy_blog_category_view">';
            (blog_name || []).map((x) => {
                let is_checked_val = "";
                if (frenzyBlogfilterArray) {
                    if (frenzyBlogfilterArray.includes(x[0])) {
                        is_checked_val = "checked";
                    }
                }
                frenzyArticlePageHtml +=
                  '<li class="frenzy_bc_list"><label for="frenzy_bc_' +
                  x[0] +
                  '" data-value="' +
                  x[0] +
                  '" class="frenzy_bc_checkbox">';
                frenzyArticlePageHtml +=
                  '<input id="frenzy_bc_' +
                  x[0] +
                  '" class="frenzy_bc_value" type="checkbox" ' +
                  is_checked_val +
                  ' value="' +
                  x[0] +
                  '" /><span class="frenzy_bc_label">' +
                  x[0] +
                  "</span>";
                frenzyArticlePageHtml += "</label></li>";
            });
            frenzyArticlePageHtml += "</ul>";
        }
        frenzyArticlePageHtml += "</div>";
        frenzyArticlePageHtml += "</div>";
    }
    frenzyArticlePageHtml +=
      '<div class="frenzy_container"><div class="frenzy_flex_contain_area">';
    frenzyArticlePageHtml += '<div class="frenzy_topbar_contain">';
    frenzyArticlePageHtml +=
      '<div class="frenzy_topbar_title_col"><h1 class="frenzy_blog_title">' +
      frenzy_blog_title +
      "</h1></div>";
    if (articleData.sort == "1") {
        frenzyArticlePageHtml +=
          '<div class="frenzy_topbar_sorting_col"><label class="sorting_label">Sort By</label><select name="frenzy_sorting" class="frenzy_sorting_btn">';
        frenzyArticlePageHtml +=
          '<option value="best match" ' +
          (isSeletedSortValue_Frenzy == "best match" ? "selected" : "") +
          ">Best Match</option>";
        frenzyArticlePageHtml +=
          '<option value="newest" ' +
          (isSeletedSortValue_Frenzy == "newest" ? "selected" : "") +
          ">Newest</option>";
        frenzyArticlePageHtml +=
          '<option value="oldest" ' +
          (isSeletedSortValue_Frenzy == "oldest" ? "selected" : "") +
          ">Oldest</option>";
        frenzyArticlePageHtml += "</select></div>";
    }
    frenzyArticlePageHtml += "</div>";
    frenzyArticlePageHtml +=
      '<div class="frenzy_blog_page_contain frenzy_product_row layout_type_grid ltg_' +
      articleData.grid_items_per_row +
      '">' +
      frenzyBlogList +
      "</div>";
    if (1 < total_page) {
        frenzyArticlePageHtml +=
          '<div class="frenzy_pagination_nav"><div class="pagination" id="pagination"></div></div>';
    }
    frenzyArticlePageHtml += "</div></div>";
    get_frenzy_blog_page_section.innerHTML = frenzyArticlePageHtml;
    total_page_no_Frenzy = total_page;
    if (1 < total_page) {
        init_Frenzy(total_page);
    }
    // Blog Filter sort
    document
      .querySelectorAll(".frenzy_sorting_btn")
      .forEach(function (this_click) {
          this_click.addEventListener("change", function (event) {
              isSeletedSortValue_Frenzy = event.target.value;
              selected_page_Frenzy = 1;
              getBlogPageApi(selected_page_Frenzy - 1, true);
          });
      });
    // Blog search in enter click
    document
      .querySelector(".frenzyArticleSearch")
      .addEventListener("keyup", (e) => {
          e.preventDefault();
          if (e.keyCode === 13) {
              frenzy_blog_search = document.querySelector(
                ".frenzyArticleSearch"
              ).value;
              selected_page_Frenzy = 1;
              getBlogPageApi(0, true);
          }
      });
    // Blog search in btn click
    document
      .querySelectorAll(".frenzyArticleSearchBtn")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              frenzy_blog_search = document.querySelector(
                ".frenzyArticleSearch"
              ).value;
              selected_page_Frenzy = 1;
              getBlogPageApi(0, true);
          });
      });
    // Filter click
    document
      .querySelectorAll(".frenzy_bc_checkbox")
      .forEach(function (this_click) {
          this_click.addEventListener("change", function (event) {
              let filterValue = this_click.getAttribute("data-value");
              let index = frenzyBlogfilterArray.findIndex(
                (x) => x === filterValue
              );
              if (index === -1) {
                  frenzyBlogfilterArray.push(filterValue);
              } else {
                  frenzyBlogfilterArray.splice(index, 1);
              }
              setTimeout(function () {
                  selected_page_Frenzy = 1;
                  getBlogPageApi(0, true);
                  document
                    .querySelector("body")
                    .classList.remove("is-open-filter");
              }, 500);
              selected_page_Frenzy = 1;
          });
      });
}
function getBlogGridWidget(articleHtml, record, articleData) {
    let blog_grid_html = articleHtml;
    let main_grid_image =
      "https://frenzy.cdn.appdomain.cloud/frenzy-plugin/placeholder_img.jpg";
    if (record && record.org_image_url) {
        main_grid_image = record.org_image_url;
    }
    const org_description = record.org_description;
    let frenzy_div = document.createElement("div");
    frenzy_div.innerHTML = org_description;
    let frenzy_blog_text = frenzy_div.textContent || frenzy_div.innerText || "";
    if (frenzy_blog_text.length > 200) {
        frenzy_blog_text = frenzy_blog_text.substring(0, 200) + "...";
    } else {
        frenzy_blog_text = frenzy_blog_text;
    }
    let grid_text_align =
      articleData.grid_align_text === "1"
        ? "text_align_left"
        : articleData.grid_align_text === "2"
        ? "text_align_right"
        : "text_align_center";
    const article_created_at = new Date(
      record.prod_data_creation_date
    ).toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    blog_grid_html =
      '<div class="frenzy_grid ' + grid_text_align + '">' + blog_grid_html;
    blog_grid_html = blog_grid_html.replaceAll(
      "[[article_image]]",
      main_grid_image
    );
    blog_grid_html = blog_grid_html.replaceAll(
      "[[article_title]]",
      record.org_product
    );
    blog_grid_html = blog_grid_html.replaceAll(
      "[[article_url]]",
      record.org_prod_url
    );
    blog_grid_html = blog_grid_html.replaceAll(
      "[[article_content]]",
      "<p>" + frenzy_blog_text + "</p>"
    );
    blog_grid_html = blog_grid_html.replaceAll(
      "[[article_created_at]]",
      article_created_at
    );
    blog_grid_html = blog_grid_html + "</div>";
    return blog_grid_html;
}
/* Events Api */
const frenzyClickEventsApi = async (sku, event_name, query_id) => {
    var data_json = JSON.stringify({
        sku: sku,
        event_name: event_name + "_product_click",
        query_id: query_id,
        user_id: user_id_Frenzy.toString(),
        shop: frenzyShop,
    });
    const response = await fetch(authUrl_Frenzy + "/events", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
        keepalive: true,
    });
    const data = await response.json();
};
/* Events Click */
function frenzyEventsClick(this_click) {
    const dataSku = this_click.getAttribute("data-sku");
    let dataName = this_click.getAttribute("data-name");
    const dataRequestId = this_click.getAttribute("data-request_id");
    if(dataName == 'suggest_search'){
        if(frenzysearchSugesstionQuery == ''){
            dataName = 'default_suggest_search';
        }
    }
    frenzyClickEventsApi(dataSku, dataName, dataRequestId);
    return false;
}
/* Add to cart Events */
function frenzyAddToCartEvent(this_click) {
    const frenzy_button_spinner =
      '<span class="frenzy_loading_spinner"><svg class="spinner" viewBox="0 0 66 66"><circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></span>';
    this_click.insertAdjacentHTML("beforeend", frenzy_button_spinner);
    const frenzyProductSku = this_click.getAttribute("data-sku");
    const frenzyRequestId = this_click.getAttribute("data-request_id");
    const frenzyRedirect = this_click.getAttribute("data-redirect");
    const frenzyVariantId =
      frenzyProductSku &&
      frenzyProductSku.split("_") &&
      frenzyProductSku.split("_")[1];
    dataPageName = this_click.getAttribute("data-name");
    request_id = this_click.getAttribute("data-request_id");
    dataConfig = this_click.getAttribute("data-config_id");
    if(frenzysearchSugesstionQuery == ''){
        if(dataPageName == "suggest_search"){
            dataPageName = 'default_suggest_search';
        }
    }
    if (__st.p == "searchresults") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        } else {
            source = {
                query: new URL(window.location.href).searchParams.get("q"),
                filters: filterArray_Frenzy,
                page: dataPageName,
            };
        }
    } else if (__st.p == "collection") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        } else {
            source = { filters: filterArray_Frenzy, page: dataPageName };
        }
    } else if (__st.p == "home") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        }else{
            source = {};
        }
    } else if (__st.p == "product") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        }else{
            source = { sku: product_id_Frenzy + "_" + variant_id_Frenzy };
        }
    } else {
        source = { sku: frenzyProductSku };
    }
    frenzyAddCartItems(
      frenzyVariantId,
      "1",
      frenzyProductSku,
      frenzyRequestId,
      frenzyRedirect,
      dataPageName,
      source,
      dataConfig
    );
    if (this_click.closest(".frenzy_cart_popup_section")) {
        sessionStorage.setItem("hide_carousel_after_cart", "1");
    }
}
/* Quick Add Events */
function frenzyQuickAddEvent(this_click) {
    this_click.classList.add('frenzy-loading');
    this_click
      .closest(".frenzy_product_item")
      .querySelector("button.is-active")
      ?.classList.remove("is-active");
    this_click.classList.add("is-active");
    const frenzyProductSku = this_click.getAttribute("data-sku");
    const frenzyCarouselType = this_click.getAttribute("data-name");
    const frenzyRequestId = this_click.getAttribute("data-request_id");
    const frenzyCarouselImg = this_click.getAttribute("data-image");
    const frenzyCarouselPrice = this_click.getAttribute("data-price");
    const frenzyVariantId =
      frenzyProductSku &&
      frenzyProductSku.split("_") &&
      frenzyProductSku.split("_")[1];
    dataPageName = this_click.getAttribute("data-name");
    request_id = this_click.getAttribute("data-request_id");
    dataConfig = this_click.getAttribute("data-config_id");
    if(frenzysearchSugesstionQuery == ''){
        if(dataPageName == "suggest_search"){
            dataPageName = 'default_suggest_search';
        }
    }
    if (__st.p == "searchresults") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId };
        } else {
            source = {
                query: new URL(window.location.href).searchParams.get("q"),
                filters: filterArray_Frenzy,
                page: dataPageName,
            };
        }
    } else if (__st.p == "collection") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId };
        } else {
            source = { filters: filterArray_Frenzy, page: dataPageName };
        }
    } else if (__st.p == "home") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        }else{
            source = {};
        }
    } else if (__st.p == "product") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        }else{
            source = { sku: product_id_Frenzy + "_" + variant_id_Frenzy };
        }
    } else {
        source = { sku: frenzyProductSku };
    }
    if (frenzyCarouselType === "add_cart") {
        if (
          this_click.closest(".frenzy_variant_option.frenzy_vp_all_options")
        ) {
            if (
              this_click
                .closest(".frenzy_product_item")
                .querySelector("img.frenzy_img_first")
            ) {
                this_click
                  .closest(".frenzy_product_item")
                  .querySelector("img.frenzy_img_first").src =
                  frenzyCarouselImg;
            }
            this_click
              .closest(".frenzy_product_item")
              .querySelectorAll(".frenzy_product_price_sale")
              .forEach(function (this_price) {
                  this_price.innerHTML =
                    '<span class="money">' +
                    money_format_Frenzy(
                      frenzyCarouselPrice,
                      frenzy_shop_currency
                    ) +
                    "</span>";
              });
        }
        this_click
          .closest(".frenzy_product_item")
          .querySelectorAll(".frenzy_auickAdd_cart")
          .forEach(function (add_val, add_idx) {
              add_val.setAttribute("data-sku", frenzyProductSku);
              add_val.disabled = false;
          });
    } else {
        frenzyAddCartItems(
          frenzyVariantId,
          "1",
          frenzyProductSku,
          frenzyRequestId,
          0,
          dataPageName,
          source,
          dataConfig
        );
    }
}
/* Select Product options  */
function frenzySelectOptionEvent(this_change) {
    let source = {};
    dataPageName = this_change.getAttribute("data-name");
    request_id = this_change.getAttribute("data-request_id");
    dataConfig = this_change.getAttribute("data-config_id");
    const frenzyProductSku = this_change.value;
    const frenzy_etp = this_change.options[this_change.options.selectedIndex];
    const frenzyCarouselType = frenzy_etp.dataset.name;
    const frenzyCarouselImg = frenzy_etp.dataset.image;
    const frenzyCarouselPrice = frenzy_etp.dataset.price;
    const frenzyRequestId = frenzy_etp.dataset.request_id;
    const frenzyVariantId =
      frenzyProductSku &&
      frenzyProductSku.split("_") &&
      frenzyProductSku.split("_")[1];
    if (__st.p == "searchresults") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId };
        } else {
            source = {
                query: new URL(window.location.href).searchParams.get("q"),
                filters: filterArray_Frenzy,
                page: dataPageName,
            };
        }
    } else if (__st.p == "collection") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId };
        } else {
            source = { filters: filterArray_Frenzy, page: dataPageName };
        }
    } else if (__st.p == "home") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        }else{
            source = {};
        }
    } else if (__st.p == "product") {
        if (dataPageName == "add_cart") {
            source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
        }else{
            source = { sku: product_id_Frenzy + "_" + variant_id_Frenzy };
        }
    } else {
        source = { sku: frenzyProductSku };
    }
    if (frenzyCarouselType === "add_cart") {
        if (
          this_change.closest(".frenzy_variant_option.frenzy_vp_all_options")
        ) {
            if (
              this_change
                .closest(".frenzy_product_item")
                .querySelector("img.frenzy_img_first")
            ) {
                this_change
                  .closest(".frenzy_product_item")
                  .querySelector("img.frenzy_img_first").src =
                  frenzyCarouselImg;
            }
            this_change
              .closest(".frenzy_product_item")
              .querySelectorAll(".frenzy_product_price_sale")
              .forEach(function (this_price) {
                  this_price.innerHTML =
                    '<span class="money">' +
                    money_format_Frenzy(
                      frenzyCarouselPrice,
                      frenzy_shop_currency
                    ) +
                    "</span>";
              });
        }
        this_change
          .closest(".frenzy_product_item")
          .querySelectorAll(".frenzy_auickAdd_cart")
          .forEach(function (add_val, add_idx) {
              add_val.setAttribute("data-sku", frenzyProductSku);
              add_val.disabled = false;
          });
    } else {
        frenzyAddCartItems(
          frenzyVariantId,
          "1",
          frenzyProductSku,
          frenzyRequestId,
          0,
          dataPageName,
          source,
          dataConfig
        );
    }
}
/* Add to cart   */
const frenzyAddCartItems = async (
  variant_id,
  qty,
  frenzyProductSku,
  query_id,
  frenzyRedirect,
  dataName,
  source,
  dataConfig
) => {
    if (dataName == "add_cart") {
        dataName = "cart_pop_up";
    }
    if (dataName == "cart") {
        dataName = "cart_page";
    }
    dataName = dataName + "_add_to_cart";
    let data_json = JSON.stringify({
        id: variant_id,
        quantity: qty,
        properties: {
            _event_name: dataName,
            _sku: frenzyProductSku,
            _query_id: query_id,
            _config_id: dataConfig,
            _user_id: user_id_Frenzy.toString(),
        },
    });
    const response = await fetch("/cart/add.js", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (data && data.id) {
        let data_json_events = JSON.stringify({
            sku: frenzyProductSku,
            event_name: "add_to_cart",
            user_id: user_id_Frenzy.toString(),
            query_id: query_id,
            shop: frenzyShop,
        });
        const response = await fetch(authUrl_Frenzy + "/events", {
            method: "POST",
            body: data_json_events,
            headers: {
                "Content-Type": "application/json",
                "x-frenzy-authorization": frenzy_api_key,
                "X-Shop": frenzyShop
            },
        });
        if (document.querySelector('.frenzy-loading')) {
            document.querySelector('.frenzy-loading').classList.remove('frenzy-loading');
        }
        document.querySelector(".frenzy_loading_spinner")?.remove();
        document.querySelector(".frenzy-modal")?.remove();
        if (frenzyRedirect == "1") {
            window.location.href = "/checkout";
        } else {
            if (typeof frenzyCartCallBack == "function") {
                getCartItems();
                frenzyCartCallBack(data);
            } else {
                window.location.href = "/cart";
            }
        }

    } else {
        document.querySelector(".frenzy_loading_spinner")?.remove();
    }
};
const frenzyAddToCartEventsApi = async () => {
    const product_id = __st && __st.rid;
    const variant_id = document.querySelector('[name="id"]').value;
    var data_json = JSON.stringify({
        sku: product_id + "_" + variant_id,
        event_name: "add_to_cart",
        user_id: user_id_Frenzy.toString(),
        shop: frenzyShop
    });
    const response = await fetch(authUrl_Frenzy + "/events", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
};
function frenzyAsyncItems() {
    setTimeout(function () {
        getCartItems();
    }, 1000);
}

/*QuickView New */
let frenzyQuickViewRequestId = "",
  frenzySwiperGallery = "",
  frenzySwiperThumbs = "";
const frenzyQuickView = async (this_click) => {
    const frenzyQuickViewHandle = this_click.getAttribute("data-handle");
    frenzyQuickViewRequestId = this_click.getAttribute("data-request_id");
    const pre_frenzyQuickViewHandle =  frenzyQuickViewHandle.split('?');
    let QucikviewString = '?view=frenzy-quickview';
    if(pre_frenzyQuickViewHandle[1] != undefined){
        QucikviewString = "&view=frenzy-quickview";
    }
    const frenzyQVHUrl =
      frenzy_root_url + Shopify.routes.root + "products/" + frenzyQuickViewHandle + QucikviewString;
    dataConfig = this_click.getAttribute("data-config_id");
    dataPageName = this_click.getAttribute("data-name");
    request_id = frenzyQuickViewRequestId;
    frenzyQuickViewGetPage(frenzyQVHUrl);
};
const frenzyQuickViewGetPage = async (theUrl) => {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();

    document
      .querySelector("body")
      .insertAdjacentHTML("beforeend", xmlhttp.responseText);
    let frenzy_quick_product_feed = null;
    if (document.querySelector("#frenzy_procut_feed_data")) {
        frenzy_quick_product_feed = JSON.parse(
          document.querySelector("#frenzy_procut_feed_data").innerHTML
        );
    }
    document
      .querySelectorAll(".frenzyModalCloseTrigger ")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              document.querySelector(".frenzy-modal").remove();
          });
      });
    if(document
      .querySelectorAll(".frenzy-osb-button").length > 0){
        document
          .querySelectorAll(".frenzy-osb-button")
          .forEach(function (this_click) {
              this_click.addEventListener("click", function (event) {
                  let frenzyQVSOption_0 = null,
                    frenzyQVSOption_1 = null,
                    frenzyQVSOption_2 = null;
                  const active = this_click.closest(".frenzy-option-fieldset").querySelector(".is-selected-btn");
                  if (active) {
                      active.classList.remove("is-selected-btn");
                  }
                  this_click.classList.add("is-selected-btn");
                  document
                    .querySelectorAll(".frenzy-option-fieldset")
                    .forEach(function (this_chack, index) {
                        const frenzy_select_option_index =
                          this_chack.querySelector('.frenzy-osb-button.is-selected-btn').getAttribute('data-value');
                        const frenzyThisOption = this_chack.querySelector('.frenzy-osb-button.is-selected-btn').getAttribute('data-option');
                        if (frenzyThisOption == "0") {
                            frenzyQVSOption_0 = frenzy_select_option_index;
                        } else if (frenzyThisOption == "1") {
                            frenzyQVSOption_1 = frenzy_select_option_index;
                        } else {
                            frenzyQVSOption_2 = frenzy_select_option_index;
                        }
                    });
                  const frenzyIndex = (
                    frenzy_quick_product_feed?.variants || []
                  ).findIndex(
                    (x) =>
                      x?.option1 === frenzyQVSOption_0 &&
                      x?.option2 === frenzyQVSOption_1 &&
                      x?.option3 === frenzyQVSOption_2
                  );
                  if (frenzyIndex !== -1) {
                      document
                        .querySelector(".frenzyQuickViewAddToCart")
                        .setAttribute(
                          "data-id",
                          frenzy_quick_product_feed.variants[frenzyIndex].id
                        );
                      if (
                        frenzy_quick_product_feed.variants[frenzyIndex]
                          .available
                      ) {
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).innerText = "Add to cart";
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).disabled = false;
                      } else {
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).innerText = "Out of Stock";
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).disabled = true;
                      }
                  }
                  const frenzyColorImage =
                    frenzy_quick_product_feed?.variants[frenzyIndex]
                      ?.featured_image?.src;
                  if (frenzyColorImage) {
                      const frenzyMediaIndex = (
                        frenzy_quick_product_feed?.media || []
                      ).findIndex((x) => x?.src === frenzyColorImage);
                      frenzySwiperGallery.slideTo(frenzyMediaIndex);
                      frenzySwiperThumbs.slideTo(frenzyMediaIndex);
                  }
              });
          });
    }
    if(document.querySelectorAll(".frenzy-osb-input").length > 0){
        document
          .querySelectorAll(".frenzy-osb-input")
          .forEach(function (this_click) {
              this_click.addEventListener("change", function (event) {
                  let frenzyQVSOption_0 = null,
                    frenzyQVSOption_1 = null,
                    frenzyQVSOption_2 = null;
                  document
                    .querySelectorAll(".frenzy-option-fieldset")
                    .forEach(function (this_chack, index) {
                        const frenzy_select_option_index =
                          this_chack.querySelector("input:checked").value;
                        const frenzyThisOption = this_chack
                          .querySelector("input:checked")
                          .getAttribute("data-option");
                        if (frenzyThisOption == "0") {
                            frenzyQVSOption_0 = frenzy_select_option_index;
                        } else if (frenzyThisOption == "1") {
                            frenzyQVSOption_1 = frenzy_select_option_index;
                        } else {
                            frenzyQVSOption_2 = frenzy_select_option_index;
                        }
                    });
                  const frenzyIndex = (
                    frenzy_quick_product_feed?.variants || []
                  ).findIndex(
                    (x) =>
                      x?.option1 === frenzyQVSOption_0 &&
                      x?.option2 === frenzyQVSOption_1 &&
                      x?.option3 === frenzyQVSOption_2
                  );

                  if (frenzyIndex !== -1) {
                      document
                        .querySelector(".frenzyQuickViewAddToCart")
                        .setAttribute(
                          "data-id",
                          frenzy_quick_product_feed.variants[frenzyIndex].id
                        );
                      if (
                        frenzy_quick_product_feed.variants[frenzyIndex]
                          .available
                      ) {
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).innerText = "Add to cart";
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).disabled = false;
                          if (document.querySelector('.frenzyQuickViewBuynowBtn')) {
                              document.querySelector('.frenzyQuickViewBuynowBtn').style.display = 'block';
                          }
                      } else {
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).innerText = "Sold out";
                          document.querySelector(
                            ".frenzyQuickViewAddToCart"
                          ).disabled = true;
                          if (document.querySelector('.frenzyQuickViewBuynowBtn')) {
                              document.querySelector('.frenzyQuickViewBuynowBtn').style.display = 'none';
                          }
                      }
                  }
                  const frenzyColorImage =
                    frenzy_quick_product_feed?.variants[frenzyIndex]
                      ?.featured_image?.src;
                  if (frenzyColorImage) {
                      const frenzyMediaIndex = (
                        frenzy_quick_product_feed?.media || []
                      ).findIndex((x) => x?.src === frenzyColorImage);
                      frenzySwiperGallery.slideTo(frenzyMediaIndex);
                      frenzySwiperThumbs.slideTo(frenzyMediaIndex);
                  }
              });
          });
    }

    document.querySelectorAll('.sd__button')?.forEach(function(this_click){
        this_click.addEventListener("click", (e) => {
            var old_value = this_click.closest('.sd__quantity').querySelector('.frenzy_quantity-input').value;
            var newQty = old_value;
            if(this_click.getAttribute('data-type') == 'plus'){
                newQty = parseFloat(old_value) + 1;
            }else{
                if (old_value > 1) {
                    newQty = parseFloat(old_value) - 1;
                } else {
                    newQty = 1;
                }
            }
            this_click.closest('.sd__quantity').querySelector('.frenzy_quantity-input').value = newQty;
        });
    });

    const CheckoutAddtoCart = async(data_json) => {
        const response = await fetch("/cart/add", {
            method: "POST",
            body: data_json,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        window.location.href = "/checkout";
    }

    document.querySelector('.frenzyQuickViewBuynowBtn')?.addEventListener('click', function(){
        var id = document.querySelector(".frenzyQuickViewAddToCart") ? document.querySelector(".frenzyQuickViewAddToCart").getAttribute('data-id') : '';
        var qty =  document.querySelector('.frenzy_quantity-input').value;
        const data_json  = new FormData();
        data_json.append('variantId', id);
        data_json.append('quantity', qty);
        var url = window.location.origin+'/cart/'+id+':'+qty;
        window.open(url,'_blank');
    });

    document
      .querySelector(".frenzyQuickViewAddToCart")
      ?.addEventListener("click", (e) => {
          let source = {};

          const frenzy_button_spinner =
            '<span class="frenzy_loading_spinner"><svg class="spinner" viewBox="0 0 66 66"><circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></span>';
          const frenzyVariantId = e.target
            .closest(".frenzyQuickViewAddToCart")
            .getAttribute("data-id");
          e.target.insertAdjacentHTML("beforeend", frenzy_button_spinner);
          const frenzyProductSku =
            frenzy_quick_product_feed.id + "_" + frenzyVariantId;
          const frenzyRequestId = e.target.getAttribute("data-request_id");
          if (__st.p == "searchresults") {
              if (dataPageName == "add_cart") {
                  source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId };
              } else {
                  source = {
                      query: new URL(window.location.href).searchParams.get(
                        "q"
                      ),
                      filters: filterArray_Frenzy,
                      page: dataPageName,
                  };
              }
          } else if (__st.p == "collection") {
              if (dataPageName == "add_cart") {
                  source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId };
              } else {
                  source = {
                      filters: filterArray_Frenzy,
                      page: dataPageName,
                  };
              }
          } else if (__st.p == "home") {
              if (dataPageName == "add_cart") {
                  source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
              }else{
                  source = {};
              }
          } else if (__st.p == "product") {
              if (dataPageName == "add_cart") {
                  source = { sku: frenzyCartProductId + "_" + frenzyCartVariantId, };
              }else{
                  source = { sku: product_id_Frenzy + "_" + variant_id_Frenzy };
              }
          } else {
              source = { sku: frenzyProductSku };
          }
          var qty = document.querySelector('.frenzy_quantity-input') ? document.querySelector('.frenzy_quantity-input').value : 1;
          frenzyAddCartItems(
            frenzyVariantId,
            qty,
            frenzyProductSku,
            frenzyQuickViewRequestId,
            "quick_view_add_to_cart",
            dataPageName,
            source,
            dataConfig
          );
          product_id_Frenzy = frenzy_quick_product_feed.id;
          variant_id_Frenzy = frenzyVariantId;
          getAddCartApi();
      });
    if (document.querySelector(".frenzyThumbsSlider")) {
        document.querySelector(".frenzyThumbsSlider").style.opacity = "0";
        document.querySelector(".frenzyImageSlider").style.opacity = "0";
    }
    setTimeout(function () {
        if(document.querySelector(".frenzyThumbsSlider")){
        var thumbSliderLimit = document.querySelector(".frenzyThumbsSlider")?.getAttribute('data-limit');
        thumbSliderLimit ? thumbSliderLimit : 5;
        frenzySwiperThumbs = new Swiper(".frenzyThumbsSlider", {
            spaceBetween: 10,
            slidesPerView: thumbSliderLimit,
            freeMode: true,
            watchSlidesProgress: true,
            navigation: {
                nextEl: ".frenzyThumbsSlider .swiper-button-next",
                prevEl: ".frenzyThumbsSlider .swiper-button-prev",
            }
        });
        frenzySwiperGallery = new Swiper(".frenzyImageSlider", {
            spaceBetween: 10,
            paginationClickable: true,
            effect: "fade",
            navigation: {
                nextEl: ".frenzyImageSlider .swiper-button-next",
                prevEl: ".frenzyImageSlider .swiper-button-prev",
            },
            thumbs: {
                swiper: frenzySwiperThumbs,
            },
        });
        const frenzySeletedVariantID = document
          .querySelector(".frenzyQuickViewAddToCart")?.getAttribute("data-id");
        const frenzyFindImg = (frenzy_quick_product_feed?.variants || []).find(
          (x) => x?.id == frenzySeletedVariantID
        );
        if (frenzyFindImg?.featured_image?.src) {
            const loadFrenzyIndex = (
              frenzy_quick_product_feed?.media || []
            ).findIndex((x) => x?.src === frenzyFindImg?.featured_image?.src);
            frenzySwiperGallery.slideTo(loadFrenzyIndex);
            frenzySwiperThumbs.slideTo(loadFrenzyIndex);
        }
      }
    }, 250);
    setTimeout(function () {
        if (document.querySelector(".frenzyThumbsSlider")) {
            document.querySelector(".frenzyThumbsSlider").style.opacity = "1";
            document.querySelector(".frenzyImageSlider").style.opacity = "1";
        }
    }, 500);
    if (typeof frenzyQuickViewOpened == 'function') {
        frenzyQuickViewOpened();
    }
};
document
  .querySelectorAll(".product-form__submit")
  .forEach(function (this_click) {
      this_click.addEventListener("click", function (event) {
          setTimeout(function () {
              getCartItems();
          }, 1000);
      });
  });

/* Auto Suggest */
function frenzy_debounce(func, timeout = 100) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
let frenzy_suggest_hover = true;
let frenzy_suggest_array = [];
let frenzy_suggest_index = "0";
let frenzy_suggestion_css = "",
  frenzy_suggestion_page = "",
  frenzy_collection_suggestions = "",
  frenzy_suggestion_order = [];
let frenzyHoverCountNumber = 0,
  frenzyHoverTimeoutEvent = null;
const frenzyHoverRecuursiveEvent = function (
  this_click,
  column_number,
  setTime
) {
    if (window.frenzyHoverCountNumber >= 1) {
        if (column_number === 1) {
            suggestHoverData(this_click);
        } else {
            frenzySuggestFilterData(this_click);
        }
    } else {
        frenzyHoverTimeoutEvent = window.setTimeout(function () {
            window.frenzyHoverCountNumber++;
            frenzyHoverRecuursiveEvent(this_click, column_number);
        }, setTime);
    }
};

// Auto Suggest Click Events API Handler
const frenzyAutoSuggestClickEventsApi = async (
  event_name,
  query_title,
  query
) => {
    var data_json = JSON.stringify({
        event_name: event_name,
        user_id: user_id_Frenzy.toString(),
        [query_title]: query,
    });
    const response = await fetch(authUrl_Frenzy + "/events", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
        keepalive: true
    });
    const data = await response.json();
};

// Check mobile widget size and populate mobile search box
window.frenzyAutoSuggestWidget = async () => {
    const frenzy_query = document.querySelector('.frenzy_mobile_search input.frenzy_search_suggest')?.value || '';
    var data_json = {
        shop: frenzyShop,
        query: frenzy_query,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : '',
        company_id: frenzy_company_id || 'null',
        location_id: frenzy_location_id || 'null'
    };
    data_json = Object.entries(
      data_json
    )
      .map((e) => e.join("="))
      .join("&");
  
    const response = await fetch(authUrl_Frenzy + "/suggest?"+ data_json, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    frenzy_suggestion_page = data.suggestion_page;

    if (frenzy_suggestion_page.widget_size_mobile == "1") {
        let frenzyMobileSearchBox = document.querySelector(
          ".frenzy_mobile_search"
        );

        // Add frenzy mobile search widget if not exist
        if (!frenzyMobileSearchBox) {
            frenzyMobileSearchBox = document.createElement("div");
            frenzyMobileSearchBox.classList.add("frenzy_mobile_search");
            frenzyMobileSearchBox.classList.add("hidden");
            frenzyMobileSearchBox.innerHTML =
              '<div class="frenzy_mobile_search_box"><button type="button" class="frenzy_mobile_search_box_close_button" aria-label="Close"><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path></svg></button><form action="/search" method="get" role="search" class="frenzy_mobile_search_input_wrapper"><input class="frenzy_search_suggest" type="search" name="q" placeholder="Search" role="combobox"><div class="frenzy_mobile_search_input_clear_button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg></div></form></div><div class="frenzy-suggest-wrapper"></div>';

            document.body.append(frenzyMobileSearchBox);
        }

        // Show frenzy mobile search widget instead of theme's search widget on mobile
        frenzyMobileSearchBox = document.querySelector(".frenzy_mobile_search");
        let frenzyMobileSearchInput = frenzyMobileSearchBox.querySelector(
          ".frenzy_search_suggest"
        );
        let frenzy_auto_input = document.querySelectorAll(
          ".frenzy_search_suggest"
        );
        var getSearchSuggestionValue = sessionStorage.getItem("frenzy_search_suggestion_value");
        if(getSearchSuggestionValue){
            frenzyMobileSearchInput.value = decodeURIComponent(getSearchSuggestionValue);
        }
        frenzy_auto_input.forEach(function (this_click) {
            this_click?.addEventListener("input", function (e) {
                const searchTerm = this_click.value;
                frenzyMobileSearchInput.value = searchTerm;
                frenzyMobileSearchInput.focus();
                frenzyMobileSearchBox.classList.remove("hidden");
                if(window.innerWidth < 768){
                    document.querySelector('body').classList.add('frenzy_mobile_is_suggest');
                }
            });
        });

        // Frenzy Auto Focus suggest input event
        if(window.innerWidth < 768){
            let frenzy_search_suggest_auto_focus = document.querySelectorAll(".frenzy_search_suggest_auto_focus");
            frenzy_search_suggest_auto_focus.forEach(function(this_click){
                var seachQuery = '';
                this_click.addEventListener("focus", function(e) {
                    let frenzyMobileSearchBox = document.querySelector(".frenzy_mobile_search");
                    if(frenzy_search_suggest_is_focus){
                        frenzyMobileSearchBox.classList.remove("hidden");
                        document.querySelector('.frenzy_mobile_search .frenzy_search_suggest').focus();
                        frenzyAutoSuggestApi(this_click.value.toLowerCase());
                        seachQuery = this_click.value.toLowerCase();
                        document.querySelector('body').classList.add('frenzy_mobile_is_suggest');
                    }
                });
            });
        }



        // Frenzy moile search close button click event listener
        let frenzyMobileSearchBoxCloseButton = document.querySelector(
          ".frenzy_mobile_search_box_close_button"
        );
        frenzyMobileSearchBoxCloseButton.addEventListener("click", function () {
            frenzyMobileSearchBox.classList.add("hidden");
            document.querySelector('body').classList.remove('frenzy_mobile_is_suggest');
        });

        // Frenzy mobile search input clear button click event listener
        let frenzyMobileSearchInputClearButton = document.querySelector(
          ".frenzy_mobile_search_input_clear_button"
        );
        frenzyMobileSearchInputClearButton.addEventListener(
          "click",
          function () {
              frenzyMobileSearchBox.querySelector(
                ".frenzy_search_suggest"
              ).value = "";
              document.querySelectorAll('.frenzy_search_suggest').forEach(function(this_input){
                  sessionStorage.setItem("frenzy_search_suggestion_value","");
                  this_input.value = '';
              });
          }
        );
    }

    let searchDelay = 100;

    if (frenzy_suggestion_page.search_delay) {
        searchDelay = parseInt(frenzy_suggestion_page.search_delay);
    }

    // Frenzy Auto Suggest input event listener
    let frenzy_auto_input = document.querySelectorAll(".frenzy_search_suggest");
    frenzy_auto_input.forEach(function (this_click) {
        this_click?.addEventListener(
          "input",
          frenzy_debounce(() =>
            frenzyAutoSuggestApi(this_click.value.toLowerCase()), searchDelay
          )
        );
    });

    // Frenzy Auto Focus suggest input event
    function frenzy_auto_input_focus_event(){
        let frenzy_search_suggest_auto_focus = document.querySelectorAll(".frenzy_search_suggest_auto_focus");
        frenzy_search_suggest_auto_focus.forEach(function(this_click){
            this_click.addEventListener("focus", function() {
                if(frenzy_search_suggest_is_focus){
                    frenzyAutoSuggestApi(this_click.value.toLowerCase())
                }
            });
        });
    }
    if(window.innerWidth > 767){
        frenzy_auto_input_focus_event();
    }else{
        if(frenzy_suggestion_page.widget_size_mobile != "1"){
            frenzy_auto_input_focus_event();
        }
    }

    // Close Auto Suggest Widget on click outside
    window.addEventListener('click', ({ target }) => {
        if (!target.closest('.frenzy_search_suggest') && !target.closest('.frenzy-suggest-wrapper') && !target.closest(frenzy_auto_suggestion_close)) {
            document.querySelectorAll('.frenzy-suggest-wrapper').forEach((frenzySuggestWrapper) => {
                frenzySuggestWrapper.classList.remove('open');
            })
        }
    });

    // Link Full Item
    // document.addEventListener('click', function(e) {
    //     if (!e.target.closest('.frenzy-suggest-wrapper a[data-name=suggest_search]') && !e.target.closest('.frenzy-suggest-wrapper .frenzy_variant_option') && !e.target.closest('.frenzy-suggest-wrapper .frenzy_swatch .variant-input') && !e.target.closest('.frenzy-suggest-wrapper .frenzy_add_to_cart_btn') && !e.target.closest('.frenzy-suggest-wrapper .frenzyQuickAdd')) {
    //         var closestItem = e.target.closest('.frenzy-suggest-wrapper .frenzy_product_item');

    //         if (closestItem) {
    //             var linkElement = closestItem.querySelector('[data-name=suggest_search]');

    //             if (linkElement) {
    //                 linkElement.click();
    //             }
    //         }
    //     }
    // });
};

if (typeof frenzyAutoSuggestWidgetCallBack == "function") {
    frenzyAutoSuggestWidgetCallBack();
}else{
    frenzyAutoSuggestWidget();
}

let frenzy_sw_nl_item_active = "",
  frenzySwNlDncoded = "",
  frenzy_suggestion_check = true;
window.frenzyAutoSuggestApi = async (frenzy_query) => {
    frenzysearchSugesstionQuery = encodeURIComponent(frenzy_query);
    const newQuery = frenzysearchSugesstionQuery != '' ? frenzysearchSugesstionQuery : document.querySelector('.frenzy_mobile_search input.frenzy_search_suggest')?.value || '';
    sessionStorage.setItem("frenzy_search_suggestion_value", encodeURIComponent(frenzy_query));
    var data_json = {
        shop: frenzyShop,
        query: newQuery,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    };
    data_json = Object.entries(
      data_json
    )
      .map((e) => e.join("="))
      .join("&")
    const response = await fetch(authUrl_Frenzy + "/suggest?"+data_json, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    frenzy_suggestion_css = data.suggestion_css;
    frenzy_suggestion_page = data.suggestion_page;
    frenzy_collection_suggestions = data.collection_suggestions;
    frenzy_suggestion_order = data.suggestion_order;
    frenzy_suggestion_check = true;
    frenzy_suggest_array = [];

    if (
      frenzy_suggestion_page.search_result_visibility != "0" ||
      frenzy_suggestion_page.search_result_visibility_mobile != "0"
    ) {
        getSuggestSearchApi(frenzy_query);
    }

    let frenzy_suggestion_first_name = "";
    frenzy_suggestion_name = frenzy_query;
    if (data?.suggestions?.length >= 1) {
        frenzy_suggestion_first_name = data.suggestions[0];
    }

    // Generate classes for frenzy_sw_content
    let sw_content_classes = "frenzy_sw_content";
    sw_content_classes +=
      " search_query_hover_effect_" + frenzy_suggestion_page.search_query_hover_effect;
    sw_content_classes +=
      " frenzy_product_hover_effect_" + frenzy_suggestion_page.product_hover_effect;
    sw_content_classes +=
      " query_as_first_suggestion_" + frenzy_suggestion_page.query_as_first_suggestion;
    sw_content_classes +=
      " query_bold_effect_" + frenzy_suggestion_page.query_bold_effect;
    sw_content_classes +=
      " search_query_hover_function_" + frenzy_suggestion_page.search_query_hover_function;
    sw_content_classes +=
      " frenzy_product_title_" + frenzy_suggestion_page.product_title;
    sw_content_classes +=
      " frenzy_filter_visibility_" + frenzy_suggestion_page.filter_visibility;
    sw_content_classes +=
      " frenzy_suggestions_visibility_" +
      frenzy_suggestion_page.suggestions_visibility;
    sw_content_classes +=
      " frenzy_suggestions_list_layout_" +
      frenzy_suggestion_page.suggestions_list_layout;
    sw_content_classes +=
      " frenzy_collection_suggestions_visibility_" +
      frenzy_suggestion_page.collection_suggestions_visibility;
    sw_content_classes +=
      " frenzy_search_result_visibility_" +
      frenzy_suggestion_page.search_result_visibility;
    sw_content_classes +=
      " frenzy_search_result_item_style_" +
      frenzy_suggestion_page.search_result_item_style;
    sw_content_classes +=
      " frenzy_view_all_button_position_" +
      frenzy_suggestion_page.view_all_button_position;
    sw_content_classes +=
      " frenzy_view_all_button_position_mobile_" +
      frenzy_suggestion_page.view_all_button_position_mobile;
    sw_content_classes +=
      " frenzy_widget_size_mobile_" +
      frenzy_suggestion_page.widget_size_mobile;
    sw_content_classes +=
      " frenzy_search_result_visibility_mobile_" +
      frenzy_suggestion_page.search_result_visibility_mobile;
    sw_content_classes +=
      " frenzy_suggestions_visibility_mobile_" +
      frenzy_suggestion_page.suggestions_visibility_mobile;
    sw_content_classes +=
      " frenzy_collection_suggestions_visibility_mobile_" +
      frenzy_suggestion_page.collection_suggestions_visibility_mobile;

    if (
      frenzy_suggestion_page &&
      frenzy_suggestion_page.view_all_button_text &&
      frenzy_suggestion_page.view_all_button_text != "" &&
      (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name)
    ) {
        sw_view_all_button_text = frenzy_suggestion_page.view_all_button_text;

        sw_view_all_button_short_text = frenzy_suggestion_page.view_all_button_text;
    } else {
        sw_view_all_button_text =
          "Show all results for ";

        sw_view_all_button_short_text = "Show all results";
    }

    if (
      frenzy_suggestion_page &&
      frenzy_suggestion_page.view_all_button_text_mobile &&
      frenzy_suggestion_page.view_all_button_text_mobile != "" &&
      (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name)
    ) {
        sw_view_all_button_text_mobile = frenzy_suggestion_page.view_all_button_text;

        sw_view_all_button_short_text_mobile = frenzy_suggestion_page.view_all_button_text;
    } else {
        sw_view_all_button_text_mobile =
          "Show all results for ";

        sw_view_all_button_short_text_mobile = "Show all results";
    }

    let frenzy_suggest_html = '<div class="' + sw_content_classes + '">';

    if (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name) {
        frenzy_suggest_html +=
          '<div class="frenzy_sw_bottom_btn frenzy_sw_top_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text">' +
          '<span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_short_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          "</a></div>";
    } else {
        frenzy_suggest_html +=
          '<div class="frenzy_sw_bottom_btn frenzy_sw_top_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text">' +
          '<span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path></svg>' +
          "</a></div>";
    }

    frenzy_suggest_html += '<div class="frenzy_sw_search_sidebar">';

    // Suggestions
    if (frenzy_suggestion_page.query_as_first_suggestion == '1' || data.suggestions?.length > 0) {
        if (data.collection_suggestions?.length > 0) {
            frenzy_suggest_html +=
              '<div class="frenzy_sw_suggestions_wrapper has-bottom-border">';
        } else {
            frenzy_suggest_html +=
              '<div class="frenzy_sw_suggestions_wrapper">';
        }

        if (
          frenzy_suggestion_page.suggestions_heading &&
          frenzy_suggestion_page.suggestions_heading != ""
        ) {
            frenzy_suggest_html +=
              '<div class="frenzy_sw_heading"><a href="javascript:void(0)">' +
              frenzy_suggestion_page.suggestions_heading +
              "</a></div>";
        }

        if (
          frenzy_suggestion_page.suggestions_heading_mobile &&
          frenzy_suggestion_page.suggestions_heading_mobile != ""
        ) {
            frenzy_suggest_html +=
              '<div class="frenzy_sw_heading_mobile">' +
              frenzy_suggestion_page.suggestions_heading_mobile +
              "</div>";
        }

        let frenzy_suggestions_list_style_mobile_class = "";

        if (frenzy_suggestion_page.suggestions_list_style_mobile === "0") {
            frenzy_suggestions_list_style_mobile_class =
              " frenzy_suggestions_list_style_mobile_horizontal";
        }

        frenzy_suggest_html +=
          '<ul class="frenzy_sw_navlist' +
          frenzy_suggestions_list_style_mobile_class +
          '">';

        if (frenzy_query && ! !/^ *$/.test(frenzy_query) && frenzy_query != frenzy_suggestion_first_name && frenzy_suggestion_page.query_as_first_suggestion == '1') {
            frenzy_suggestion_check = false;
            frenzySwNlDncoded = encodeURIComponent(frenzy_query);
            frenzy_suggest_html +=
              '<li class="frenzy_sw_nl_item is-active" data-index="0"  data-type="' +
              frenzy_query +
              '"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
              frenzySwNlDncoded +
              '">' +
              `<span class="frenzy_sw_nl_item_highlight">${frenzy_query}</span>` +
              "</a></li>";
        }

        let suggestionsLimit = 5;

        if (frenzy_suggestion_page.suggestions_limit) {
            suggestionsLimit = frenzy_suggestion_page.suggestions_limit - 1;
        }

        (data.suggestions || []).map((x, i) => {
            let ds_index = i + 1;
            if (i <= suggestionsLimit) {
                frenzy_sw_nl_item_active =
                  ds_index === 1 && frenzy_suggestion_check
                    ? "is-active"
                    : "";
                frenzySwNlDncoded = encodeURIComponent(x);

                let suggestionText = x;

                suggestionText = suggestionText.replace(new RegExp(frenzy_query, "gi"), (match) => `<span class="frenzy_sw_nl_item_highlight">${match}</span>`);

                frenzy_suggest_html +=
                  '<li class="frenzy_sw_nl_item ' +
                  frenzy_sw_nl_item_active +
                  '" data-index="' +
                  ds_index +
                  '"  data-type="' +
                  x +
                  '"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
                  frenzySwNlDncoded +
                  '">' +
                  suggestionText +
                  "</a></li>";
            }
        });
        frenzy_suggest_html += "</ul></div>";
    }

    // Collection Suggestions
    if (data.collection_suggestions?.length > 0) {
        let frenzy_collection_suggestions_style_mobile_class = "";

        if (
          frenzy_suggestion_page.collection_suggestions_style_mobile === "0"
        ) {
            frenzy_collection_suggestions_style_mobile_class =
              " frenzy_collection_suggestions_style_mobile_horizontal";
        }

        frenzy_suggest_html +=
          "<div class='frenzy_sw_collection_suggestions_wrapper" +
          frenzy_collection_suggestions_style_mobile_class +
          "'>";

        if (
          frenzy_suggestion_page.collection_suggestions_heading &&
          frenzy_suggestion_page.collection_suggestions_heading != ""
        ) {
            frenzy_suggest_html +=
              '<div class="frenzy_sw_collection_suggestions_heading">' +
              frenzy_suggestion_page.collection_suggestions_heading +
              "</div>";
        }

        if (
          frenzy_suggestion_page.collection_suggestions_heading_mobile &&
          frenzy_suggestion_page.collection_suggestions_heading_mobile != ""
        ) {
            frenzy_suggest_html +=
              '<div class="frenzy_sw_collection_suggestions_heading_mobile">' +
              frenzy_suggestion_page.collection_suggestions_heading_mobile +
              "</div>";
        }

        frenzy_suggest_html +=
          '<ul class="frenzy_sw_collection_suggestions_list">';
        (data.collection_suggestions || []).map((x, i) => {
            let ds_index = i + 1;
            frenzySwNlDncoded = encodeURIComponent(x);

            let suggestionText = x.title;

            suggestionText = suggestionText.replace(new RegExp(frenzy_query, "gi"), (match) => `<span class="frenzy_sw_nl_item_highlight">${match}</span>`);

            let type_handle = x.handle.split('/');
            let handle = '';
            if(type_handle && type_handle[0] === '/'){
                handle = frenzy_root_url + '/' + x.handle;
            }
            else if(type_handle && type_handle[0] == 'https:'){
                handle = x.handle;
            }
            else{
                handle = frenzy_root_url + '/collections/' + x.handle;
            }

            frenzy_suggest_html +=
              '<li class="frenzy_sw_collection_suggestions_list_item" data-handle=' +
              handle +
              ' data-index="' +
              ds_index +
              '"><a href="' + handle + '">' +
              suggestionText +
              "</a></li>";
        });

        frenzy_suggest_html += "</ul></div>";
    }

    // View all button
    frenzy_suggest_html +=
      '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
      frenzy_suggestion_name +
      '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
      sw_view_all_button_text +
      '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
      sw_view_all_button_text_mobile +
      '</span> <b class="frenzy_sw_view_all_link_search_term">' +
      frenzy_suggestion_name +
      "</b></div>" +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path></svg>' +
      "</a></div>";
    frenzy_suggest_html += "</div>";
    frenzy_suggest_html += '<div class="frenzy_sw_contain"></div>';
    frenzy_suggest_html += "</div>";

    if (isCommunityEnabled) {
        frenzy_suggest_html += '<div class="frenzy-forum-suggest-wrapper"></div>';

        if (typeof frenzyDrawCommunitySuggestions == "function") {
            frenzyDrawCommunitySuggestions(encodeURIComponent(frenzy_query));
        }
    }

    document
      .querySelectorAll(".frenzy-suggest-wrapper")
      .forEach(function (this_click) {
          this_click.classList.add('open');

          this_click.innerHTML = frenzy_suggest_html;
          if (frenzy_suggestion_page.screen_size === "2") {
              this_click.classList.add("frenzy-full-screen");
          }

          // Widget Alignment
          if (frenzy_suggestion_page.widget_position === "left") {
              this_click.classList.add("frenzy_suggest_align_left");
          } else if (frenzy_suggestion_page.widget_position === "center") {
              this_click.classList.add("frenzy_suggest_align_center");
          } else if (frenzy_suggestion_page.widget_position === "right") {
              this_click.classList.add("frenzy_suggest_align_right");
          }
      });

    if (
      frenzy_suggestion_page.search_result_visibility != "0" ||
      frenzy_suggestion_page.search_result_visibility_mobile != "0"
    ) {
        document
          .querySelectorAll(".frenzy_sw_nl_item")
          .forEach(function (this_click) {
              if (!this_click.closest('.search_query_hover_function_0')) {
                  this_click.addEventListener("mouseover", function (event) {
                      frenzyHoverRecuursiveEvent(this_click, 1, 250);
                  });

                  this_click.addEventListener("mouseout", function (event) {
                      window.frenzyHoverCountNumber = 0;
                      window.clearTimeout(frenzyHoverTimeoutEvent);
                  });
              }
          });
    }

    // Suggestion Query Click Events
    document
      .querySelectorAll(".frenzy_sw_nl_item a")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              event.preventDefault();
              event.stopImmediatePropagation();

              const query =
                this_click.parentElement.getAttribute("data-type");
              const url = this_click.getAttribute("href");

              let trigger_event = 'suggest_query_click';
              if(frenzysearchSugesstionQuery == ''){
                  trigger_event = 'default_suggest_query_click';
              }

              frenzyAutoSuggestClickEventsApi(
                trigger_event,
                "query",
                query
              );

              location.href = url;
          });
      });

    // Suggestion Query Hover Events
    document
      .querySelectorAll(".frenzy_sw_nl_item a")
      .forEach(function (this_click) {
          this_click.addEventListener("mouseover", function (event) {
              if (!this_click.closest('.search_query_hover_function_0')) {
                  const query =
                    this_click.parentElement.getAttribute("data-type");
                  let trigger_event = 'suggest_query_hover';
                  if(frenzysearchSugesstionQuery == ''){
                      trigger_event = 'default_suggest_query_hover';
                  }

                  frenzyAutoSuggestClickEventsApi(
                    trigger_event,
                    "query",
                    query
                  );
              }
          });
      });

    // Collection Suggestion Click Events
    document
      .querySelectorAll(".frenzy_sw_collection_suggestions_list_item a")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              event.preventDefault();
              event.stopImmediatePropagation();

              const query =
                this_click.parentElement.getAttribute("data-handle");
              const url = this_click.getAttribute("href");

              let trigger_event = 'suggest_collection_click';
              if(frenzysearchSugesstionQuery == ''){
                  trigger_event = 'default_suggest_collection_click';
              }

              frenzyAutoSuggestClickEventsApi(
                trigger_event,
                "filters",
                ["collection:" + query]
              );

              location.href = url;
          });
      });

    // Show All Button Click Events
    document.addEventListener("click", function (event) {
        const target = event.target.closest(".frenzy_sw_view_all_link");

        if (target) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();

            const query = target.querySelector(
              ".frenzy_sw_view_all_link_search_term"
            ).innerText;
            const url = target.getAttribute("href");

            // frenzyAutoSuggestClickEventsApi(
            //     "suggest_query_click",
            //     "query",
            //     query
            // );

            location.href = url;
        }
    });

    if (
      frenzy_suggestion_page.search_result_visibility != "0" ||
      frenzy_suggestion_page.search_result_visibility_mobile != "0"
    ) {
        const frenzy_suggest_item =
          document.querySelectorAll(".frenzy_sw_nl_item");
        const calculateNextIndex = (reverse, activeIndex) => {
            const sectionsLastIndex = frenzy_suggest_item.length - 1;
            if (reverse) {
                const nextIndex =
                  activeIndex - 1 < 0 ? sectionsLastIndex : activeIndex - 1;
                return nextIndex;
            }
            const nextIndex =
              activeIndex + 1 > sectionsLastIndex ? 0 : activeIndex + 1;
            return nextIndex;
        };
        const traverseSections = (reverse = false) => {
            const currentlyActive = document.querySelector(".is-active");
            frenzy_suggest_item.forEach((section, index) => {
                if (section === currentlyActive) {
                    const nextIndex = calculateNextIndex(reverse, index);
                    const nextActive = frenzy_suggest_item[nextIndex];
                    currentlyActive.classList.remove("is-active");
                    nextActive.classList.add("is-active");
                    suggestHoverData(nextActive);
                    return;
                }
                return;
            });
        };
        document.addEventListener("keydown", (evt) => {
            if (evt.isComposing || evt.keyCode === 229) {
                return;
            } else if (evt.keyCode === 38) {
                traverseSections(true);
            } else if (evt.keyCode === 40) {
                traverseSections();
            }
        });
    }

    let cssdata =
      ".frenzy-suggest-wrapper .frenzy_product_item figure{border-color: #" +
      frenzy_suggestion_css.card_border_color +
      ";} " +
      ".frenzy-suggest-wrapper .frenzy_product_item_detail, .frenzy-suggest-wrapper .frenzy_product_item_detail h3 a{color:#" +
      frenzy_suggestion_css.text_color +
      "} " +
      ".frenzy-suggest-wrapper .frenzy_product_price_sale.is-sale{color:#" +
      frenzy_suggestion_css?.sale_price_color +
      "} " +
      ".frenzy-suggest-wrapper .frenzy_product_price_sale{color:#" +
      frenzy_suggestion_css.price_color +
      "} " +
      ".frenzy-suggest-wrapper .frenzy_product_price_compare{color:#" +
      frenzy_suggestion_css.compare_price_color +
      "}";
    if (frenzy_suggestion_page.image_border_show == "0") {
        cssdata +=
          ".frenzy-suggest-wrapper .frenzy_product_item figure{border:none !important;}";
    }
    let head_Frenzy = document.head || document.getElementsByTagName("head")[0],
      style_Frenzy = document.createElement("style");
    head_Frenzy.appendChild(style_Frenzy);
    style_Frenzy.type = "text/css";
    if (style_Frenzy.styleSheet) {
        style_Frenzy.styleSheet.cssText = cssdata;
    } else {
        style_Frenzy.appendChild(document.createTextNode(cssdata));
    }
};
function suggestHoverData(this_click) {
    if (frenzy_suggest_hover) {
        frenzy_suggest_hover = false;
        frenzy_suggestion_name = this_click.getAttribute("data-type");
        frenzy_suggest_index = this_click.getAttribute("data-index");
        document
          .querySelectorAll(".frenzy_sw_nl_item")
          .forEach(function (this_remove) {
              this_remove.classList.remove("is-active");
          });
        this_click.classList.add("is-active");

        const findIndex = frenzy_suggest_array.findIndex(
          (x) => x.index === frenzy_suggest_index
        );
        if (findIndex === -1) {
            getSuggestSearchApi(frenzy_suggestion_name, this_click);
        } else {
            frenzy_suggest_hover = true;
            const dataResults = frenzy_suggest_array[findIndex].results.results;
            const dataGridHtml =
              frenzy_suggest_array[findIndex].recommendation_html;
            const dataFacetFields =
              frenzy_suggest_array[findIndex].results.facet_fields;
            const dataCount =
              frenzy_suggest_array[findIndex].results.products_found;
            const frenzy_request_id =
              frenzy_suggest_array[findIndex].results.request_id;
            const frenzy_product_click = "suggest_search";
            getSuggestSearchData(
              dataResults,
              dataGridHtml,
              dataFacetFields,
              dataCount,
              frenzy_request_id,
              frenzy_product_click
            );

            // Update request id
            this_click.setAttribute(
              "data-request-id",
              frenzy_suggest_array[findIndex].results.request_id
            );
        }

        // Update view all button text
        document
          .querySelectorAll(".frenzy_sw_view_all_link_search_term")
          .forEach(function (viewAllLinkSearchTerm) {
              viewAllLinkSearchTerm.innerText =
                this_click.querySelector("a").innerText;
          });
    }
}
const getSuggestSearchApi = async (searchQuery, this_click = null) => {
    frenzysearchSugesstionQuery = encodeURIComponent(searchQuery);
    const newQuery = frenzysearchSugesstionQuery != '' ? frenzysearchSugesstionQuery : document.querySelector('.frenzy_mobile_search input.frenzy_search_suggest')?.value || '';
    var data_json = {
        raw_query: newQuery,
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        suggestion: true,
        shop: frenzyShop,
        mode: 1,
        page_index: 0,
        currency:Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    };
    data_json = Object.entries(
      data_json
    )
      .map((e) => e.join("="))
      .join("&");
    const response = await fetch(authUrl_Frenzy + "/search?"+data_json, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    if (data.status === 200) {
        frenzy_suggest_hover = true;
        frenzy_suggest_array.push({
            ...data.data,
            index: frenzy_suggest_index,
        });
        dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
        const dataResults = data.data.results.results;
        search_query = searchQuery;
        const dataGridHtml = data.data.recommendation_html;
        const dataFacetFields = data.data.results.facet_fields;
        const dataCount = data.data.results.products_found;
        const frenzy_request_id = data.data.results.request_id;
        const frenzy_product_click = "suggest_search";
        const globalSetting = data?.data?.global_setting;
        FrenzyProductImgResize(globalSetting);
        getSuggestSearchData(
          dataResults,
          dataGridHtml,
          dataFacetFields,
          dataCount,
          frenzy_request_id,
          frenzy_product_click,
          dataConfig
        );

        // Update request id
        if (this_click) {
            this_click.setAttribute("data-request-id", frenzy_request_id);
        }

        document
          .querySelectorAll(".frenzy_sw_collection_suggestions_list_item")
          .forEach(function (item) {
              item.setAttribute("data-request-id", frenzy_request_id);
          });

        document
          .querySelectorAll(".frenzy_sw_terms_link")
          .forEach(function (item) {
              item.setAttribute("data-request-id", frenzy_request_id);
          });

        // Add 'hide-view-all-button' class to auto suggest widget if no search result
        if (dataCount <= 0) {
            document
              .querySelector(".frenzy_sw_content")
              ?.classList.add("hide-view-all-button");
        } else {
            document
              .querySelector(".frenzy_sw_content")
              ?.classList.remove("hide-view-all-button");
        }
    }
};
const getSuggestSearchChangeApi = async (filterPayload, key, value) => {
    var data_json = JSON.stringify({
        raw_query: frenzy_suggestion_name,
        sort: isSeletedSortValue_Frenzy,
        user_id: user_id_Frenzy.toString(),
        shop: frenzyShop,
        mode: 2,
        page_index: 0,
        filters: filterPayload,
        suggestion: true,
        currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
        country:Shopify.country ? Shopify.country : ''
    });
    const response = await fetch(authUrl_Frenzy + "/search", {
        method: "POST",
        body: data_json,
        headers: {
            "Content-Type": "application/json",
            "x-frenzy-authorization": frenzy_api_key,
            "X-Shop": frenzyShop
        },
    });
    const data = await response.json();
    if (data.status === 200) {
        dataConfig = data.data.config_id ? data.data.config_id : data.config_id;
        const dataResults = data.data.results.results;
        const dataGridHtml = data.data.recommendation_html;
        const dataCount = data.data.results.products_found;
        const frenzy_request_id = data.data.results.request_id;
        const all_product_data = data.data;
        const frenzy_product_click = "suggest_search";
        const findIndex = frenzy_suggest_array.findIndex(
          (x) => x.index === frenzy_suggest_index
        );
        const suggestSearchType = key + "-" + value;
        frenzy_suggest_array[findIndex][suggestSearchType] = {
            results: dataResults,
            recommendation_html: dataGridHtml,
            products_found: dataCount,
            request_id: frenzy_request_id,
        };
        const globalSetting = data?.data?.global_setting;
        FrenzyProductImgResize(globalSetting);
        changeSuggestSearchData(
          dataResults,
          dataGridHtml,
          dataCount,
          frenzy_request_id,
          frenzy_product_click,
          dataConfig,
          all_product_data
        );
    }
};
function getSuggestSearchData(
  dataResults,
  dataGridHtml,
  dataFacetFields,
  dataCount,
  frenzy_request_id,
  frenzy_product_click,
  dataConfig
) {
    let product_grid_html = dataGridHtml;
    let frenzySuggestProductList = "";
    let dataResultSize = frenzy_suggestion_page.results_per_page - 1;

    if (frenzy_suggestion_page.results_per_page - 1  < frenzy_suggestion_page.results_per_page_mobile - 1) {
        dataResultSize = frenzy_suggestion_page.results_per_page_mobile - 1;
    }

    (dataResults || []).map((x, i) => {
        if (i <= dataResultSize) {
            let visible_on_desktop = false;

            if (i <= frenzy_suggestion_page.results_per_page - 1) {
                visible_on_desktop = true;
            }

            let visible_on_mobile = false;

            if (i <= frenzy_suggestion_page.results_per_page_mobile - 1) {
                visible_on_mobile = true;
            }

            frenzySuggestProductList += getProductGridItem(
              product_grid_html,
              x,
              frenzy_suggestion_page,
              frenzy_shop_currency,
              frenzy_request_id,
              frenzy_product_click,
              dataConfig,
              visible_on_desktop,
              visible_on_mobile
            );
        }
    });
    let frenzySuggestFilterHtml = "";
    let frenzySuggestFilterCount = 0;
    (frenzy_suggestion_order || []).map((x, i) => {
        const filterName = x.key;
        const filterLabel = x.value;
        const filterData = dataFacetFields[filterName] ?? [];
        if (
          (filterData.length >= 1 || filterName != "price range" || filterName != "org_price") &&
          x.status == "1"
        ) {
            if (frenzySuggestFilterCount <= 2) {
                frenzySuggestFilterHtml += frenzySuggestFilter(
                  filterName,
                  filterData,
                  filterLabel
                );
            }
            frenzySuggestFilterCount = frenzySuggestFilterCount + 1;
        }
    });

    if (
      frenzy_suggestion_page &&
      frenzy_suggestion_page.view_all_button_text &&
      frenzy_suggestion_page.view_all_button_text !== "" &&
      (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name)
    ) {
        sw_view_all_button_text = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );

        sw_view_all_button_short_text = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_short_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    } else {
        sw_view_all_button_text = "Show all results for ";
        sw_view_all_button_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    }

    if (
      frenzy_suggestion_page &&
      frenzy_suggestion_page.view_all_button_text_mobile &&
      frenzy_suggestion_page.view_all_button_text_mobile != "" &&
      (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name)
    ) {
        sw_view_all_button_text_mobile = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_text_mobile = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );

        sw_view_all_button_short_text_mobile = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_short_text_mobile = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    } else {
        sw_view_all_button_text_mobile =
          "Show all results for ";
        sw_view_all_button_text_mobile = sw_view_all_button_text_mobile.replace(
          "[count]",
          dataCount
        );

        sw_view_all_button_short_text_mobile = "Show all results";
        sw_view_all_button_short_text_mobile = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    }

    let frenzy_sw_search_html = "";
    if (dataCount <= 0) {
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_content_area frenzy_sw_ca_full">';
    } else {
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
          sw_view_all_button_text +
          '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path></svg>' +
          "</a></div>";

        // Collection Suggestions
        if (frenzy_collection_suggestions?.length > 0) {
            frenzy_sw_search_html +=
              "<div class='frenzy_sw_collection_suggestions_wrapper'>";

            if (
              frenzy_suggestion_page.collection_suggestions_heading &&
              frenzy_suggestion_page.collection_suggestions_heading != ""
            ) {
                frenzy_sw_search_html +=
                  '<div class="frenzy_sw_collection_suggestions_heading">' +
                  frenzy_suggestion_page.collection_suggestions_heading +
                  "</div>";
            }

            if (
              frenzy_suggestion_page.collection_suggestions_heading_mobile &&
              frenzy_suggestion_page.collection_suggestions_heading_mobile !=
              ""
            ) {
                frenzy_sw_search_html +=
                  '<div class="frenzy_sw_collection_suggestions_heading_mobile">' +
                  frenzy_suggestion_page.collection_suggestions_heading_mobile +
                  "</div>";
            }

            frenzy_sw_search_html +=
              '<ul class="frenzy_sw_collection_suggestions_list">';
            (frenzy_collection_suggestions || []).map((x, i) => {
                let ds_index = i + 1;
                frenzySwNlDncoded = encodeURIComponent(x);

                let suggestionText = x.title;

                // suggestionText = suggestionText.replace(new RegExp(frenzy_query, "gi"), (match) => `<span class="frenzy_sw_nl_item_highlight">${match}</span>`);

                frenzy_sw_search_html +=
                  '<li class="frenzy_sw_collection_suggestions_list_item" data-handle=' +
                  x.handle +
                  ' data-index="' +
                  ds_index +
                  '"><a href="' + frenzy_root_url + '/collections/' +
                  x.handle +
                  '">' +
                  suggestionText +
                  "</a></li>";
            });

            frenzy_sw_search_html += "</ul></div>";
        }

        // Filter
        frenzy_sw_search_html += '<div class="frenzy_sw_nav_sidebar">';

        if (
          frenzy_suggestion_page.filter_heading &&
          frenzy_suggestion_page.filter_heading != ""
        ) {
            frenzy_sw_search_html +=
              '<div class="frenzy_sw_heading">' +
              frenzy_suggestion_page.filter_heading +
              "</div>";
        }

        if (
          frenzy_suggestion_page.filter_heading_mobile &&
          frenzy_suggestion_page.filter_heading_mobile != ""
        ) {
            frenzy_sw_search_html +=
              '<div class="frenzy_sw_heading_mobile">' +
              frenzy_suggestion_page.filter_heading_mobile +
              "</div>";
        }

        frenzy_sw_search_html += frenzySuggestFilterHtml;

        // View all button
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
          sw_view_all_button_text +
          '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path></svg>' +
          "</a></div>";

        frenzy_sw_search_html += "</div>";
        frenzy_sw_search_html += '<div class="frenzy_sw_content_area">';

        if (
          frenzy_suggestion_page.search_result_heading &&
          frenzy_suggestion_page.search_result_heading != ""
        ) {
            frenzy_sw_search_html +=
              '<div class="frenzy_sw_heading">' +
              frenzy_suggestion_page.search_result_heading +
              "</div>";
        }

        if (
          frenzy_suggestion_page.search_result_heading_mobile &&
          frenzy_suggestion_page.search_result_heading_mobile != ""
        ) {
            frenzy_sw_search_html +=
              '<div class="frenzy_sw_heading_mobile">' +
              frenzy_suggestion_page.search_result_heading_mobile +
              "</div>";
        }
    }
    const frenzy_sw_col = "ltg_" + frenzy_suggestion_page.grid_items_per_row;
    frenzy_sw_search_html +=
      '<div class="frenzy_product_row layout_type_grid ' +
      frenzy_sw_col +
      '">' +
      frenzySuggestProductList +
      "</div>";
    if (dataCount <= 0) {
        const frenzy_searchQueryText =
          search_query != "" ? search_query : "Query";
        frenzy_sw_search_html +=
          '<div class="resultNotFoundText">Sorry, nothing found for <span>"' +
          frenzy_searchQueryText +
          '"</span></div>';
    }
    if (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name) {
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
          sw_view_all_button_short_text +
          '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_short_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          "</a></div>";
    } else {
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
          sw_view_all_button_text +
          '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path></svg>' + "</a></div>";
    }

    frenzy_sw_search_html += "</div>";
    document
      .querySelectorAll(".frenzy_sw_contain")
      .forEach(function (this_click) {
          this_click.innerHTML = frenzy_sw_search_html;
      });
    frenzySuggestFilterScript();
}
function changeSuggestSearchData(
  dataResults,
  dataGridHtml,
  dataCount,
  frenzy_request_id,
  frenzy_product_click,
  dataConfig,
  all_product_data
) {
    let product_grid_html = dataGridHtml;
    let frenzySuggestProductList = "";
    let dataResultSize = frenzy_suggestion_page.results_per_page - 1;

    if (frenzy_suggestion_page.results_per_page - 1 < frenzy_suggestion_page.results_per_page_mobile - 1) {
        dataResultSize = frenzy_suggestion_page.results_per_page_mobile - 1;
    }

    (dataResults || []).map((x, i) => {
        if (i <= dataResultSize) {
            let visible_on_desktop = false;

            if (i <= frenzy_suggestion_page.results_per_page - 1) {
                visible_on_desktop = true;
            }

            let visible_on_mobile = false;

            if (i <= frenzy_suggestion_page.results_per_page_mobile - 1) {
                visible_on_mobile = true;
            }

            frenzySuggestProductList += getProductGridItem(
              product_grid_html,
              x,
              frenzy_suggestion_page,
              frenzy_shop_currency,
              frenzy_request_id,
              frenzy_product_click,
              dataConfig,
              visible_on_desktop,
              visible_on_mobile
            );
        }
    });

    if (
      frenzy_suggestion_page &&
      frenzy_suggestion_page.view_all_button_text &&
      frenzy_suggestion_page.view_all_button_text != "" &&
      (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name)
    ) {
        sw_view_all_button_text = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );

        sw_view_all_button_short_text = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_short_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    } else {
        sw_view_all_button_text = "Show all results for ";
        sw_view_all_button_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );

        sw_view_all_button_short_text = "Show all results";
        sw_view_all_button_short_text = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    }

    if (
      frenzy_suggestion_page &&
      frenzy_suggestion_page.view_all_button_text_mobile &&
      frenzy_suggestion_page.view_all_button_text_mobile != "" &&
      (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name)
    ) {
        sw_view_all_button_text_mobile =
          frenzy_suggestion_page.view_all_button_text_mobile;
        sw_view_all_button_text_mobile = sw_view_all_button_text_mobile.replace(
          "[count]",
          dataCount
        );

        sw_view_all_button_short_text_mobile = frenzy_suggestion_page.view_all_button_text;
        sw_view_all_button_short_text_mobile = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    } else {
        sw_view_all_button_text_mobile =
          "Show all results for ";
        sw_view_all_button_text_mobile = sw_view_all_button_text_mobile.replace(
          "[count]",
          dataCount
        );
        sw_view_all_button_short_text_mobile = "Show all results";
        sw_view_all_button_short_text_mobile = sw_view_all_button_text.replace(
          "[count]",
          dataCount
        );
    }

    const frenzy_sw_col = "ltg_" + frenzy_suggestion_page.grid_items_per_row;
    let frenzy_sw_search_html =
      '<div class="frenzy_product_row layout_type_grid ' +
      frenzy_sw_col +
      '">' +
      frenzySuggestProductList +
      "</div>";
    if (/^ *$/.test(frenzy_suggestion_name) || !frenzy_suggestion_name) {
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
          sw_view_all_button_text +
          '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</a></div>";
    } else {
        frenzy_sw_search_html +=
          '<div class="frenzy_sw_bottom_btn"><a href="' + frenzy_root_url + Shopify.routes.root + 'search?q=' +
          frenzy_suggestion_name +
          '" class="frenzy_sw_view_all_link"><div class="frenzy_sw_view_all_link_text"><span class="frenzy_sw_view_all_button_text_desktop">' +
          sw_view_all_button_text +
          '</span><span class="frenzy_sw_view_all_button_text_mobile">' +
          sw_view_all_button_text_mobile +
          '</span> <b class="frenzy_sw_view_all_link_search_term">' +
          frenzy_suggestion_name +
          "</b></div>" +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path></svg>' +
          "</a></div>";
    }

    document
      .querySelectorAll(".frenzy_sw_content_area")
      .forEach(function (this_click) {
          this_click.innerHTML = frenzy_sw_search_html;
      });
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
}
function frenzySuggestFilter(key, data, filterLabel) {
    let frenzySuggestItem = "";
    if (data.length >= 1) {
        frenzySuggestItem +=
          '<div class="frenzy_sw_term_block frenzy_sw_type_' +
          key.replaceAll(" ", "-").replaceAll('"', '__') +
          '"><h4 class="frenzy_sw_terms_title">' +
          filterLabel +
          "</h4>";
        const frenzyMoreOption =
          frenzy_suggestion_page?.more_options === "1"
            ? frenzy_suggestion_page.more_options
            : "0";
        const frenzy_block_scroll_class =
          frenzy_suggestion_page?.more_options === "1"
            ? "frenzy_block_scroll"
            : "";
        frenzySuggestItem +=
          '<ul class="frenzy_sw_terms ' + frenzy_block_scroll_class + '">';
        (data || []).map((x, i) => {
            if (frenzyMoreOption === "0") {
                if (i <= 4) {
                    const frenzyfilterUrl = `${key}=${encodeURIComponent(
                      "0=" + encodeURIComponent(x[0])
                    ).toString()}`;
                    frenzySuggestItem +=
                      '<li class="frenzy_sw_terms_item"><a class="frenzy_sw_terms_link" data-value="' +
                      x[0] +
                      '" data-type="' +
                      key +
                      '"  href="' + frenzy_root_url + '/search?q=' +
                      frenzy_suggestion_name +
                      "&filterchange=true&" +
                      frenzyfilterUrl +
                      '">' +
                      x[0] +
                      "</a></li>";
                }
            } else {
                const frenzyfilterUrl = `${key}=${encodeURIComponent(
                  "0=" + encodeURIComponent(x[0])
                ).toString()}`;
                frenzySuggestItem +=
                  '<li class="frenzy_sw_terms_item"><a class="frenzy_sw_terms_link" data-value="' +
                  x[0] +
                  '" data-type="' +
                  key +
                  '"  href="' + frenzy_root_url + '/search?q=' +
                  frenzy_suggestion_name +
                  "&filterchange=true&" +
                  frenzyfilterUrl +
                  '">' +
                  x[0] +
                  "</a></li>";
            }
        });
        frenzySuggestItem += "</ul></div>";
    }
    return frenzySuggestItem;
}
function frenzySuggestFilterScript() {
    document
      .querySelectorAll(".frenzy_sw_terms_link")
      .forEach(function (this_click) {
          this_click.addEventListener("mouseover", function (event) {
              frenzyHoverRecuursiveEvent(this_click, 2, 1000);
          });
          this_click.addEventListener("mouseout", function (event) {
              window.frenzyHoverCountNumber = 0;
              window.clearTimeout(frenzyHoverTimeoutEvent);
          });
      });

    // Suggestion Filter Click Events
    document
      .querySelectorAll(".frenzy_sw_terms_link")
      .forEach(function (this_click) {
          this_click.addEventListener("click", function (event) {
              event.preventDefault();

              const type = event.target.getAttribute("data-type");
              const value = event.target.getAttribute("data-value");
              const url = event.target.getAttribute("href");

              frenzyAutoSuggestClickEventsApi(
                "suggest_filter_click",
                "filters",
                { [type]: value }
              );

              location.href = url;
          });
      });
}
function frenzySuggestFilterData(this_click) {
    let suggestArFiFrenzy = {};
    const filter_type = this_click.getAttribute("data-type");
    const filter_value = this_click.getAttribute("data-value");
    suggestArFiFrenzy[filter_type] = [filter_value];
    const findIndex = frenzy_suggest_array.findIndex(
      (x) => x.index === frenzy_suggest_index
    );
    const suggestSearchType = filter_type + "-" + filter_value;
    const checkFilterData = frenzy_suggest_array[findIndex][suggestSearchType];
    if (checkFilterData != undefined) {
        const dataResults = checkFilterData.results;
        const dataGridHtml = checkFilterData.recommendation_html;
        const dataCount = checkFilterData.products_found;
        const frenzy_request_id = checkFilterData.request_id;
        const all_product_data = checkFilterData.data;
        const frenzy_product_click = "suggest_search";
        changeSuggestSearchData(
          dataResults,
          dataGridHtml,
          dataCount,
          frenzy_request_id,
          frenzy_product_click,
          all_product_data
        );
    } else {
        getSuggestSearchChangeApi(suggestArFiFrenzy, filter_type, filter_value);
    }
}

document.querySelectorAll('.frenzy_search_suggest').forEach(function(this_input){
    var suggestion_value = this_input.value;
    var getSearchSuggestionValue = sessionStorage.getItem("frenzy_search_suggestion_value");
    if(getSearchSuggestionValue){
        this_input.value = decodeURIComponent(getSearchSuggestionValue);
    }
});

if(__st && __st.p == 'collection' || __st.p == 'page'){
    sessionStorage.setItem("frenzy_search_suggestion_value","");
    document.querySelectorAll('.frenzy_search_suggest').forEach(function(this_input){
        this_input.value = '';
    });
}

/* Script Reload */
window.frenzyScriptReload =  function() {
    urlParams_Frenzy = new URLSearchParams(window.location.search);
    if (get_frenzy_recommendation_section) {
        getRecommendationProductsApi();
    }
    if (get_frenzy_cross_sell_carousel_section) {
        getCrossSellCarouselApi();
    }
    if (get_frenzy_most_clicked_skus_section) {
        getMostClickedSkusApi();
    }
    frenzyAsyncItems();
    let filterchange = urlParams_Frenzy.get("filterchange");
    if (filterchange == "true") {
        let params = Object.fromEntries(urlParams_Frenzy);
        if (urlParams_Frenzy.get("q")) {
            delete params.q;
        }
        if (urlParams_Frenzy.get("page")) {
            delete params.page;
        }
        if (urlParams_Frenzy.get("filterchange")) {
            delete params.filterchange;
        }
        if (urlParams_Frenzy.get("sort")) {
            delete params.sort;
        }
        for (const [key, value] of Object.entries(params)) {
            let innerData = Object.fromEntries(new URLSearchParams(value));
            if (["org_price"].includes(key)) {
                params[key] = innerData;
            } else if(Object.values(innerData) == ''){
                params[key] = [value];
            } else {
                params[key] = Object.values(innerData);
            }
        }
        filterArray_Frenzy = params;
    }
    if (get_frenzy_search_page_section) {
        if (typeof frenzyAnimationCallBack == "function") {
            get_frenzy_search_page_section.innerHTML =
              '<div class="frenzyPreloader">' +
              frenzyAnimationCallBack() +
              "</div>";
        } else {
            get_frenzy_search_page_section.insertAdjacentHTML("beforeend",PlaceHolderGridLoad(get_frenzy_search_page_section,true,6));
        }
        if (filterchange == "true") {
            getSearchPAgeFilterChangeApi(
              filterArray_Frenzy,
              selected_page_Frenzy - 1,
              false
            );
        } else {
            getSearchPageApi();
        }
    }
    if (get_frenzy_collection_page_section) {
        if (typeof frenzyAnimationCallBack == "function") {
            get_frenzy_collection_page_section.innerHTML =
              '<div class="frenzyPreloader">' +
              frenzyAnimationCallBack() +
              "</div>";
        } else {
            get_frenzy_collection_page_section.insertAdjacentHTML("beforeend",PlaceHolderGridLoad(get_frenzy_collection_page_section,true,6));
        }
        if (filterchange == "true") {
            getCollectionsPageFilterChangeApi(
              filterArray_Frenzy,
              selected_page_Frenzy - 1,
              false
            );
        } else {
            if(isSeletedSortValue_Frenzy != null && selected_page_Frenzy != null){
                getCollectionsPageApi();
            }
        }
    }
    if (get_frenzy_blog_page_section) {
        if (filterchange == "true") {
            getBlogPageApi(selected_page_Frenzy - 1, false);
        } else {
            getBlogPageApi(0, false);
        }
    }
}

/* Bundle */

let $frenzy_bundle_discount_type = "",
  $frenzy_bundle_discount = "",
  frenzyBundleOptionCount = 0;
const $frenzy_addtocart_success_event = function (res) {
    const $frenzy_bundle_cta_root_url =
      Shopify && Shopify.routes && Shopify.routes.root
        ? Shopify.routes.root
        : "/";
    if(isFrenzyBundleRedirectOption != 1){
        if (typeof frenzyCartCallBack == "function") {
            getCartItems();
            frenzyCartCallBack(res);
        }else{
            window.location.href =
              window.location.origin + $frenzy_bundle_cta_root_url + "cart";
        }
    }else{
        window.location.href =
          window.location.origin + $frenzy_bundle_cta_root_url + "checkout";
    }
};
const $frenzy_bundle_addtocart_fetch = async function (
  $bundle_btn_this,
  $frenzy_bundle_formData
) {
    await fetch("/cart/add.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify($frenzy_bundle_formData),
    })
      .then((response) => response.json())
      .then((cart_result) => {
          $bundle_btn_this.classList.remove("frenzy_bundle_cta_atc_loading");
          $bundle_btn_this.querySelector(".frenzy_loading_spinner")?.remove();
          if (cart_result.items) {
              $frenzy_addtocart_success_event(cart_result);
          } else {
              $bundle_btn_this
                .querySelector(".frenzy_loading_spinner")
                ?.remove();
              $bundle_btn_this
                .closest(".frenzy_bundle_cta_inner")
                .insertAdjacentHTML(
                  "beforeend",
                  '<p class="cart_error_note">' +
                  cart_result.errors +
                  "</p>"
                );
              setTimeout(function () {
                  document.querySelector(".cart_error_note")?.remove();
              }, 5000);
          }
      })
      .catch((cart_error) => {
          console.error(cart_error);
          $bundle_btn_this.classList.remove("frenzy_bundle_cta_atc_loading");
          $bundle_btn_this.querySelector(".frenzy_loading_spinner")?.remove();
      });
};
const $frenzy_bundle_addtocart_event = function () {
    if (document.querySelector(".frenzy_bundle_cta_atc")) {
        document
          .querySelectorAll(".frenzy_bundle_cta_atc")
          .forEach(($bundle_btn_this, $bundle_btn_idx) => {
              $bundle_btn_this.addEventListener("click", (event) => {
                  event.preventDefault(), event.stopImmediatePropagation();
                  $bundle_btn_this.classList.add(
                    "frenzy_bundle_cta_atc_loading"
                  );
                  const frenzy_button_spinner =
                    '<span class="frenzy_loading_spinner"><svg class="spinner" viewBox="0 0 66 66"><circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></span>';
                  $bundle_btn_this.insertAdjacentHTML(
                    "beforeend",
                    frenzy_button_spinner
                  );
                  const $frenzy_bundle_parent = $bundle_btn_this
                    .closest(".frenzy_bundle_innercode")
                    .querySelector(".frenzy_pb_details");
                  let $frenzy_bundle_pids = [];
                  for (
                    let i = 0;
                    i <
                    $frenzy_bundle_parent.querySelectorAll(
                      ".frenzy_bundle_product_grid"
                    ).length;
                    i++
                  ) {
                      if (
                        $frenzy_bundle_parent
                          .querySelectorAll(".frenzy_bundle_product_grid")
                          [i].querySelector(
                          ".frenzy_bundle_product_checkbox_val"
                        ).checked
                      ) {
                          let bundle_sku = $bundle_btn_this
                            .closest(".frenzy_bundle_innercode")
                            .querySelectorAll(
                              ".frenzy_product_bundle_row .frenzy_bundle_product_grid"
                            )
                            [i].querySelector(
                            ".frenzy_bundle_product_img img"
                          )
                            ? $bundle_btn_this
                              .closest(".frenzy_bundle_innercode")
                              .querySelectorAll(
                                ".frenzy_product_bundle_row .frenzy_bundle_product_grid"
                              )
                              [i].querySelector(
                              ".frenzy_bundle_product_img img"
                            )
                              .getAttribute("data-sku")
                            : "";
                          let source = {
                              sku: product_id_Frenzy + "_" + variant_id_Frenzy,
                          };
                          let properties = {
                              _frenzy_bundle_products: "111",
                              _config_id:
                                $bundle_btn_this.getAttribute(
                                  "data-config_id"
                                ) != "undefined"
                                  ? $bundle_btn_this.getAttribute(
                                  "data-config_id"
                                  )
                                  : "",
                              _event_name:
                                $bundle_btn_this.getAttribute("data-name") +
                                "_add_to_cart",
                              _query_id:
                                $bundle_btn_this.getAttribute(
                                  "data-request_id"
                                ),
                              _user_id: user_id_Frenzy.toString(),
                              _sku: bundle_sku,
                              _source: source,
                          };
                          $frenzy_bundle_pids.push({
                              id: $frenzy_bundle_parent
                                .querySelectorAll(
                                  ".frenzy_bundle_product_grid"
                                )
                                [i].querySelector(
                                ".frenzy_bundle_product_checkbox_val"
                              ).value,
                              quantity: 1,
                              properties: properties,
                          });
                      }
                  }
                  const $frenzy_bundle_formData = {
                      items: $frenzy_bundle_pids,
                  };
                  $frenzy_bundle_addtocart_fetch(
                    $bundle_btn_this,
                    $frenzy_bundle_formData
                  );
              });
          });
    }
};
const $frenzy_bundle_add_final_total = function (
  $frenzy_bundle_parent,
  $bundle_loop_this,
  $frenzy_bundle_min_limit,
  $frenzy_total_qty,
  $frenzy_bundle_total,
  $frenzy_bundle_org_total
) {
    if ($frenzy_bundle_min_limit <= $frenzy_total_qty) {
        $bundle_loop_this.forEach(($bundle_grid_this, $bundle_grid_idx) => {
            let $frenzy_bundle_p_temp_price = parseFloat(
              $bundle_grid_this
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .getAttribute("data-price")
            );
            let $frenzy_bundle_p_temp_org_price = parseFloat(
              $bundle_grid_this
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .getAttribute("data-orgprice")
            );
            let $frenzy_bundle_p_temp_is_discount =
              $bundle_grid_this
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .getAttribute("data-is_discount");
            let $frenzy_bundle_p_temp_compare_price = parseFloat(
              $bundle_grid_this
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .getAttribute("data-org_msrp_price")
            );


            $bundle_grid_this.querySelector(
              ".frenzy_bundle_product_main_price"
            ).innerHTML =
              '<span class="money">' +
              money_format_Frenzy(
                $frenzy_bundle_p_temp_price,
                frenzy_shop_currency
              ) +
              "</span>";
            if (
              $bundle_grid_this.querySelector(
                ".frenzy_bundle_product_compare_price"
              )
            ) {
                if($frenzy_bundle_p_temp_is_discount != 'false'){
                    $bundle_grid_this.querySelector(
                      ".frenzy_bundle_product_compare_price"
                    ).innerHTML =
                      '<span class="money">' +
                      money_format_Frenzy(
                        $frenzy_bundle_p_temp_org_price,
                        frenzy_shop_currency
                      ) +
                      "</span>";
                }else{
                    $bundle_grid_this.querySelector(
                      ".frenzy_bundle_product_compare_price"
                    ).innerHTML =
                      '<span class="money">' +
                      money_format_Frenzy(
                        $frenzy_bundle_p_temp_compare_price,
                        frenzy_shop_currency
                      ) +
                      "</span>";
                }

            }
        });
        $frenzy_bundle_parent.querySelector(
          ".frenzy_bundle_final_total"
        ).innerHTML =
          '<span class="money">' +
          money_format_Frenzy($frenzy_bundle_total, frenzy_shop_currency) +
          "</span>";
    } else {
        $bundle_loop_this.forEach(($bundle_grid_this, $bundle_grid_idx) => {
            let $frenzy_bundle_p_temp_price = parseFloat(
              $bundle_grid_this
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .getAttribute("data-orgprice")
            );
            let $frenzy_bundle_p_compare_price = parseFloat(
              $bundle_grid_this
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .getAttribute("data-org_msrp_price")
            );
            $bundle_grid_this.querySelector(
              ".frenzy_bundle_product_main_price"
            ).innerHTML =
              '<span class="money">' +
              money_format_Frenzy(
                $frenzy_bundle_p_temp_price,
                frenzy_shop_currency
              ) +
              "</span>";
            if (
              $bundle_grid_this.querySelector(
                ".frenzy_bundle_product_compare_price"
              )
            ) {
                if($frenzy_bundle_p_compare_price != 0 && $frenzy_bundle_p_temp_price != $frenzy_bundle_p_compare_price){
                    $bundle_grid_this.querySelector(
                      ".frenzy_bundle_product_compare_price"
                    ).innerHTML = '<span class="money">' +
                      money_format_Frenzy(
                        $frenzy_bundle_p_compare_price,
                        frenzy_shop_currency
                      ) +
                      "</span>";
                }else{
                    $bundle_grid_this.querySelector(
                      ".frenzy_bundle_product_compare_price"
                    ).innerHTML = '';
                }

            }
        });
        $frenzy_bundle_parent.querySelector(
          ".frenzy_bundle_final_total"
        ).innerHTML =
          '<span class="money">' +
          money_format_Frenzy(
            $frenzy_bundle_org_total,
            frenzy_shop_currency
          ) +
          "</span>";
    }
};
const $frenzy_bundle_final_total = function ($frenzy_bundle_parent, settingData
) {
    let $frenzy_bundle_total = 0,
      $frenzy_bundle_org_total = 0,
      $frenzy_total_qty = 0,
      $frenzy_bundle_checked_count = 0;
    let frenzy_bundle_current_check = 0;
    const $frenzy_bundle_min_limit = parseInt(
      $frenzy_bundle_parent.getAttribute("data-minqty")
    );
    $frenzy_bundle_parent
      .querySelectorAll(".frenzy_bundle_product_checkbox_val")
      .forEach(($bundle_checkbox_this, $bundle_checkbox_idx) => {
          if ($bundle_checkbox_this.checked) {
              frenzy_bundle_current_check = frenzy_bundle_current_check + 1;
              $frenzy_bundle_total =
                parseFloat(
                  $bundle_checkbox_this.getAttribute("data-price")
                ) + $frenzy_bundle_total;
              $frenzy_bundle_org_total =
                parseFloat(
                  $bundle_checkbox_this.getAttribute("data-orgprice")
                ) + $frenzy_bundle_org_total;
              $frenzy_total_qty++;
              $frenzy_bundle_checked_count = $frenzy_bundle_checked_count + 1;
              document
                .querySelector(
                  '.frenzy_product_bundle_image .frenzy_bundle_product_grid[data-index="' +
                  $bundle_checkbox_idx +
                  '"]'
                )
                .setAttribute("data-checked", frenzy_bundle_current_check);
          } else {
              document
                .querySelector(
                  '.frenzy_product_bundle_image .frenzy_bundle_product_grid[data-index="' +
                  $bundle_checkbox_idx +
                  '"]'
                )
                .setAttribute("data-checked", "0");
          }
      });
    if ($frenzy_bundle_total == 0) {
        document.querySelector(".frenzy_bundle_cta_atc").disabled = true;
    } else {
        document.querySelector(".frenzy_bundle_cta_atc").disabled = false;
    }
    document
      .querySelector(".frenzy_product_bundle_image")
      .setAttribute("data-checkedcount", $frenzy_bundle_checked_count);
    let $bundle_loop_this = $frenzy_bundle_parent.querySelectorAll(
      ".frenzy_pb_details .frenzy_bundle_product_grid"
    );
    $frenzy_bundle_add_final_total(
      $frenzy_bundle_parent,
      $bundle_loop_this,
      $frenzy_bundle_min_limit,
      $frenzy_total_qty,
      $frenzy_bundle_total,
      $frenzy_bundle_org_total
    );
};
const $frenzy_bundle_checkobox_event = function (data,settingData) {

    if (document.querySelector(".frenzy_bundle_product_checkbox_val")) {
        document.querySelectorAll(".frenzy_bundle_product_checkbox_val").forEach(($bundle_checkbox_this, $bundle_checkbox_idx) => {
            $bundle_checkbox_this.addEventListener("change", (event) => {
                event.preventDefault(), event.stopImmediatePropagation();
                const $frenzy_bundle_parent = $bundle_checkbox_this.closest(".frenzy_bundle_id").querySelector(".frenzy_bundle_innercode");

                if ($bundle_checkbox_this.checked) {
                    $bundle_checkbox_this.setAttribute(
                      "checked",
                      "checked"
                    );
                    $bundle_checkbox_this.closest(".frenzy_bundle_product_details")?.classList.remove("frenzy_disabled_product");
                    $bundle_checkbox_this.closest(".frenzy_bundle_id").querySelectorAll(".frenzy_product_bundle_image .frenzy_bundle_product_grid").forEach(function (this_check) {
                        if (
                          parseFloat(this_check.getAttribute("data-index")) === $bundle_checkbox_idx
                        ) {
                            this_check.classList.remove("frenzy_disabled_product");
                        }
                    });
                } else {
                    $bundle_checkbox_this.removeAttribute("checked");
                    $bundle_checkbox_this
                      .closest(".frenzy_bundle_product_details")
                      ?.classList.add("frenzy_disabled_product");
                    $bundle_checkbox_this.closest(".frenzy_bundle_id").querySelectorAll(".frenzy_product_bundle_image .frenzy_bundle_product_grid").forEach(function (this_check) {
                        if (
                          parseFloat(
                            this_check.getAttribute("data-index")
                          ) === $bundle_checkbox_idx
                        ) {
                            this_check.classList.add(
                              "frenzy_disabled_product"
                            );
                        }
                    });
                }
                if (typeof FrenzyAfterBundlePriceChangeCallBack == "function") {
                    FrenzyAfterBundlePriceChangeCallBack(data,settingData);
                }
                $frenzy_bundle_final_total($frenzy_bundle_parent, settingData);
            });
            $bundle_checkbox_this.addEventListener('keypress', function(e){
                if (e.which === 13) {
                    $bundle_checkbox_this.click();
                }
              });
              $bundle_checkbox_this.dispatchEvent(new Event("change"));
          });
    }
    // Bundle Product Option
    document
      .querySelectorAll(".frenzy_bo_option")
      .forEach(function (this_click,index) {
          this_click.addEventListener("change", function (event) {
              const frenzy_pvariantId = event.target.value;
              const frenzy_etp =
                event.target.options[event.target.options.selectedIndex];
              const frenzy_p_price = parseFloat(frenzy_etp.dataset.price);
              const frenzy_p_orgprice = parseFloat(
                frenzy_etp.dataset.orgprice
              );
              const frenzy_p_image = frenzy_etp.dataset.image;
              const data_index = this_click.closest(".frenzy_bundle_product_grid").getAttribute('data-index');
              if(frenzy_p_image != ''){
                if (
                  this_click
                    .closest(".frenzy_bundle_innercode")
                    .querySelector(".frenzy_product_bundle_image .frenzy_bundle_product_grid[data-index='"+data_index+"'] .frenzy_bundle_product_img img")
                ) {
                    this_click
                      .closest(".frenzy_bundle_innercode")
                      .querySelector(".frenzy_product_bundle_image .frenzy_bundle_product_grid[data-index='"+data_index+"'] .frenzy_bundle_product_img img").src =
                      frenzy_p_image;
                }
              }
              if (
                this_click
                  .closest(".frenzy_bundle_product_details")
                  .querySelector(
                    ".frenzy_bundle_product_compare_price span.money"
                  )
              ) {
                  this_click
                    .closest(".frenzy_bundle_product_details")
                    .querySelector(
                      ".frenzy_bundle_product_compare_price span.money"
                    ).innerHTML = money_format_Frenzy(
                    frenzy_p_orgprice,
                    frenzy_shop_currency
                  );
              }
              this_click
                .closest(".frenzy_bundle_product_details")
                .querySelector(
                  ".frenzy_bundle_product_main_price span.money"
                ).innerHTML = money_format_Frenzy(
                frenzy_p_price,
                frenzy_shop_currency
              );
              this_click
                .closest(".frenzy_bundle_product_details")
                .querySelector(
                  ".frenzy_bundle_product_checkbox_val"
                ).value = frenzy_pvariantId;
              this_click
                .closest(".frenzy_bundle_product_details")
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .setAttribute("data-price", frenzy_p_price);
              this_click
                .closest(".frenzy_bundle_product_details")
                .querySelector(".frenzy_bundle_product_checkbox_val")
                .setAttribute("data-orgprice", frenzy_p_orgprice);
              let $bundle_checkbox_this = this_click
                .closest(".frenzy_bundle_product_grid_inner")
                .querySelector(".frenzy_bundle_product_checkbox_val");
              $bundle_checkbox_this.dispatchEvent(new Event("change"));
          });
      });
};
const $frenzy_bundle_product_grid = function (
  $bundle_data,
  settingData,
  settingCss,
  index
) {
    $frenzy_bundle_discount = parseFloat(settingData.discount_amount);
    $frenzy_bundle_discount_type = settingData.discount_type;
    const frenzy_bundle_limit = parseFloat(settingData.total_items);
    const frenzy_bundle_uncheck_grid =
      settingData?.uncheck_grid == "hide" ? "frenzy_uncheck_grid_hide" : "disable";
    let $frenzy_bundle_p_grid =
      '<div class="frenzy_product_bundle_row frenzy_product_bundle_image ' +
      frenzy_bundle_uncheck_grid +
      " ltg_" +
      settingData.grid_items_per_row +
      '">';
      let bundle_product_title_label = settingData.bundle_product_title_label ? settingData.bundle_product_title_label : 'This item';
    ($bundle_data.data.matching_products || []).map(
      ($bundle_product, $bundle_idx) => {
          const frenzy_current_product =
            product_id_Frenzy == $bundle_product.product_id
              ? "frenzy-current-product"
              : "";
          if ($bundle_idx < frenzy_bundle_limit) {
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_grid" data-index="' +
                $bundle_idx +
                '"><div class="frenzy_bundle_product_grid_inner">';
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_img ' +
                frenzy_current_product +
                '" >';
              $frenzy_bundle_p_grid +=
                product_id_Frenzy == $bundle_product.product_id
                  ? ""
                  : '<a href="' + frenzy_root_url + Shopify.routes.root + 'products/' +
                  $bundle_product.org_prod_url +
                  '" data-config_id="' +
                  $bundle_data.data.config_id +
                  '" onclick="frenzyEventsClick(this)" data-sku="' +
                  $bundle_product.sku +
                  '" data-name="bundle" data-request_id="' +
                  $bundle_data.data.request_id +
                  '">';
              let $frenzy_bundle_p_img =
                $bundle_product.org_image_url.split(" ");
              $frenzy_bundle_p_grid +=
                '<img src="' +
                $frenzy_bundle_p_img[0] +
                '" data-sku="' +
                $bundle_product.sku +
                '" alt="' +
                $bundle_product.org_product +
                '" />';
              $frenzy_bundle_p_grid +=
                product_id_Frenzy == $bundle_product.product_id
                  ? ""
                  : "</a>";
              $frenzy_bundle_p_grid += "</div></div></div>";
          }
      }
    );
    $frenzy_bundle_p_grid += "</div>";
    $frenzy_bundle_p_grid +=
      '<div class="frenzy_product_bundle_row frenzy_pb_details ltg_' +
      settingData.grid_items_per_row +
      '">';
    let this_item_lable_status = 0;

    ($bundle_data.data.matching_products || []).map(
      ($bundle_product, $bundle_idx) => {
          if ($bundle_idx < frenzy_bundle_limit) {
              let is_sale = '';
              let $frenzy_bundle_sale_price = $bundle_product.org_price * 100,
                $frenzy_bundle_compare_price =
                  $bundle_product.org_price * 100;
              const frenzy_current_product =
                product_id_Frenzy == $bundle_product.product_id
                  ? "frenzy-current-product"
                  : "";
              const frenzyBundleMinProduct = parseInt(
                settingData.min_product
              );
              let is_discount = false;
              if($frenzy_bundle_discount > 0){
                  is_discount = true;
                  $frenzy_bundle_sale_price =
                    $frenzy_bundle_discount_type == "percentage"
                      ? ($bundle_product.org_price *
                      100 *
                      (100 - $frenzy_bundle_discount)) /
                      100
                      : $bundle_product.org_price * 100 -
                      $frenzy_bundle_discount * 100;
              }else{
                  if($bundle_product.org_msrp_price != 0 && $bundle_product.org_msrp_price != null && $bundle_product.org_price != $bundle_product.org_msrp_price ){
                      is_sale = ' is_sale';
                  }
              }
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_grid" data-index="'+$bundle_idx+'"><div class="frenzy_bundle_product_grid_inner">';
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_details"><div class="frenzy_bundle_product_details_inner">';
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_ctt">';
              let $frenzy_bundle_p_sku = $bundle_product.sku.split("_");
              let product_handle = $bundle_product.org_prod_url;
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_checkbox"><input data-handle="'+product_handle+'" id="bundle_'+index+'_product_'+$bundle_idx+'" type="checkbox" class="frenzy_bundle_product_checkbox_val" value="' +
                $frenzy_bundle_p_sku[1] +
                '" data-price="' +
                $frenzy_bundle_sale_price +
                '" data-orgprice="' +
                $frenzy_bundle_compare_price +
                '" data-org_msrp_price="' +
                $bundle_product.org_msrp_price * 100 +
                '" data-is_discount="' +
                is_discount +
                '" checked="checked"><label for="bundle_'+index+'_product_'+$bundle_idx+'"><span class="visually-hidden">'+$bundle_product?.org_product+' Bundle Checkbox</span></label></div>';
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_title"><h6>';
              $frenzy_bundle_p_grid +=
                product_id_Frenzy == $bundle_product.product_id
                  ? ""
                  : '<a href="' + frenzy_root_url + Shopify.routes.root +'products/' +
                  $bundle_product.org_prod_url +
                  '" onclick="frenzyEventsClick(this)" data-sku="' +
                  $bundle_product.sku +
                  '" data-name="bundle" data-request_id="' +
                  $bundle_data.data.request_id +
                  '">';
              if (product_id_Frenzy == $bundle_product.product_id && this_item_lable_status != 1) {
                  $frenzy_bundle_p_grid += "<span>"+bundle_product_title_label+":</span>";
                  this_item_lable_status = 1;
              }
              $frenzy_bundle_p_grid += $bundle_product.org_product;
              $frenzy_bundle_p_grid +=
                product_id_Frenzy == $bundle_product.product_id
                  ? ""
                  : "</a>";
              $frenzy_bundle_p_grid += "</h6></div>";
              $frenzy_bundle_p_grid += "</div>";
              $frenzy_bundle_p_grid +=
                '<div class="frenzy_bundle_product_price">';

              if($frenzy_bundle_compare_price > $frenzy_bundle_sale_price){
                  is_sale = ' is_sale';
              }
              $frenzy_bundle_p_grid +=
                '<span class="frenzy_bundle_product_main_price'+is_sale+'"><span class="money">' +
                money_format_Frenzy(
                  $frenzy_bundle_sale_price,
                  frenzy_shop_currency
                ) +
                "</span></span>";
              if ($frenzy_bundle_compare_price > $frenzy_bundle_sale_price) {
                  $frenzy_bundle_p_grid +=
                    '<span class="frenzy_bundle_product_compare_price"><span class="money">' +
                    money_format_Frenzy(
                      $frenzy_bundle_compare_price,
                      frenzy_shop_currency
                    ) +
                    "</span></span>";
              }else{
                  if($bundle_product.org_msrp_price != 0 && $bundle_product.org_msrp_price != null && $bundle_product.org_price != $bundle_product.org_msrp_price ){
                      $frenzy_bundle_p_grid +=
                        '<span class="frenzy_bundle_product_compare_price"><span class="money">' +
                        money_format_Frenzy(
                          $frenzy_bundle_compare_price,
                          frenzy_shop_currency
                        ) +
                        "</span></span>";
                  }
              }
              $frenzy_bundle_p_grid += "</div></div>";
              if (typeof FrenzyBundleExtraDetailsCallBack == "function") {
                  $frenzy_bundle_p_grid += FrenzyBundleExtraDetailsCallBack($bundle_product);
              }
              const frenzy_select_option_type =
                settingData?.select_option == "all_options"
                  ? "all_options"
                  : "size";
              ($bundle_product?.options || []).map((x, i) => {
                  if (x.name === frenzy_select_option_type) {
                      frenzyBundleOptionCount = 0;
                      (x?.data || []).map((y, j) => {
                          if (y.stock_amount > 0) {
                              frenzyBundleOptionCount =
                                frenzyBundleOptionCount + 1;
                          }
                      });
                  }
              });
              if (
                settingData?.show_variant_option === "1" &&
                frenzyBundleOptionCount >= 1
              ) {
                  ($bundle_product?.options || []).map((x, i) => {
                      if (x.name === frenzy_select_option_type && x.data) {
                          if (
                            x.data[0]?.label != null &&
                            x.data[0]?.label != "Default Title"
                          ) {
                              $frenzy_bundle_p_grid +=
                                '<div class="frenzy_bundle_options"><select aria-label="'+$bundle_product?.org_product+' Bundle Selection" name="frenzy_bo_option" class="frenzy_bo_option frenzySelectBox">';
                              (x?.data || []).map((y, j) => {
                                  if (y.stock_amount > 0) {
                                      let frenzyBundleOptionselectedImg = "";
                                      if (y?.org_image_url?.includes(" ")) {
                                          const optionImg =
                                            y.org_image_url.split(" ");
                                          frenzyBundleOptionselectedImg =
                                            FrenzyImageResizer(
                                              optionImg[0],
                                              FrenzyProImgSize
                                            );
                                      } else {
                                        if(y?.org_image_url){
                                          frenzyBundleOptionselectedImg =
                                            FrenzyImageResizer(
                                              y.org_image_url,
                                              FrenzyProImgSize
                                            );
                                        }
                                      }
                                      const frenzy_option_price =
                                        $frenzy_bundle_discount_type ==
                                        "percentage"
                                          ? (y.org_price *
                                          100 *
                                          (100 -
                                            $frenzy_bundle_discount)) /
                                          100
                                          : y.org_price * 100 -
                                          $frenzy_bundle_discount * 100;
                                      let selected_bundle_dropbox = "";
                                      if (
                                        $frenzy_bundle_p_sku[1] ==
                                        y.variant_id
                                      ) {
                                          selected_bundle_dropbox =
                                            'selected="selected"';
                                      }
                                      $frenzy_bundle_p_grid +=
                                        '<option value="' +
                                        y.variant_id +
                                        '" ' +
                                        selected_bundle_dropbox +
                                        ' data-orgprice="' +
                                        y.org_price * 100 +
                                        '" data-price="' +
                                        frenzy_option_price +
                                        '" data-image="' +
                                        frenzyBundleOptionselectedImg +
                                        '">' +
                                        y.label +
                                        "</option>";
                                  }
                              });
                              $frenzy_bundle_p_grid += "</select></div>";
                          }
                      }
                  });
              }
              $frenzy_bundle_p_grid += "</div>";
              $frenzy_bundle_p_grid += "</div></div>";
          }
      }
    );
    $frenzy_bundle_p_grid += "</div>";
    return $frenzy_bundle_p_grid;
};
const $frenzy_bundle_section_html = function ($bundle_data,index) {
    const all_product_data = $bundle_data?.data;
    const bundleClass = document.querySelectorAll('.frenzy_bundle_id')[index].classList[1];
    const settingData = $bundle_data?.data?.settings ? $bundle_data?.data?.settings : $bundle_data?.data?.bundle_recommendation;
    const settingCss = $bundle_data?.data?.css ? $bundle_data?.data?.css : $bundle_data?.data?.bundle_recommendation_css;
    const title_align =
      settingData.title_align === "1"
        ? "text_align-left"
        : settingData.title_align === "2"
        ? "text_align-right"
        : "text_align-center";
    const cta_button_label = settingData.bundle_cta_button_label ? settingData.bundle_cta_button_label : 'Add to cart';
    let $frenzy_bundle_html =
      '<div class="frenzy_container"><div class="frenzy_bundle_innercode" data-discount="' +
      settingData.discount_amount +
      '" data-discounttype="' +
      settingData.discount_type +
      '" data-minqty="' +
      settingData.min_product +
      '">';
    $frenzy_bundle_html +=
      '<h2 class="frenzy_recommendation_title ' +
      title_align +
      '">' +
      settingData.grid_title +
      "</h2>";
    $frenzy_bundle_html += $frenzy_bundle_product_grid(
      $bundle_data,
      settingData,
      settingCss,
      index
    );
    $frenzy_bundle_html +=
      '<div class="frenzy_bundle_cta_section"><div class="frenzy_bundle_cta_inner">';
    $frenzy_bundle_html +=
      '<button type="button" value="add_to_cart" data-request_id="' +
      $bundle_data.data.request_id +
      '" data-config_id="' +
      $bundle_data.data.config_id +
      '" data-name="bundle" class="button btn frenzy_bundle_cta_atc"><span class="frenzy_button_text">'+cta_button_label+'</span><em>&nbsp;-&nbsp;</em><span class="frenzy_bundle_final_total"></span></button>';
    $frenzy_bundle_html += "</div></div>";
    $frenzy_bundle_html += "</div>";
    $frenzy_bundle_html += "</div></div>";
    if ($bundle_data.data.matching_products.length !== 0) {
        frenzyMultipleBundles[index].innerHTML = $frenzy_bundle_html;
        $frenzy_bundle_checkobox_event($bundle_data, settingData);
        $frenzy_bundle_addtocart_event();
    }
    var frenzy_pb_details = frenzyMultipleBundles[index]?.querySelectorAll(".frenzy_pb_details .frenzy_bundle_product_grid");
    if(frenzy_pb_details?.length >= 1){
      frenzy_pb_details.forEach(function(this_section){
        if(this_section.querySelector('.frenzy_bo_option')){
         var selected_val = this_section.querySelector('.frenzy_bo_option').value;
         this_section.querySelector('.frenzy_bundle_product_checkbox_val').value = selected_val;
        }
      });
    }
    let cssdata =
      ".frenzy_bundle_id."+bundleClass+" .frenzy_recommendation_title {font-size:" +
      settingCss.title_font_size +
      "px;color:#" +
      settingCss.text_color +
      "} " +
      ".frenzy_bundle_id."+bundleClass+" .frenzy_bundle_product_main_price.is_sale{color:#" +
      settingCss?.sale_price_color +
      "} " +
      ".frenzy_bundle_id."+bundleClass+" .frenzy_bundle_product_main_price{color:#" +
      settingCss.price_color +
      "} " +
      ".frenzy_bundle_id."+bundleClass+" .frenzy_bundle_product_compare_price{color:#" +
      settingCss.compare_price_color +
      "} ";
    if(settingData?.image_border_show == "1") {
        cssdata += ".frenzy_bundle_id."+bundleClass+" .frenzy_bundle_product_grid .frenzy_bundle_product_img{border:1px solid #fff;}";
        if(settingCss?.card_border_color){
          cssdata += ".frenzy_bundle_id."+bundleClass+" .frenzy_bundle_product_grid .frenzy_bundle_product_img{border-color: #" + settingCss.card_border_color +";} ";
        }
    }
    let head_Frenzy = document.head || document.getElementsByTagName("head")[0],
      style_Frenzy = document.createElement("style");
    head_Frenzy.appendChild(style_Frenzy);
    style_Frenzy.type = "text/css";
    if (style_Frenzy.styleSheet) {
        style_Frenzy.styleSheet.cssText = cssdata;
    } else {
        style_Frenzy.appendChild(document.createTextNode(cssdata));
    }
    if (typeof FrenzyBundleAfterDetailsCallBack == "function") {
        FrenzyBundleAfterDetailsCallBack($bundle_data.data.matching_products, $frenzy_bundle_html,index);
    }
    if (typeof frenzAfterApiCallBack == "function") {
        frenzAfterApiCallBack(all_product_data);
    }
};
frenzyMultipleBundles = document.querySelectorAll('.frenzy_bundle_id');
window.$frenzy_bundle_event = async () => {
    frenzyMultipleBundles = document.querySelectorAll('.frenzy_bundle_id');
    // Ensure frenzyMultipleBundles is an array
    const bundlesArray = Array.isArray(frenzyMultipleBundles) ? frenzyMultipleBundles : Array.from(frenzyMultipleBundles);
    await Promise.all(bundlesArray.map(async function(self, index) {
        frenzy_bundle_config = self.getAttribute("data-config_id") || null;
        const bundleCartClass = self.classList.contains('frenzy_bundle_cartid');
        let $bundle_frenzy_sku = "";
        if (product_id_Frenzy && variant_id_Frenzy) {
            $bundle_frenzy_sku = product_id_Frenzy + "_" + variant_id_Frenzy;
        }
        if(bundleCartClass){
            $bundle_frenzy_sku = frenzyAllSkus[0] || '';
          }
          
        var data_json = {
            sku: $bundle_frenzy_sku,
            shop: frenzyShop,
            user_id: user_id_Frenzy.toString(),
            num_matching: 15,
            full_description: true,
            config_id: frenzy_bundle_config,
            currency: Shopify?.currency?.active ? Shopify?.currency?.active : '',
            country: Shopify.country ? Shopify.country : '',
            company_id: frenzy_company_id ? frenzy_company_id : null,
            location_id: frenzy_location_id ? frenzy_location_id : null
        };
        if(bundleCartClass){
          data_json = {...data_json,['cart_skus']:frenzyAllSkus};         
        }
        const response = await fetch(authUrl_Frenzy + "/bundle", {
            method: "POST",
            body: JSON.stringify(data_json),
            headers: {
                "Content-Type": "application/json",
                "x-frenzy-authorization": frenzy_api_key,
                "X-Shop": frenzyShop
            },
        });
        const data = await response.json();
        if (data.status === 200) {
            const globalSetting = data?.data?.global_setting;

        const tempSettingData = data?.data?.settings ? data?.data?.settings : data?.data?.bundle_recommendation;

        if(tempSettingData && tempSettingData?.cart_redirect == 1){
           isFrenzyBundleRedirectOption = 1;
        }
        FrenzyProductImgResize(globalSetting);
        $frenzy_bundle_section_html(data,index);
        }
    }));
};
if (document.querySelector(".frenzy_bundle_id")) {
    $frenzy_bundle_event();
}
/* home page */
if(__st.p == 'home'){
   let home_urlParams_Frenzy = new URLSearchParams(window.location.search);
    let frenzy_cookie_user_id = home_urlParams_Frenzy.get("frenzy_cookie_user_id");
    if(frenzy_cookie_user_id && frenzy_cookie_user_id == "true"){
        let frenzy_cookie_modal_html = '<div class="frenzy_modal_cookie_popup show">';
        frenzy_cookie_modal_html += '<div class="frenzy_modal_main"><div class="frenzy_modal_top_bar">';
          frenzy_cookie_modal_html += '<span class="frenzy_modal_close_btn"><svg viewBox="0 0 20 20"><path d="m11.414 10 4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path></svg></span></div>';
          frenzy_cookie_modal_html += '<div class="frenzy_modal_content">';
            frenzy_cookie_modal_html += '<label>User ID</label>';
            frenzy_cookie_modal_html += '<div class="frenzy_modal_input_area">';
              frenzy_cookie_modal_html += '<input type="text" id="frenzy_user_id" value="'+user_id_Frenzy+'"><button id="frenzy_user_id_copy">';
                frenzy_cookie_modal_html += '<svg viewBox="0 0 20 20" class="frenzy-cc-copy-icon"><path fill-rule="nonzero" d="M2.75 18.25H14a.75.75 0 1 1 0 1.5H2a.75.75 0 0 1-.75-.75V5a.75.75 0 0 1 1.5 0v13.25zM6 .25h12a.75.75 0 0 1 .75.75v14a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V1A.75.75 0 0 1 6 .25zm.75 1.5v12.5h10.5V1.75H6.75z"></path></svg>';
                frenzy_cookie_modal_html += '<svg class="frenzy-cc-true-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="nonzero" d="M15.948 5.47a.75.75 0 1 1 1.06 1.06l-8.485 8.486a.75.75 0 0 1-1.06 0L3.22 10.773a.75.75 0 0 1 1.06-1.06l3.713 3.712 7.955-7.955z"></path></svg>';
              frenzy_cookie_modal_html +='</button>';
            frenzy_cookie_modal_html += '</div>';
          frenzy_cookie_modal_html += '</div>';
        frenzy_cookie_modal_html += '</div>';
        frenzy_cookie_modal_html += '</div>';
      document.querySelector('body').insertAdjacentHTML("beforeend", frenzy_cookie_modal_html);
      document.getElementById('frenzy_user_id_copy').addEventListener('click', function() {
        var frenzy_user_id = document.getElementById('frenzy_user_id');
        frenzy_user_id.select();
        frenzy_user_id.setSelectionRange(0, 99999);
      
        document.execCommand('copy');
        document.querySelector('.frenzy-cc-copy-icon').style.display = 'none';
        document.querySelector('.frenzy-cc-true-icon').style.display = 'block';
      });

      if(document.querySelector('.frenzy_modal_close_btn')){
        document.querySelector('.frenzy_modal_close_btn').addEventListener('click', function(){
          if(document.querySelector('.frenzy_modal_cookie_popup')){
            document.querySelector('.frenzy_modal_cookie_popup').classList.remove('show');
            window.location.href = '/';
          }
          });
        }
        window.addEventListener('click', ({ target }) => {
          if (!target.closest('.frenzy_modal_main')) {
             document.querySelector('.frenzy_modal_cookie_popup').classList.remove('show');
             window.location.href = '/';
          }
      });
      }
}

function revert_data(data) {
    // session_status = true;
    frenzyPageScroll = true;

    var position = parseInt(data.position);
    if (get_frenzy_search_page_section) {
        search_query = new URL(window.location.href).searchParams.get("q");
        var frenzyPageNo = parseInt(data.frenzypageNo);
        frenzyPageScrollNo = frenzyPageNo;
        var frenzySessionData = data.frenzycollectdata;
        data = { data: frenzySessionData };
        dataPageName = "search";
    }
    if (get_frenzy_collection_page_section) {
        var frenzyPageNo = parseInt(data.frenzypageNo);
        frenzyPageScrollNo = frenzyPageNo;
        last_page = frenzyPageNo;
        var frenzySessionData = data.frenzycollectdata;
        data = { data: frenzySessionData };
        dataPageName = "collection";
    }
    selected_page_Frenzy = frenzyPageScrollNo + 1;
    let productSearchPageSetting = data.data.search_page;
    const productResults = data.data.results.results;
    const productGridHtml = data.data.recommendation_html;
    const sideBarFields = data.data.results.facet_fields;
    const total_record = data.data.results.products_found;
    const total_page = data.data.results.page_count;
    const corrected_query = data.data.results.corrected_query;
    let no_search_result = productSearchPageSetting?.no_search_result;
    let no_search_result_html = productSearchPageSetting?.no_search_result_html;
    const all_product_data = data.data;
    const collectionBody = data.data.results.collection_body;
    filterArray_Frenzy = { org_price: { min: FRENZY_MIN_PRICE, max: FRENZY_MAX_PRICE } };

    updatePriceRangeValues(data.data.results.stats.org_price, data.data.results.filters.org_price);

    const colorSwatches = data.data.results.color_swatches || [];
    const languageText = data.data.label_text;
    filter_order_Frenzy = [];

    const obj_filters = data.data.results.filters;
    const obj_facet_fields = data.data.results.facet_fields;
    Object.keys(obj_filters).map((key, index) => {
        if (obj_facet_fields[key] && key != "org_price") {
            filterArray_Frenzy[key] = [];
            (obj_filters[key] || []).map((x, i) => {
                filterArray_Frenzy[key].push(x);
            });
        }
    });
    const frenzy_request_id = data.data.results.request_id;
    const globalSetting = data?.data?.global_setting;

    if (get_frenzy_search_page_section) {
        let searchPageCss = data.data.search_page_css;
        let productSearchPageSetting = data.data.search_page;
        sidebar_filter_open_hide = sessionStorage.getItem("search_sidebar_filter_hide");
        if(sidebar_filter_open_hide != ''){
            sidebar_filter_open_hide = sidebar_filter_open_hide; // 1 is show and 0 is hide
        }
        const frenzy_product_click = "search";
        (data.data.filter_order || []).map((x) => {
            let boj = {
                ...x,
                selected: 0,
            };
            filter_order_Frenzy.push(boj);
        });
        old_dataResults = old_dataResults.concat(data.data.results.results);
        FrenzyProductImgResize(globalSetting);
        setTimeout(function () {
            getSearchPage(
                productResults,
                productSearchPageSetting,
                searchPageCss,
                productGridHtml,
                sideBarFields,
                filter_order_Frenzy,
                total_record,
                total_page,
                corrected_query,
                filterArray_Frenzy,
                frenzy_request_id,
                frenzy_product_click,
                colorSwatches,
                languageText,
                all_product_data
            );

          if (data?.data?.results?.products_found === 0) {
             if(no_search_result == true){
               if(no_search_result_html.includes("frenzy_recommendation_section")){
                   get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                   get_frenzy_recommendation_section = document.querySelector(".frenzy_recommendation_section");
                   frenzy_recom_api = "/personalized-recommendation";
                   getRecommendationProductsApi();
               }else if(no_search_result_html.includes("frenzy_most_clicked_skus_section")){
                  get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                  get_frenzy_most_clicked_skus_section = document.querySelector(".frenzy_most_clicked_skus_section");
                  getMostClickedSkusApi();
               }else if(no_search_result_html.includes("frenzy_cross_sell_carousel_section")){
                  get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                  get_frenzy_cross_sell_carousel_section = document.querySelector(".frenzy_cross_sell_carousel_section");
                  getCrossSellCarouselApi();
               }else if(no_search_result_html.includes("frenzy_cart_page_section")){
                  get_frenzy_search_page_section.insertAdjacentHTML('afterend',no_search_result_html);
                  get_frenzy_cart_page_section = document.querySelector(".frenzy_cart_page_section");
                  getCartPageApi();
               }
               get_frenzy_search_page_section.style.minHeight = 'initial';
             }
              //getSearchCarouselApi();
          }
        }, 100);
        frenzyScrollPosition = window.scrollY;
        if (document.getElementById("frenzyAutoLoad")) {
            frenzyAutoLoadTop =
                document.getElementById("frenzyAutoLoad").offsetTop;
        }
        const frenzyDocHeight = frenzyScrollPosition + window.innerHeight;
    }

    if (get_frenzy_collection_page_section) {
        const productSearchPageSetting = data.data.collection_page;
        sidebar_filter_open_hide = sessionStorage.getItem("sidebar_filter_hide");
        if(sidebar_filter_open_hide != ''){
            sidebar_filter_open_hide = sidebar_filter_open_hide; // 1 is show and 0 is hide
        }
        const collectionImg = data.data.results.collection_image;
        const frenzy_product_click = "collection";
        const collectionPageCss = data.data.collection_css;
        (data.data.collection_filter_order || []).map((x) => {
            let boj = {
                ...x,
                selected: 0,
            };
            filter_order_Frenzy.push(boj);
        });
        old_dataResults = old_dataResults.concat(data.data.results.results);
        FrenzyProductImgResize(globalSetting);
        setTimeout(function () {
            getCollectionsPage(
                productResults,
                productSearchPageSetting,
                collectionPageCss,
                productGridHtml,
                sideBarFields,
                filter_order_Frenzy,
                total_record,
                total_page,
                frenzy_request_id,
                frenzy_product_click,
                collectionImg,
                collectionBody,
                colorSwatches,
                languageText,
                all_product_data
            );
        }, 100);
        frenzyScrollPosition = window.scrollY;
        if (document.getElementById("frenzyAutoLoad")) {
            frenzyAutoLoadTop =
                document.getElementById("frenzyAutoLoad").offsetTop;
        }
        const frenzyDocHeight = frenzyScrollPosition + window.innerHeight;
    }
    setTimeout(function () {
        window.scrollTo({ top: position, behavior: "smooth" });

        var frenzyFlexTopbarContain = document.querySelector(".frenzy_flex_topbar_contain");
        if (frenzyFlexTopbarContain) {
            frenzyFlexTopbarContain.style.display = "none";
            frenzyFlexTopbarContain.style.display = "flex";
        }

        if (document.querySelector(".frenzy_topbar_count_col")) {
            document.querySelector(".frenzy_topbar_count_col").innerHTML =
                "<span>Showing " +
                total_record +
                " results</span>";
        }
    }, 100);
    if (frenzyPageNo + 1 == total_page) {
        frenzyPageScroll = false;
        session_status = false;
    }
}
let frenzywindowsLoad = true;
if (document.readyState !== "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelector("body").classList.remove("is-open-filter");
        if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
          if (frenzywindowsLoad) {
              frenzywindowsLoad = false;
              controlPageRefresh = true;
              frenzyScriptReload();
          }
        } else {
          let session_url = "";
          let current_url = window.location.href;
          let get_session_data_with_current_url =
              sessionStorage.getItem("frenzy-session");
          if (get_session_data_with_current_url != null) {
              get_session_data_with_current_url = JSON.parse(
                  get_session_data_with_current_url
              );
              session_url = get_session_data_with_current_url.url;
          }
            if (frenzywindowsLoad) {
                frenzywindowsLoad = false;
                frenzyScriptReload();
            }
        }
    });
} else {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelector("body").classList.remove("is-open-filter");
        if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
          if (frenzywindowsLoad) {
              frenzywindowsLoad = false;
              controlPageRefresh = true;
              frenzyScriptReload();
          }
        } else {
          let session_url = "";
          let current_url = window.location.href;
          let get_session_data_with_current_url =
              sessionStorage.getItem("frenzy-session");
          if (get_session_data_with_current_url != null) {
              get_session_data_with_current_url = JSON.parse(
                  get_session_data_with_current_url
              );
              session_url = get_session_data_with_current_url.url;
          }
          if (frenzywindowsLoad) {
              frenzywindowsLoad = false;
              frenzyScriptReload();
          }
        }
    });
}

const popstateHandler = (e) => {
    if(get_frenzy_search_page_section || get_frenzy_collection_page_section){
        let shopURL_Frenzy = window.location.origin;
        let searchURL_Frenzy = window.location.pathname;
        let urlParams_Frenzy = new URLSearchParams(window.location.search);
        let frenzyBlogfilterArray = [],
        frenzyAllSkus = [];
        (total_page_no_Frenzy = 0),
        (isFilterApplyPrice_Frenzy = false),
        (isDisabledApplyBtn_Frenzy = false),
        (frenzy_blog_search = ""),
        (isSeletedSortValue_Frenzy = "best match");
        filterArray_Frenzy = { org_price: { min: FRENZY_MIN_PRICE, max: FRENZY_MAX_PRICE } };
        selected_page_Frenzy = 1;
        if (urlParams_Frenzy.get("page")) {
          selected_page_Frenzy = parseInt(urlParams_Frenzy.get("page"));
        }
        if (urlParams_Frenzy.get("sort")) {
          isSeletedSortValue_Frenzy = urlParams_Frenzy.get("sort");
        }
        if (urlParams_Frenzy.get("articleSearch")) {
          frenzy_blog_search = urlParams_Frenzy.get("articleSearch");
        }
        if (urlParams_Frenzy.get("blogname")) {
          const frenzyBlogfilterclone = urlParams_Frenzy.get("blogname");
          frenzyBlogfilterArray = frenzyBlogfilterclone.split(",");
        }
        if (urlParams_Frenzy.get("price")) {
          isFilterApplyPrice_Frenzy = true;
        }
        frenzyScriptReload();
      }
}

window.addEventListener("popstate", function (event) {
    popstateHandler(event);
});