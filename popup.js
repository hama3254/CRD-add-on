var Port;
var Server = false;
var FunCookie;
var sclass = "'card'"
document.getElementById("btn_add").hidden = true;
document.getElementById("btn_enable_select").hidden = true;
document.getElementById("btn_add_mass").hidden = true;
document.getElementById("btn_add_mass_beta").hidden = true;
document.getElementById("btn_select_all").hidden = true;
document.getElementById("btn_select_none").hidden = true;
document.getElementById("btn_enable_funimation_select").hidden = true;
document.getElementById("btn_add_funimation").hidden = true;
document.getElementById("btn_add_mass_funimation").hidden = true;
//document.getElementById("CRD-Webserver").hidden = true;

function setItem() {
    console.log("OK");
}
function notsetItem() {
    console.log("Not OK");
}

try {
    chrome.storage.local.get(['CRD_Port'], function (result) {
        console.log('Value currently is ' + result.CRD_Port);
        gotPort(result.CRD_Port)
    });
} catch (e) {
    NoPort();
}

function gotPort(result) {
    try {
        onStartup(result);
        console.log("Port: " + result)
    } catch (e) {
        onStartup(80);
        console.log("no port")
    }

}

chrome.runtime.onMessage.addListener(getServerValue);

function getServerValue(request, sender, sendResponse) {
    if (request.Server == "CRD 1.0" && Server == false) {
        Server = true;
        document.getElementById("CRD-Webserver").hidden = false;
        document.getElementById("txtInput").hidden = true;
        document.getElementById("btn_set_port").hidden = true;
        document.getElementById("txtOutput").style.visibility = "hidden";
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
            function (tabs) {
            console.log(tabs.length);
            let tab = tabs[0]; // Safe to assume there will only be one resultconsole.log(tab.url);
            console.log(tab.url);
            if (tab.url.includes('beta.crunchyroll.com')) {

                chrome.tabs.executeScript(null, {
                    //code: 'document.getElementsByClassName("episode")[0].href;'
                    code: 'document.getElementsByClassName('+sclass+').length;'
                },
                    function (results) {
                    console.log(results);
                    if (results > 0) {

                        onBetaExecuted(results);
                    } else {
                        onError("error")
                    }

                });

            } else if (tab.url.includes('crunchyroll.com')) {

                chrome.tabs.executeScript(null, {
                    //code: 'document.getElementsByClassName("episode")[0].href;'
                    code: 'document.getElementsByClassName("episode").length;'
                },
                    function (results) {
                    console.log(results);
                    if (results > 0) {

                        onExecuted(results);
                    } else {
                        onError("error")
                    }

                });

            } else if (tab.url.includes('funimation.com')) {
                chrome.tabs.executeScript(null, {
                    //code: 'document.getElementsByClassName("trackVideo")[0].href'
                    code: 'document.getElementsByClassName("trackVideo").length;'
                },
                    function (results) {

                    if (results > 0) {
                        FunimationSuccess(results);

                    } else {
                        FunimationOldNotFound(results);

                    }

                });

            } else {

                document.getElementById("btn_add").hidden = true;
                document.getElementById("btn_enable_select").hidden = true;
                document.getElementById("btn_add_mass").hidden = true;
				document.getElementById("btn_add_mass_beta").hidden = true;
                document.getElementById("btn_select_all").hidden = true;
                document.getElementById("btn_select_none").hidden = true;
                document.getElementById("btn_enable_funimation_select").hidden = true;
                document.getElementById("btn_add_funimation").hidden = true;
            }
        });
    } else {}

}

function NoPort(result) {
    onStartup(80);
    console.log("no port")
}

function onStartup(result) {
    Port = result;
    var ifrm = document.createElement("iframe");
    ifrm.src = "http://127.0.0.1:" + Port;
    ifrm.style = "border:0px solid black;";
    ifrm.style.width = "760px";
    ifrm.style.height = "320px";
    ifrm.id = "CRD-Webserver";
    ifrm.hidden = true;
    document.body.appendChild(ifrm);

}

document.getElementById('btn_set_port').addEventListener('click', () => {
    onStartup(document.getElementById('txtInput').value);

    chrome.storage.local.set({
        'CRD_Port': document.getElementById('txtInput').value
    }, function () {
        // Notify that we saved.
        console.log('Settings saved: ' + document.getElementById('txtInput').value);
    });

    //window.close();
});

