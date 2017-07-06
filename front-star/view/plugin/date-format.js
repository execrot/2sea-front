FrontStar.get('view').registerPlugin('dateFormat', function (format, timestamp, toUTC) {

    if (toUTC) {
        timestamp = timestamp - ((new Date).getTimezoneOffset() * 60);
    }

    var date = new Date(timestamp * 1000);

    var daysWords = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var monthsWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

    var values = {
        '{yyyy}': date.getFullYear(),
        '{yy}':   date.getFullYear().toString().substr(2),
        '{mm}':   (date.getMonth() < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
        '{m}':    date.getMonth(),
        '{mw}':   monthsWords[date.getMonth()],
        '{dd}':   (date.getDate() < 10 ) ? "0" + date.getDate() : date.getDate(),
        '{d}':    date.getDay(),
        '{dw}':   daysWords[date.getDay()-1],
        '{hh}':   (date.getHours() < 10 ) ? "0" + date.getHours() : date.getHours(),
        '{h}':    date.getHours(),
        '{mins}': (date.getMinutes() < 10 ) ? "0" + date.getMinutes() : date.getMinutes(),
        '{min}':  date.getMinutes(),
        '{ss}':   (date.getSeconds() < 10 ) ? "0" + date.getSeconds() : date.getSeconds(),
        '{s}':    date.getSeconds(),
        '{tzh}':  date.getTimezoneOffset() / 60 * (-1)
    };

    for (var value in values) {
        format = format.split(value).join(values[value]);
    }

    return format;
});