FrontStar.getService().registerService('api', ['someService'], {

    init: function () {
        this.initCompleted('api');
    },


    getSettings: function (callback) {
        this.__get('settings', callback);
    },

    __get: function (apiMethod, callback, format, data, failCallback, httpMethod) {

        format = format ? format : 'json';
        httpMethod = httpMethod ? httpMethod.toUpperCase() : 'GET';


        var ajax = (httpMethod == 'POST') ?
            this.__compositePost() :
            this.__compositeGet();

        var url = [
            VillabetVideoFeed.app.config.endpoint,
            apiMethod,
            'id',
            VillabetVideoFeed.app.config.feedId
        ];

        var body = '';

        if (data) {

            var dataObjectKeys = Object.keys(data);
            var params = [];

            for (var i = 0; i < dataObjectKeys.length; i++) {

                if (httpMethod == 'POST') {
                    params.push(dataObjectKeys[i] + "=" + encodeURIComponent(data[dataObjectKeys[i]]));
                }
                else {
                    url.push(dataObjectKeys[i]);
                    url.push(data[dataObjectKeys[i]]);
                }
            }

            body = params.join('&');
        }

        ajax.open(httpMethod, url.join('/'), true);

        if (httpMethod == 'POST') {
            ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        ajax.onerror = (function (e) {

            if (failCallback) {
                failCallback();
            }

        }).bind(this);

        ajax.onreadystatechange = (function () {

            if (ajax.readyState == 4) {

                if (ajax.status == 200 && callback) {

                    var response = ajax.responseText;

                    if (format == 'json') {
                        response = JSON.parse(ajax.responseText);
                    }

                    callback(response);
                    return;
                }
                else if (failCallback) {
                    failCallback();
                }
            }

        }).bind(this);

        ajax.send(body);
    }
});