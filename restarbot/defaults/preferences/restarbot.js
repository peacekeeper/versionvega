/*
 * General xulrunner settings
 */

pref("toolkit.defaultChromeURI", "chrome://restarbot/content/restarbot.xul");
pref("general.useragent.locale", "en_US");    		
pref("general.useragent.extra.Restarbot", "Restarbot/Firefox/0.1");
pref("browser.dom.window.dump.enabled", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);
pref("browser.cache.disk.enable", false);
pref("signed.applets.codebase_principal_support", true);
pref("extensions.checkUpdateSecurity", false);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);

/*
 * restarbot settings
 */

pref("versionvega.host", "localhost");
pref("versionvega.port", 15099);
pref("sol.init.xri", "@vega");
pref("sol.runlevel.xri", "@vega*runlevel");
pref("sol.history.size", 100);
pref("sol.workingthreads", 2);
pref("xri.proxy", "http://xri.net/");
pref("xri.cache", false);
pref("vega.localport", "15020");
pref("vega.remotehost", "@versionvega");
pref("vega.remoteport", "15020");
//pref("vega.parameters", "firewall_test_policy=never\nnat_search_policy=never\n");
pref("vega.parameters", "");
pref("timer.interval", 500);
pref("timer.errorinterval", 10000);

/*
 * Enable the Extension Manager
 */

pref("xpinstall.dialog.confirm", "chrome://mozapps/content/xpinstall/xpinstallConfirm.xul");
pref("xpinstall.dialog.progress.skin", "chrome://mozapps/content/extensions/extensions.xul?type=themes");
pref("xpinstall.dialog.progress.chrome", "chrome://mozapps/content/extensions/extensions.xul?type=extensions");
pref("xpinstall.dialog.progress.type.skin", "Extension:Manager-themes");
pref("xpinstall.dialog.progress.type.chrome", "Extension:Manager-extensions");
pref("extensions.update.enabled", true);
pref("extensions.update.interval", 86400);
pref("extensions.dss.enabled", false);
pref("extensions.dss.switchPending", false);
pref("extensions.ignoreMTimeChanges", false);
pref("extensions.logging.enabled", false);
pref("general.skins.selectedSkin", "classic/1.0");
// NB these point at AMO
pref("extensions.update.url", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreExtensionsURL", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreThemesURL", "chrome://mozapps/locale/extensions/extensions.properties");