document.getElementById('btn_enable_select').addEventListener('click', () => {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
        function (tabs) {
        console.log(tabs.length);
        let tab = tabs[0]; // Safe to assume there will only be one resultconsole.log(tab.url);
        console.log(tab.url);
        if (tab.url.includes('beta.crunchyroll.com')) {

            chrome.tabs.executeScript(null, {
                file: 'inject_beta.js'
            });

            document.getElementById("btn_add_mass").hidden = true;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_select_all").hidden = false;
            document.getElementById("btn_select_none").hidden = false;
            document.getElementById("btn_enable_select").hidden = true;
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
        } else if (tab.url.includes('crunchyroll.com')) {

            chrome.tabs.executeScript(null, {
                code: 'var script=document.createElement("script");script.type="text/javascript",script.src="http://127.0.0.1:' + Port + '/inject.js",document.head.appendChild(script);'
            });

            //browser.tabs.executeScript({
            //   code: 'var script=document.createElement("script");script.type="text/javascript",script.src="http://127.0.0.1' + Port + '/inject.js",document.head.appendChild(script);'
            //}); //load script from local CRD Server included in https://github.com/hama3254/Crunchyroll-Downloader-v3.0

            document.getElementById("btn_add_mass").hidden = false;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_select_all").hidden = false;
            document.getElementById("btn_select_none").hidden = false;
            document.getElementById("btn_enable_select").hidden = true;
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
        }
    });

});

document.getElementById('btn_select_all').addEventListener('click', () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
        function (tabs) {
        console.log(tabs.length);
        let tab = tabs[0]; // Safe to assume there will only be one resultconsole.log(tab.url);
        console.log(tab.url);
        if (tab.url.includes('beta.crunchyroll.com')) {

            chrome.tabs.executeScript(null, {
              
                    code: 'var i,episodeCount=document.getElementsByClassName(' + sclass + ').length;for(i=0;i<episodeCount;i++)document.getElementsByClassName(' + sclass + ')[i].style.background="#f78c25",document.getElementsByClassName(' + sclass + ')[i].style.opacity = "30",document.getElementsByClassName(' + sclass + ')[i].classList.add("CRD-Selected");'
            });
			document.getElementById("btn_add_mass_beta").hidden = false;

        } else if (tab.url.includes('crunchyroll.com')) {

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName("episode").length;for(i=0;i<episodeCount;i++)document.getElementsByClassName("episode")[i].style.background="#f78c25",document.getElementsByClassName("episode")[i].classList.add("CRD-Selected");'
            });

        } else if (tab.url.includes('funimation.com')) {

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName("fullEpisodeThumbs").length;for(i=0;i<episodeCount;i++)document.getElementsByClassName("fullEpisodeThumbs")[i].style.background="#f78c25",document.getElementsByClassName("fullEpisodeThumbs")[i].classList.add("CRD-Selected");'
            });

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName("episode-card").length;for(i=0;i<episodeCount;i++)document.getElementsByClassName("episode-card")[i].style.background="#400099",document.getElementsByClassName("episode-card")[i].classList.add("CRD-Selected"),document.getElementsByClassName("episode-card")[i].style.borderStyle="solid", document.getElementsByClassName("episode-card")[i].style.borderColor="#400099", document.getElementsByClassName("episode-card")[i].style.borderWidth = "10px";'
            });

        } else {}
    });

});

document.getElementById('btn_select_none').addEventListener('click', () => {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
        function (tabs) {
        console.log(tabs.length);
        let tab = tabs[0]; // Safe to assume there will only be one resultconsole.log(tab.url);
        console.log(tab.url);
        if (tab.url.includes('beta.crunchyroll.com')) {

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName(' + sclass + ').length;for(i=0;i<episodeCount;i++)document.getElementsByClassName(' + sclass + ')[i].style.background="#000000",document.getElementsByClassName(' + sclass + ')[i].style.opacity="100",document.getElementsByClassName(' + sclass + ')[i].classList.remove("CRD-Selected");'
            });

        } else if (tab.url.includes('crunchyroll.com')) {

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName("episode").length;for(i=0;i<episodeCount;i++)document.getElementsByClassName("episode")[i].style.background="#ffffff",document.getElementsByClassName("episode")[i].classList.remove("CRD-Selected");'
            });

        } else if (tab.url.includes('funimation.com')) {

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName("fullEpisodeThumbs").length;for(i=0;i<episodeCount;i++)document.getElementsByClassName("fullEpisodeThumbs")[i].style.background="#ffffff",document.getElementsByClassName("fullEpisodeThumbs")[i].classList.remove("CRD-Selected");'
            });

            chrome.tabs.executeScript(null, {
                code: 'var i,episodeCount=document.getElementsByClassName("episode-card").length;for(i=0;i<episodeCount;i++)document.getElementsByClassName("episode-card")[i].style.background="#1e1e1e",document.getElementsByClassName("episode-card")[i].classList.remove("CRD-Selected"),document.getElementsByClassName("episode-card")[i].style.borderStyle="none";'
            });
        } else {}
    });

});

