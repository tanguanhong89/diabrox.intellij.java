(function(Hammer){Hammer.plugins.showTouches=function(force){var template_style='position:absolute;z-index:9999;left:0;top:0;height:14px;width:14px;border:solid 2px #777;'+
'background:rgba(255,255,255,.7);border-radius:20px;pointer-events:none;'+
'margin-top:-9px;margin-left:-9px;';var touch_elements={};var touches_index={};function removeUnusedElements(){for(var key in touch_elements){if(touch_elements.hasOwnProperty(key)&&!touches_index[key]){document.body.removeChild(touch_elements[key]);delete touch_elements[key];}}}
Hammer.detection.register({name:'show_touches',priority:0,handler:function(ev,inst){touches_index={};if(ev.pointerType!=Hammer.POINTER_MOUSE&&!force){removeUnusedElements();return;}
for(var t=0,total_touches=ev.touches.length;t<total_touches;t++){var touch=ev.touches[t];var id=touch.identifier;touches_index[id]=touch;if(!touch_elements[id]){var template=document.createElement('div');template.setAttribute('style',template_style);document.body.appendChild(template);touch_elements[id]=template;}
touch_elements[id].style.left=touch.pageX+'px';touch_elements[id].style.top=touch.pageY+'px';}
removeUnusedElements();}});};})(window.Hammer);