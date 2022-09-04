var sclass = "card"
var episodeCount = document.getElementsByClassName(sclass).length;
var i;
var ii;
for (i = 0; i < episodeCount; i++) {
    var element = document.getElementsByClassName(sclass)[i];
    var nodes = element.getElementsByTagName("a");
	var episodeUrl = nodes[0].href;
	element.innerHTML = element.innerHTML.replace("href","type")
	
    
	 
    document.getElementsByClassName(sclass)[i].setAttribute('title', "javascript:" + episodeUrl);
    document.getElementsByClassName(sclass)[i].setAttribute('onclick', 'this.classList.contains("CRD-Selected")?(this.classList.remove("CRD-Selected"),this.style.background="#000000",this.style.opacity="100"):(this.classList.add("CRD-Selected"),this.style.background="#f78c25",this.style.opacity="30");');

}