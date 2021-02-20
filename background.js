chrome.webRequest.onHeadersReceived.addListener(
    details => {
    if (!details.fromCache) {
      
          const mime = details.responseHeaders.find(header => {
            return header.value && header.name === "Server";
        });
        if (mime) {
            //console.log(mime.value);
           chrome.runtime.sendMessage({
                Server: mime.value
		   });

        } else {
            details.responseHeaders.push({
                name: "Content-Security-Policy",
                value: "upgrade-insecure-requests",
            });
        }

        return {
            responseHeaders: details.responseHeaders,
        };
    } else {
        console.log("cached");
    }
}, {
    urls: ["http://127.0.0.1/*"],
},
    ["blocking", "responseHeaders"]);