document.getElementById('btn_add').addEventListener('click', () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
        function (tabs) {
        console.log(tabs.length);
        let tab = tabs[0]; // Safe to assume there will only be one resultconsole.log(tab.url);
        console.log(tab.url);
        if (tab.url.includes('beta.crunchyroll.com')) {

            document.getElementById("btn_add").disabled = true;
            document.getElementById("btn_add").style.background = "#c9c9c9"
                const form = document.createElement('form');
            form.method = 'post';
            form.action = "http://127.0.0.1:" + Port + "/post";
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "HTMLMass";
            hiddenField.value = tab.url;
            form.appendChild(hiddenField);

            document.body.appendChild(form);
            form.submit();

            setTimeout(function () {
                document.getElementById("btn_add").style.background = "#ff8000"
            }, 4000);
            setTimeout(function () {
                document.getElementById("btn_add").disabled = false;
            }, 4000);

        } else if (tab.url.includes('crunchyroll.com')) {
            chrome.tabs.executeScript(null, {
                code: "document.getElementsByClassName('no-js')[0].innerHTML;"
            },
                function (results) {

                if (results !== null) {

                    document.getElementById("btn_add").disabled = true;
                    document.getElementById("btn_add").style.background = "#c9c9c9"
                        const form = document.createElement('form');
                    form.method = 'post';
                    form.action = "http://127.0.0.1:" + Port + "/post";
                    const hiddenField = document.createElement('input');
                    hiddenField.type = 'hidden';
                    hiddenField.name = "HTMLSingle";
                    hiddenField.value = results;
                    form.appendChild(hiddenField);

                    document.body.appendChild(form);
                    form.submit();

                    setTimeout(function () {
                        document.getElementById("btn_add").style.background = "#ff8000"
                    }, 10000);
                    setTimeout(function () {
                        document.getElementById("btn_add").disabled = false;
                    }, 10000);

                } else {
                    add_one_error(results);

                }

            });

        }
    });

});

document.getElementById('btn_add_funimation').addEventListener('click', () => {

    chrome.tabs.executeScript(null, {
        code: "document.cookie"
    },
        function (results) {

        if (results !== null) {

            chrome.tabs.query({
                active: true,
                currentWindow: true
            },
                function (tabs) {
                document.getElementById("btn_add_funimation").disabled = true;
                document.getElementById("btn_add_funimation").style.background = "#c9c9c9"

                    console.log(tabs.length);
                let tab = tabs[0]; // Safe to assume there will only be one resultconsole.log(tab.url);
                console.log(tab.url);

                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", "http://127.0.0.1:" + Port + "/post", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("FunimationURL=" + tab.url + "&FunimationCookie=" + results);
                setTimeout(function () {
                    document.getElementById("btn_add_funimation").style.background = "#ff8000"
                }, 10000);
                setTimeout(function () {
                    document.getElementById("btn_add_funimation").disabled = false;
                }, 10000);
            });

        } else {
            add_mass_error(results);

        }

    });

});

document.getElementById('btn_add_mass_funimation').addEventListener('click', () => {

    chrome.tabs.executeScript(null, {
        code: 'var i,URLList="";for(i=0;i<document.getElementsByClassName("CRD-Selected").length;i++)URLList+=document.getElementsByClassName("CRD-Selected")[i].getAttribute("href");URLList;'
    },
        function (results) {

        if (results !== null) {

            document.getElementById("btn_add_mass_funimation").disabled = true;
            document.getElementById("btn_add_mass_funimation").style.background = "#c9c9c9"

                var postdata = results + "&FunimationCookie=" + FunCookie

                var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "http://127.0.0.1:" + Port + "/post", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("FunimationMass=" + postdata);

            setTimeout(function () {
                document.getElementById("btn_add_mass_funimation").style.background = "#ff8000"
            }, 4000);
            setTimeout(function () {
                document.getElementById("btn_add_mass_funimation").disabled = false;
            }, 4000);

        } else {
            add_mass_error(results);

        }

    });

});

