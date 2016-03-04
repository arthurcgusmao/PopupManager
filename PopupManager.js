

function setupPopups() {
    var divsLive = document.getElementsByTagName('div');
    var divs = Array.prototype.slice.call(divsLive, 0);
    for(var i=0; i<divs.length; i++) {
        var div = divs[i];
        if(/managed-popup/.test(div.className)) {
        	
        	

        	setupKillers(div);
        	addCloseBtn(div);
        	addCover(div);
        	addTriggers(div);





        	// for special events
        	/*
        	switch(triggerSelector) {
			    case n:
			        code block
			        break;
			    case n:
			        code block
			        break;
			    default:
			        default code block
			}
			*/
        }
    }
}

function setupPopupStyle(popupNode) {
	addStyleWithId(
		popupNode.getAttribute('id'),
		'{position:fixed;left:50%;top:50%;-ms-transform: translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);transition:'+popupNode.getAttribute('data-transition')+'ms opacity;}'
	);
}

function addTriggers(popupNode) {
	var triggerIds = popupNode.getAttribute('data-trigger-ids').split(' ');
	var triggerEvents = popupNode.getAttribute('data-trigger-events').split(' ');

	for(var i=0; i<triggerIds.length; i++) {
		triggerId = triggerIds[i];
		triggerEvent = triggerEvents[i];

		triggerNode = document.getElementById(triggerId);

		if(triggerNode) {
			triggerNode.addEventListener(triggerEvent, function() {
				triggerPopup(popupNode);
			});
		}
	}
}

function removeTriggers() {

}

function triggerPopup(popupNode) {
	var id = popupNode.getAttribute('id');
	var triggerLimit = popupNode.getAttribute('data-trigger-limit');
	var blockPopup;

	switch(triggerLimit) {
	    case 'session':
	        blockPopup = sessionStorage.getItem('showed-popup-'+id) || false;
	    	break;
	    case 'lifetime':
	        blockPopup = localStorage.getItem('showed-popup-'+id) || false;
	        break;
	    default:
	        blockPopup = false;
	}

	if(!blockPopup) {
		sessionStorage.setItem('showed-popup-'+id, true);
		localStorage.setItem('showed-popup-'+id, true);

		showPopup(popupNode);
	}
}

function showPopup(popupNode) {
	var coverNode = document.getElementById(popupNode.getAttribute('id')+'-cover');

	popupNode.style.display = 'block';
	popupNode.style.opacity = 1;
	
	if(coverNode) {
		coverNode.style.display = 'block';
		coverNode.style.opacity = 1;
	}
}

function closePopup(popupNode) {
	var coverNode = document.getElementById(popupNode.getAttribute('id')+'-cover');
	var transitionTime = popupNode.getAttribute('data-transition') || 1;

	popupNode.style.opacity = 0;
	if(coverNode) {
		coverNode.style.opacity = 0;
	}

	setTimeout(function() {
		popupNode.style.display = 'none';
		if(coverNode) {
			coverNode.style.display = 'none';
		}
	}, transitionTime);
}

function setupKillers(popupNode) {
	var killersIds = popupNode.getAttribute('data-killers-ids').split(' ');
	for(var i=0; i<killersIds.length; i++) {
		var killer = document.getElementById(killersIds[i]);
		if(killer) {
			killer.addEventListener('click', function() {
				closePopup(popupNode);
			});
		}
	}
}

function addCloseBtn(popupNode) {
	var disableCloseBtn = popupNode.getAttribute('data-disable-close-button');
	if(disableCloseBtn !== 'true') {
		var closeBtn = document.createElement('div');
		closeBtn.setAttribute('id', popupNode.getAttribute('id')+'-close-btn');
		closeBtn.appendChild(document.createTextNode('x'));
		popupNode.appendChild(closeBtn);

		addStyleWithId(
    		closeBtn.getAttribute('id'),
    		'{webkit-border-radius:3px;-moz-border-radius:3px;-ms-border-radius:3px;-o-border-radius:3px;border-radius:3px;cursor:default;position:absolute;font-size:22px;font-weight:700;font-family:sans-serif;line-height:31px;height:30px;width:30px;text-align:center;top:3px;right:3px;background:0 0;}'
    	);

		closeBtn.addEventListener('click', function() {
			closePopup(popupNode);
		});
	}
}

function addCover(popupNode) {
	var cover = document.createElement('div');
	cover.setAttribute('id', popupNode.getAttribute('id')+'-cover');
	cover.style.display = 'none';
	cover.style.opacity = '0';

	addStyleWithId(
		cover.getAttribute('id'),
		'{background-color:rgba(0, 0, 0, 0.2);position:fixed;top:0;left:0;width:100%;height:100%;transition:'+popupNode.getAttribute('data-transition')+'ms opacity;}'
	);

	document.body.appendChild(cover);
	cover.appendChild(popupNode);
}

function addStyleWithId(id, style) {
	var css = '#'+id+style;
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	var fStyle = document.getElementsByTagName('style')[0];

	style.type = 'text/css';
	if (style.styleSheet){
	  	style.styleSheet.cssText = css;
	} else {
	  	style.appendChild(document.createTextNode(css));
	}

	head.insertBefore(style, fStyle);
}


setupPopups();

