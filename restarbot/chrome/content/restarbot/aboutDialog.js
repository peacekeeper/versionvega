//@line 37 "e:\builds\moz2_slave\win32_build\build\browser\base\content\aboutDialog.js"

var gSelectedPage = 0;

function init(aEvent) 
{
  if (aEvent.target != document)
    return;

  var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefBranch);

  try {
    var distroId = prefs.getCharPref("distribution.id");
    if (distroId) {
      var distroVersion = prefs.getCharPref("distribution.version");
      var distroAbout = prefs.getComplexValue("distribution.about",
        Components.interfaces.nsISupportsString);
  
      var distroField = document.getElementById("distribution");
      distroField.value = distroAbout;
      distroField.style.display = "block";
    
      var distroIdField = document.getElementById("distributionId");
      distroIdField.value = distroId + " - " + distroVersion;
      distroIdField.style.display = "block";
    }
  }
  catch (e) {
    // Pref is unset
  }

  var userAgentField = document.getElementById("userAgent");
  userAgentField.value = navigator.userAgent;

  var button = document.documentElement.getButton("extra2");
  button.setAttribute("label", document.documentElement.getAttribute("creditslabel"));
  button.setAttribute("accesskey", document.documentElement.getAttribute("creditsaccesskey"));
  button.addEventListener("command", switchPage, false);

  var acceptButton = document.documentElement.getButton("accept");
//@line 80 "e:\builds\moz2_slave\win32_build\build\browser\base\content\aboutDialog.js"
  acceptButton.focus();

//@line 87 "e:\builds\moz2_slave\win32_build\build\browser\base\content\aboutDialog.js"
}

function uninit(aEvent)
{
  if (aEvent.target != document)
    return;
  var iframe = document.getElementById("creditsIframe");
  iframe.setAttribute("src", "");
}

function switchPage(aEvent)
{
  var button = aEvent.target;
  if (button.localName != "button")
    return;

  var iframe = document.getElementById("creditsIframe");
  if (gSelectedPage == 0) { 
    iframe.setAttribute("src", "chrome://restarbot/content/credits.xhtml");
    button.setAttribute("label", document.documentElement.getAttribute("aboutlabel"));
    button.setAttribute("accesskey", document.documentElement.getAttribute("aboutaccesskey"));
    gSelectedPage = 1;
  }
  else {
    iframe.setAttribute("src", ""); 
    button.setAttribute("label", document.documentElement.getAttribute("creditslabel"));
    button.setAttribute("accesskey", document.documentElement.getAttribute("creditsaccesskey"));
    gSelectedPage = 0;
  }
  var modes = document.getElementById("modes");
  modes.setAttribute("selectedIndex", gSelectedPage);
}

