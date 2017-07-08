FrontStar.getService().registerService('translate', {

    template : '<phrase ' +
                    'data-translation="true"' +
                    'data-lang-code="{{ langCode }}" ' +
                    'data-origin-phrase="{{ originPhrase }}">' +
                        '{{ translation }}' +
                '</phrase>',

    phrases: {
        'Отдохнуть': {
            'ru': 'Отдохни!',
            'en': 'Take a rest!'
        },
        'О проекте': {
            'ru' : 'О проекте',
            'en': 'About'
        },
        'Обратная связь': {
            'ru': 'Обратная связь',
            'en': 'Feedback'
        },
        'От': {
            'ru': 'От',
            'en': 'From'
        },
        'Одесса': {
            'ru': 'Одесса',
            'en': 'Odessa'
        }
    },

    activeLanguage: null,

    getActiveLanguage: function () {
        return this.activeLanguage;
    },

    init: function (){

        var storage = FrontStar.get('storage');

        this.activeLanguage = storage.getItem('lang');

        if (!this.activeLanguage) {
            this.activeLanguage = (navigator.language || navigator.userLanguage).substring(0, 2).toLowerCase();
        }

        FrontStar.get('view').registerPlugin('translate', this.translate.bind(this));

        this.initCompleted('translate');
    },

    changeLanguage: function (langCode) {

        langCode = langCode.toLowerCase();

        if (langCode != 'ru' && langCode != 'en') {
            return;
        }

        this.activeLanguage = langCode;
        var storage = FrontStar.get('storage').setItem('lang', this.activeLanguage);

        this.updatePhrases();
    },

    updatePhrases: function(){

        $('[data-translation]').each((function(index, element){

            $(this).attr('data-lang-code', this.activeLanguage);

            var phrase = this.phrases[$(element).data('origin-phrase')];

            if (phrase) {

                if ($(element).data('translation-attr')) {
                    $(element).attr(
                        $(element).data('translation-attr'),
                        this.phrases[$(element).data('origin-phrase')][this.activeLanguage]
                    );
                }
                else {
                    $(element).html(this.phrases[$(element).data('origin-phrase')][this.activeLanguage]);
                }
            }

        }).bind(this));
    },

    translate: function (phrase, withoutTpl) {

        if (!this.phrases[phrase]) {

            window.phrases = !window.phrases ? {} : window.phrases;
            window.phrases[phrase] = {'ru':phrase, 'en':phrase};

            return phrase;
        }

        var translation = phrase;

        if (this.phrases[phrase]) {
            translation = this.phrases[phrase][this.activeLanguage];
        }

        if (withoutTpl) {
            return translation;
        }

        return this.template
            .replace("{{ langCode }}", this.activeLanguage)
            .replace("{{ originPhrase }}", phrase)
            .replace("{{ translation }}", translation);
    }
});