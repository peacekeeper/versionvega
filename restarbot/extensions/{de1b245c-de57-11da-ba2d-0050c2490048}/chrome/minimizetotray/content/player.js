/* Songbird workaround
 * SB does not issue standard OS messages for the close button,
 * but instead implements it's own bindings and calls the close
 * function directly.
 * 
 * taken shamelessly from MinTrayR
 */
if ('quitApp' in this) {
	quitApp = (function() {
		let _p = quitApp;
		return function() {
			try {
				// examine the stack; if we're called from the sys buttons
				// binding then
				// see if we should minimize instead
				let
				stack = (new Error()).stack.toString();
				var minimizetotray = window.extensions.mook.minimizetotray;
				if (stack
						.indexOf('chrome://songbird/content/bindings/sysControls.xml') != -1
						&& minimizetotray.m_prefs
								.getBoolPref(minimizetotray.k_pref_prefix + 'minimize-on-close')) {
					minimizetotray.minimizeWindow();
					return null;
				}
			} catch (ex) {
			}
			return _p.apply(this, arguments);
		}
	})();
}

/*
 * same as the above
 */

if ('onMinimize' in this) {
	onMinimize = (function() {
		let	_p = onMinimize;
		return function() {
			try {
				// examine the stack; if we're called from the sys buttons
				// binding then
				// see if we should minimize instead
				let
				stack = (new Error()).stack.toString();
				var minimizetotray = window.extensions.mook.minimizetotray;
				if (stack
						.indexOf('chrome://songbird/content/bindings/sysControls.xml') != -1
						&& minimizetotray.m_prefs
								.getBoolPref(minimizetotray.k_pref_prefix + 'always')) {
					minimizetotray.minimizeWindow();
					return null;
				}
			} catch (ex) {
			}
			return _p.apply(this, arguments);
		}
	})();
}