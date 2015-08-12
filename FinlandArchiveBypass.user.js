// ==UserScript==
// @name        finlandArchiveBypass
// @namespace   finArchiveBypass
// @include https://www.reddit.com/r/KotakuInAction/*
// @version     2.0
// @grant       none
// ==/UserScript==

// Format for sending pages to google translate 
//http://translate.google.com/translate?js=n&sl=auto&tl=destination_language&u=http://example.net

// Settings few globals
var allowRedirect = false;
var linkElement = document.getElementsByTagName('a');
var redirectProxyUrlSetting = "https://translate.google.com/translate?js=n&sl=fi&tl=en&u=";

// Operate only when needed - verify links and do magic on for those leading to archive.is
var verifyArchiveUrl = function (redirectFromUrl) {
    var checkUrl = getLocation(redirectFromUrl);
    //console.log(checkUrl.pathname.length);
    if (checkUrl.hostname === null || checkUrl.pathname === null) {
        console.log("Unknown error, only devils play here. Turn back.")
        allowRedirect = false;
    } else if (checkUrl.hostname == "archive.is") {
        console.log("Beam me up: " + redirectFromUrl);
        allowRedirect = true;
        //doRedirect(redirectFromUrl);
    } else {
        console.log("Mystical error, tring to verify URL:" + redirectFromUrl);
        allowRedirect = false;
    }
}

var doRedirect = function (e) {
    e.preventDefault();
    var redirectFromUrl = e.target.href;
    verifyArchiveUrl(redirectFromUrl);
    if (allowRedirect == true) {
        //window.location.replace("https://translate.google.com/translate?js=n&sl=fi&tl=en&u=" + redirectFromUrl);
        var redirectToProxy = redirectProxyUrlSetting + redirectFromUrl;
        window.open(redirectToProxy, '_blank');
        console.log("redirected from: " + redirectFromUrl);
        //console.log(allowRedirect);
    } else {
        //window.location.replace(redirectFromUrl);
        window.location.assign(redirectFromUrl);
        console.log("Clicked URL doesn't lead to archive.is, or is bad. Abort.");
    }
}

//Resolves Url and returns var.hostname && var.pathname
function getLocation(href) {
    var location = document.createElement("a");
    location.href = href;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host == "") {
        location.href = location.href;
    }
    return location;
}

//Bind .click event to links from var linkElement. Docompare and redicret on valid links / 
for (i = 0; i < linkElement.length; i++) {
    linkElement[i].addEventListener('click', doRedirect, false);
}