document.getElementById('btn_add_mass').addEventListener('click', () => {

    chrome.tabs.executeScript(null, {
        code: 'var i,URLList="";for(i=0;i<document.getElementsByClassName("CRD-Selected").length;i++)URLList+=document.getElementsByClassName("CRD-Selected")[i].getAttribute("href");URLList;'
    },
        function (results) {

        if (results !== null) {

            document.getElementById("btn_add_mass").disabled = true;
            document.getElementById("btn_add_mass").style.background = "#c9c9c9"
                const form = document.createElement('form');
            form.method = 'post';
            form.action = "http://127.0.0.1:" + Port + "/post";
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "HTMLMass";
            hiddenField.value = results;
            form.appendChild(hiddenField);

            document.body.appendChild(form);
            form.submit();

            setTimeout(function () {
                document.getElementById("btn_add_mass").style.background = "#ff8000"
            }, 4000);
            setTimeout(function () {
                document.getElementById("btn_add_mass").disabled = false;
            }, 4000);

        } else {
            add_mass_error(results);

        }

    });

});

document.getElementById('btn_add_mass_beta').addEventListener('click', () => {

    chrome.tabs.executeScript(null, {
        code: 'var i,URLList="";for(i=0;i<document.getElementsByClassName("CRD-Selected").length;i++)URLList+=document.getElementsByClassName("CRD-Selected")[i].getAttribute("title");URLList;'
    },
        function (results) {

        if (results !== null) {

            document.getElementById("btn_add_mass").disabled = true;
            document.getElementById("btn_add_mass").style.background = "#c9c9c9"
                const form = document.createElement('form');
            form.method = 'post';
            form.action = "http://127.0.0.1:" + Port + "/post";
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "HTMLMass";
            hiddenField.value = results;
            form.appendChild(hiddenField);

            document.body.appendChild(form);
            form.submit();

            setTimeout(function () {
                document.getElementById("btn_add_mass_beta").style.background = "#ff8000"
            }, 4000);
            setTimeout(function () {
                document.getElementById("btn_add_mass_beta").disabled = false;
            }, 4000);

        } else {
            add_mass_error(results);

        }

    });

});

function onExecuted(result) {
    chrome.tabs.executeScript(null, {
        code: "document.getElementsByClassName('episode')[0].href.includes('javascript:');"
    },
        function (result) {
        //alert(result);
        if (result == 'true') {
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_add_mass").hidden = false;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_select_all").hidden = false;
            document.getElementById("btn_select_none").hidden = false;
            document.getElementById("btn_enable_select").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            console.log(true);
        } else {
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_enable_select").hidden = false;
            document.getElementById("btn_add_mass").hidden = true;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_select_all").hidden = true;
            document.getElementById("btn_select_none").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            console.log(false);
        }
    });

}

function onBetaExecuted(result) {
    chrome.tabs.executeScript(null, {
        code: "document.getElementsByClassName("+sclass+")[0].title.includes('javascript:');"
    },
        function (result) {
        //alert(result);
		 console.log("title : "+result);
        if (result == 'true') {
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_add_mass").hidden = true;
			document.getElementById("btn_add_mass_beta").hidden = false;
            document.getElementById("btn_select_all").hidden = false;
            document.getElementById("btn_select_none").hidden = false;
            document.getElementById("btn_enable_select").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            console.log(true);
        } else {
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_enable_select").hidden = false;
            document.getElementById("btn_add_mass").hidden = true;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_select_all").hidden = true;
            document.getElementById("btn_select_none").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            console.log(false);
        }
    });

}

function onError(error) {
    console.log(`Error: ${error}`);

    document.getElementById("btn_add").hidden = false;
    document.getElementById("btn_add_mass").hidden = true;
    document.getElementById("btn_select_all").hidden = true;
    document.getElementById("btn_select_none").hidden = true;
    document.getElementById("btn_enable_select").hidden = true;
    document.getElementById("btn_add_funimation").hidden = true;
    document.getElementById("btn_enable_funimation_select").hidden = true;

}

