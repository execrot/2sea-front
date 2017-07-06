FrontStar.registerComponent('dom', function (selector) {

    var elements = [];
    var rootId = 'html';

    if (!selector) {
        selector = rootId;
    }

    if (typeof selector == "string") {

        if (selector == 'body') {
            elements = [].slice.call(document.querySelectorAll('body'));
        }
        else if (selector == rootId) {
            elements = [].slice.call(document.querySelectorAll(selector));
        }
        else {
            elements = [].slice.call(document.querySelectorAll(rootId + ' ' + selector));
        }
    }
    else if (typeof selector == "object") {

        if (selector instanceof Array) {
            elements = selector;
        }

        else {
            elements = [selector];
        }
    }
    else {
        return;
    }

    if (!window.__domElementEvents) {
        window.__domElementEvents = {};
    }

    return {

        elements: elements || [],
        appIdNamespace: rootId,

        get: function(){

            if (this.elements.length == 1) {
                return this.elements[0];
            }

            return this.elements;
        },

        size: function () {
            return this.elements.length;
        },

        find: function (selector) {

            if (!this.elements || !this.elements.length) {
                return;
            }

            return FrontStar.dom([].slice.call(this.elements[0].querySelectorAll(selector)));
        },

        hasClass: function (className) {

            if (!this.elements || !this.elements.length) {
                return false;
            }

            return this.elements[0].classList.contains(className);
        },

        addClass: function(className){

            this.elements.forEach((function(element){
                element.classList.add(className);
            }).bind(this));

            return this;
        },

        removeClass: function(className){

            this.elements.forEach((function (element) {
                element.classList.remove(className);
            }).bind(this));

            return this;
        },

        html: function(htmlContent){

            if (!htmlContent) {

                if (this.elements.length > 0) {
                    return this.elements[0].innerHTML;
                }
                return;
            }

            this.elements.forEach((function(element){
                element.innerHTML = htmlContent;
            }).bind(this));
        },

        text: function(textContent){

            if (!textContent) {

                if (this.elements.length > 0) {
                    return this.elements[0].innerText;
                }
                return;
            }

            this.elements.forEach((function(element){
                element.innerText = textContent;
            }).bind(this));
        },

        remove: function () {

            this.elements.forEach(function(element){
                element.remove();
            });

            this.elements = [];
        },

        append: function(content) {
            this.__manipulate(content, 'appendChild');
        },

        prepend: function(content) {
            this.__manipulate(content, 'prepend');
        },

        createAppend: function(tagName, inner, attrs){
            this.elements.forEach((function(element){
                element.appendChild(
                    this.__createElement(tagName, inner, attrs)
                );
            }).bind(this));

            return this;
        },

        createPrepend: function(tagName, inner, attrs){
            this.elements.forEach((function(element){
                element.prepend(
                    this.__createElement(tagName, inner, attrs)
                );
            }).bind(this));

            return this;
        },

        live: function (type, selector, callback) {

            document.addEventListener(type, function (event) {

                var qs = document.querySelectorAll(selector);

                if (qs) {

                    var el = event.target, index = -1;

                    while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                        el = el.parentElement;
                    }

                    if (index > -1) {
                        callback.call(el, event);
                    }
                }
            });
        },

        bind: function(type, callback){

            this.elements.forEach((function(element){

                if (!window.__domElementEvents[type]) {
                    window.__domElementEvents[type] = [];
                }

                var event = {
                    type:     type,
                    element:  element,
                    callback: callback,
                    bindMethod:   'addEventListener',
                    unbindMethod: 'removeEventListener',
                    index:    Math.random()
                };

                // Microsoft style
                if (element.attachEvent) {

                    event.event = 'on' + event.event;
                    event.bindMethod = 'attachEvent';
                    event.unbindMethod = 'detachEvent';

                    event.callback = function() {
                        return callback.apply(element, [window.event]);
                    };
                }

                element[event.bindMethod](event.type, event.callback);

                window.__domElementEvents[type].push(event);

            }).bind(this));

            return this;
        },

        unbind: function(type){

            if (!window.__domElementEvents[type]) {
                return this;
            }

            window.__domElementEvents[type].forEach((function(event){

                this.elements.forEach((function(element){

                    element[event.unbindMethod](type, event.callback);

                    window.__domElementEvents[type].splice(event.index, 1);

                }).bind(this));

            }).bind(this));

            return this;
        },

        data: function(name, value){

            if (!value) {

                if (!this.elements.length) {
                    return;
                }

                return this.elements[0].getAttribute('data-' + name);
            }

            this.elements.forEach((function(element){
                element.setAttribute('data-' + name, value);
            }).bind(this));

            return this;
        },

        val: function (value) {

            if (!this.elements.length) {
                return;
            }

            if (!value) {
                return this.elements[0].value;
            }

            this.elements.forEach((function(element){
                element.value = value;
            }).bind(this));

            return this;
        },


        attr: function (name, value) {

            if (!value) {

                if (!this.elements.length) {
                    return;
                }

                return this.elements[0].getAttribute(name);
            }

            this.elements.forEach((function(element){
                element.setAttribute(name, value);
            }).bind(this));

            return this;
        },


        css: function (style, value) {

            var styles = {};

            if (typeof style == "string") {
                styles[style] = value;
            }
            else {
                styles = style;
            }

            if (typeof style == "object" || value) {

                this.elements.forEach(function(element){

                    var stylesObjectKeys = Object.keys(styles);

                    for (var i=0; i<stylesObjectKeys.length; i++) {
                        element.style[stylesObjectKeys[i]] = styles[stylesObjectKeys[i]];
                    }

                });

                return;
            }

            if (this.elements.length && typeof style == "string") {
                return this.elements[0].style[style];
            }
        },

        width: function (value) {


            if (value) {

                this.elements.forEach((function(element){

                    var el = FrontStar.dom(element);

                    el.css('width', typeof value == 'string' ? value : value + 'px');

                }).bind(this));

                return;
            }

            if (this.elements.length) {
                return parseInt(this.elements[0].getBoundingClientRect().width);
            }
            return false;
        },

        height: function (value) {

            if (value) {

                this.elements.forEach((function(element){

                    var el = FrontStar.dom(element);

                    el.css('height', typeof value == 'string' ? value : value + 'px');

                }).bind(this));

                return;
            }

            if (this.elements.length) {
                return parseInt(this.elements[0].getBoundingClientRect().height);
            }
            return false;
        },

        __manipulate: function (content, method) {

            var tempElement = this.__createElement('div', content);
            tempElement.innerHTML = content;

            tempElement.childNodes.forEach((function(element){

                this.elements.forEach((function(targetElement){
                    targetElement[method](element)
                }).bind(this));

            }).bind(this));
        },

        __createElement: function (tagName, inner, attrs) {

            var element = document.createElement(tagName);

            element.innerHTML = inner;

            if (attrs) {

                for (var attr in attrs) {

                    if (attr == 'style') {

                        for (var styleName in attrs['style']) {
                            element.style[styleName] = attrs['style'][styleName];
                        }
                    }
                    else {
                        element[attr] = attrs[attr];
                    }
                }
            }

            return element;
        }
    };
});

(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
