export const AGE_STORAGE_KEY = "lamour_visited";

/**
 * Runs in <head> before first paint: marks <html data-age-ok> for returning
 * visitors (same session) and for /admin, so CSS hides the server-rendered
 * age gate instantly — no black "checking" screen, no artificial preloader
 * delay, and the page's real content is painted (and measurable as LCP) at once.
 */
export const AGE_GATE_BOOT_SCRIPT = `try{if(location.pathname.indexOf("/admin")===0||sessionStorage.getItem("${AGE_STORAGE_KEY}")==="true")document.documentElement.setAttribute("data-age-ok","")}catch(e){}`;