function add_one_error(error) {
    console.log(`Error: ${error}`);
}

function add_mass_error(error) {
    console.log(`Error: ${error}`);
}
//funimation

document.getElementById('btn_enable_funimation_select').addEventListener('click', () => {

    chrome.tabs.executeScript(null, {
        code: 'document.getElementsByClassName("episode-card")[0].href'
    },
        function (result) {
        //alert(result);
        if (result !== null) {
            chrome.tabs.executeScript(null, {
                file: 'inject_funimation_new.js'
            });

            document.getElementById("btn_add_mass").hidden = true;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_add_mass_funimation").hidden = false;
            document.getElementById("btn_select_all").hidden = false;
            document.getElementById("btn_select_none").hidden = false;
            document.getElementById("btn_enable_select").hidden = true;
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
        } else {
            chrome.tabs.executeScript(null, {
                code: 'var script=document.createElement("script");script.type="text/javascript",script.src="http://127.0.0.1:' + Port + '/inject_funimation.js",document.head.appendChild(script);'
            });

            document.getElementById("btn_add_mass").hidden = true;
			document.getElementById("btn_add_mass_beta").hidden = true;
            document.getElementById("btn_select_all").hidden = false;
            document.getElementById("btn_select_none").hidden = false;
            document.getElementById("btn_enable_select").hidden = true;
            document.getElementById("btn_add").hidden = true;
            document.getElementById("btn_add_funimation").hidden = true;
            document.getElementById("btn_enable_funimation_select").hidden = true;
            document.getElementById("btn_add_mass_funimation").hidden = false;

        }
    });

});

function FunimationSuccess(result) {
    console.log(result[0]);
    console.log(result[0].includes('javascript:'));
    if (result[0].includes('javascript:') == true) {
        document.getElementById("btn_add").hidden = true;
        document.getElementById("btn_add_mass").hidden = true;
        document.getElementById("btn_select_all").hidden = false;
        document.getElementById("btn_select_none").hidden = false;
        document.getElementById("btn_enable_select").hidden = true;

        document.getElementById("btn_enable_funimation_select").hidden = true;
        document.getElementById("btn_add_funimation").hidden = true;
        document.getElementById("btn_add_mass_funimation").hidden = false;
        chrome.tabs.executeScript(null, {
            code: "document.cookie"
        },
            function (results) {

            if (results !== null) {

                FunCookie = results;
                console.log(results);
            } else {
                add_mass_error(results);

            }

        });

        console.log(true);
    } else {
        document.getElementById("btn_add").hidden = true;
        document.getElementById("btn_add_funimation").hidden = true;
        document.getElementById("btn_enable_select").hidden = true;
        document.getElementById("btn_add_mass").hidden = true;
        document.getElementById("btn_select_all").hidden = true;
        document.getElementById("btn_select_none").hidden = true;
        document.getElementById("btn_enable_funimation_select").hidden = false;
        document.getElementById("btn_add_mass_funimation").hidden = true;
        chrome.tabs.executeScript(null, {
            code: "document.cookie"
        },
            function (results) {

            if (results !== null) {

                FunCookie = results.toString();
                console.log(results.toString());
            } else {
                add_mass_error(results);

            }

        });
        console.log(false);
    }
}

function FunimationOldNotFound(error) {

    chrome.tabs.executeScript(null, {
        code: 'document.getElementsByClassName("episode-card")[0].href'
    },
        function (results) {

        if (results !== null) {
            FunimationSuccess(results);

        } else {
            FunimationError(results);

        }

    });

}

function FunimationError(error) {
    console.log(`Error: ${error}`);

    document.getElementById("btn_add").hidden = true;
    document.getElementById("btn_add_mass").hidden = true;
    document.getElementById("btn_select_all").hidden = true;
    document.getElementById("btn_select_none").hidden = true;
    document.getElementById("btn_enable_select").hidden = true;
    document.getElementById("btn_add_funimation").hidden = false;
    document.getElementById("btn_enable_funimation_select").hidden = true;

    chrome.tabs.executeScript(null, {
        code: "document.cookie"
    },
        function (results) {

        if (results !== null) {

            FunCookie = results.toString();
            console.log(results.toString());
        } else {
            add_mass_error(results);

        }

    });

}
