var code;

function initCode() {

	code = { };

	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	code.xriToChromeUri = function(xri) {
		
		return(xri.replace(/\@/, "at.").replace(/\=/, "equal.").replace(/\*/, ".").replace(/\!/, "."));
	}
	
	code.bbToHtml = function(bb) {

		if (! bb) bb = '';
		bb = '' + bb;
		bb = bb.replace(/</g, '&lt;');
		bb = bb.replace(/>/g, '&gt;');
		bb = bb.replace(/\n/g, '<br>');
		bb = bb.replace(/\[b\](.*?)\[\/b\]/ig, '<b>$1</b>');
		bb = bb.replace(/\[i\](.*?)\[\/i\]/ig, '<i>$1</i>');
		bb = bb.replace(/\[color=(.+)?\](.*?)\[\/color\]/ig, '<span style="color: $1">$2</span>');
		bb = bb.replace(/\[img=(.+)?\]/ig, '<img src="$1">');
		bb = bb.replace(/  /ig, '&nbsp;&nbsp;');
	
		return(bb);
	}

	code.encode64 = function(input) {

		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
	
		do {
	
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
	
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
	
			if (isNaN(chr2)) {
	
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
	
				enc4 = 64;
			}
	
			output = output +
			keyStr.charAt(enc1) +
			keyStr.charAt(enc2) +
			keyStr.charAt(enc3) +
			keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
	
		return output;
	}

	code.decode64 = function(input) {

		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
	
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
	
		if (base64test.exec(input)) return(null);
	
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	
		do {
	
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			output = output + String.fromCharCode(chr1);
	
			if (enc3 != 64) output = output + String.fromCharCode(chr2);
			if (enc4 != 64) output = output + String.fromCharCode(chr3);
	
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
	
		return(output);
	}
}
