console.log('## popupManager code loaded ##');

(function() {

	/*

	Necessary Attributes:
	id do popup

	All the attributes avaiable:
	data-trigger-ids (ids of the elements that will trigger the popup)
	data-trigger-events (evento que cada id vai triggar, respectivamente)
	data-trigger-special-events (ainda nao concluido)
	data-trigger-limit (session ou lifetime ~ sessionStorage ou localStorage)
	data-killers-ids (ids dos elementos que vão fechar o popup quando clicados)
	data-disable-close-button (se = true, tira o X do canto superior direito do popup)
	data-disable-cover (se = true, desabilita o cover cinza atrás do popup)

	*/

	function setupPopups() {
	    var divsLive = document.getElementsByTagName('div');
	    var divs = Array.prototype.slice.call(divsLive, 0);
	    for(var i=0; i<divs.length; i++) {
	        var div = divs[i];
	        if(/managed-popup/.test(div.className)) {
	        	if(!div.id) {
	        		console.error('PopupManager: You must specify an id attribute to the popup!')
					throw new Error('PopupManager: You must specify an id attribute to the popup!');
	        	}
	        	
	        	setupPopupStyle(div);
	        	setupKillers(div);
	        	addCloseBtn(div);
	        	addCover(div);
	        	addTriggers(div);





	        	// for special events
	        	var specialEvents = div.getAttribute('data-trigger-special-events');

	        	/* In Development
	        	if(specialEvents) {
		        	specialEvents = specialEvents.split(' ');
		        	for(var i=0; i<specialEvents.length; i++) {
			        	switch(specialEvents[i]) {
						    case 'exit-intent':
						        document.body.addEventListener('mouseout', function(event) {
								    if (!isInside(event.relatedTarget, document.body)) {
								      	triggerPopup(div);
								    }
								});
						        break;
						    case 'other':
						        // do something
						        break;
						    default:
						        // do nothing
						}
					}
				}
				*/
	        ''}
	    }
	}

	function setupPopupStyle(popupNode) {
		addStyleWithId(
			popupNode.getAttribute('id'),
			'{display:none;position:fixed;left:50%;top:50%;-ms-transform: translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);}'
		);
	}

	function addTriggers(popupNode) {
		var triggerIds = popupNode.getAttribute('data-trigger-ids');
		var triggerEvents = popupNode.getAttribute('data-trigger-events');
		
		if(triggerIds && triggerEvents) {
			var triggerIds = triggerIds.split(' ');
			var triggerEvents = triggerEvents.split(' ');

			if(triggerIds.length === triggerEvents.length) {

				for(var i=0; i<triggerIds.length; i++) {
					triggerId = triggerIds[i];
					triggerEvent = triggerEvents[i];

					triggerNode = document.getElementById(triggerId);

					if(triggerNode) {
						triggerNode.addEventListener(triggerEvent, function() {
							triggerPopup(popupNode);
						});
					} else {
						console.warn('PopupManager: Trigger element of id="'+triggerId+'" not found.');
					}
				}
			} else {
				console.log(triggerEvents.length);
				console.log(triggerIds.length);
				console.error('PopupManager: You must specify exactly one data-trigger-event for each data-trigger-id (data-trigger-events must have the same length as data-trigger-ids).')
				throw new Error('PopupManager: You must specify exactly one data-trigger-event for each data-trigger-id (data-trigger-events must have the same length as data-trigger-ids).');
			}
		}
	}

	function removeTriggers() {

	}

	function triggerPopup(popupNode) {
		var id = popupNode.getAttribute('id');
		if($(id).css('display') !== 'block'/*popupNode.style.display !== 'block'*/) {
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
	}

	function showPopup(popupNode) {
		var coverNode = document.getElementById(popupNode.getAttribute('id')+'-cover');
		//popupNode.style.display = 'block';
		$('#'+popupNode.getAttribute('id')).css('display', 'block');
		if(coverNode) {
			coverNode.style = 'display: block;';
		}

		if(popupNode.dataOptions) {
			var temporaryElements = popupNode.dataOptions.temporaryElements;
		}
		if(temporaryElements) {
			var container;

			for (var name in temporaryElements) {
			    if (temporaryElements.hasOwnProperty(name)) {
			    	container = document.getElementById('temp-el-'+name);
			    	if(container) {
						container.appendChild(temporaryElements[name]);
						console.log('trying to append temporary element within container');
					} else {
						popupNode.appendChild(temporaryElements[name]);
						console.log('trying to append temporary element at popupNode');
					}
			    }
			}
		}
	}

	function closePopup(popupNode) {
		var coverNode = document.getElementById(popupNode.getAttribute('id')+'-cover');
		//popupNode.style.display = 'none';
		$('#'+popupNode.getAttribute('id')).css('display', 'block');
		if(coverNode) {
			//coverNode.style.display = 'none';
			coverNode.style = 'display: none;';
		}

		if(popupNode.dataOptions) {
			var temporaryElements = popupNode.dataOptions.temporaryElements;
		}
		if(temporaryElements) {
			var container;

			for (var name in temporaryElements) {
			    if (temporaryElements.hasOwnProperty(name)) {
			    	container = document.getElementById('temp-el-'+name);
			    	if(container) {
						container.removeChild(temporaryElements[name]);
			    	} else {
			    		popupNode.removeChild(temporaryElements[name]);
			    	}
			    }
			}
		}
	}

	function setupKillers(popupNode) {
		var killersIds = popupNode.getAttribute('data-killers-ids');

		if(killersIds) {
			killersIds = killersIds.split(' ');
			for(var i=0; i<killersIds.length; i++) {
				var killer = document.getElementById(killersIds[i]);
				if(killer) {
					killer.addEventListener('click', function() {
						closePopup(popupNode);
					});
				} else {
					console.warn('PopupManager: Killer element of id="'+killersIds[i]+'" not found.');
				}
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

			closeBtn.addEventListener('click', function(event) {
				closePopup(popupNode);
			});
		}
	}

	function addCover(popupNode) {
		var disableCover = popupNode.getAttribute('data-disable-cover');
		if(disableCover !== 'true') {
			var cover = document.createElement('div');
			cover.setAttribute('id', popupNode.getAttribute('id')+'-cover');
			cover.style = 'display: none;';

			addStyleWithId(
				cover.getAttribute('id'),
				'{background-color:rgba(0, 0, 0, 0.2);position:fixed;top:0;left:0;width:100%;height:100%;}'
			);

			document.body.appendChild(cover);
			cover.appendChild(popupNode);

			
			// Adding event listener to close the popup
			cover.addEventListener('click', function(event) {
				if(event.target === cover) {
					closePopup(popupNode);
				}
			});
		}
	}

	function addStyleWithId(id, style) {
		var css = '#'+id+style;
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		var fStyle = head.getElementsByTagName('style')[0];

		style.type = 'text/css';
		if (style.styleSheet){
		  	style.styleSheet.cssText = css;
		} else {
		  	style.appendChild(document.createTextNode(css));
		}

		if(fStyle) {
			head.insertBefore(style, fStyle);	
		} else {
			head.appendChild(style);
		}
		
	}

	function isInside(node, target) {
		for(; node != null; node = node.parentNode) {
	  		if (node == target) {
	  			return true;
	  		}
	  	}
	}

	setupPopups();
})();