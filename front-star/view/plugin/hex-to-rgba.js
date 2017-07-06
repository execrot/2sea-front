FrontStar.get('view').registerPlugin('hexToRGBA', function (hex, opacity) {

    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){

        var color = hex.substring(1).split('');

        if (color.length== 3) {
            color = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }

        color = '0x' + color.join('');

        return 'rgba('+[(color>>16)&255, (color>>8)&255, color&255].join(',')+',' + opacity + ')';
    }
});