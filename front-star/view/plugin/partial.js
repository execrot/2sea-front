FrontStar.get('view').registerPlugin('partial', function (template, data) {
    return FrontStar.get('view').render(template, data);
});