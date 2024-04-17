export async function word(){
    let fetchWord = fetch('https://random-word-api.herokuapp.com/word');
    fetchWord.then(res =>
        res.json()).then(d => {
            console.log(d);
            let word = d;
            return word;
    });
    const dict_url = ('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
    //console.log(url.href);
    // API for get requests
    let fetchDict = fetch(dict_url);

    // FetchRes is the promise to resolve
    // it by using.then() method
    fetchDict.then(res =>
        res.json()).then(d => {
            const po_speech = d[0].meanings[0].partOfSpeech;
            const definition = d[0].meanings[0].definitions[0].definition;
            console.log(po_speech, definition);
            return po_speech, definition;
    })

}


export async function translate(input, lang) {
    //console.log(input + " " + lang);
    const url = 'https://text-translator2.p.rapidapi.com/translate';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '22e6a8f89fmshf805719fefbd862p1d3f2fjsn27884eb9fc89',
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
      },
        body: new URLSearchParams({
            source_language: 'auto',
            target_language: lang,
            text: input
        })
    };

    try {
        const response =  await fetch(url, options);
        const result = await response.json();

        // Check if the status is success and if translatedText exists in the data object
        if (result.status === 'success' && result.data && result.data.translatedText) {
            const translatedText = result.data.translatedText;
            //console.log(translatedText);
            return translatedText; // Return translated text
        } else {
            throw new Error('Unable to get translated text');
        }
    } 
    catch (error) {
        console.error(error);
        return input;
    }
    
}

export function matchLanguage(data, name){
    //get array
    var lang_array = language["languages"];

    //go through whole array
    for (var i = 0; i < lang_array.length; i++) {
        //getting lang from color
        if(data == "color"){
            var data_array = lang_array[i].color;
            if (data_array && data_array.includes(name)) {
                //console.log(lang_array[i].name);
                return lang_array[i].code;
            }
        }

        //getting color from nation
        if (data == "nation"){
            var data_array = lang_array[i].nation;
            if (data_array && data_array.includes(name)) {
                return lang_array[i].color;
            }
        }
    } 
}

/* LANGUAGE ARRAY */
var language = {
    "description": "",
    "languages": [
// --- AFRICA
    {
        "color": "(239,60,35)",
        "code": "am",
        "name": "Amharic",
        "nation": ["Ethiopia"]
    },
    {
        "color": "(255,102,0)",
        "code": "ar",
        "name": "Arabic",
        "nation": ["Algeria", "Bahrain", "Chad", "Egypt", "Eritrea", "Iraq", "Jordan", "Kuwait", "Lebanon", "Libya", "Mauritania", "Morocco", "Oman", "Palestine", "Qatar", "Saudi Arabia", "Sudan", "Syria", "Tunisia", "UAE", "Western Sahara", "Yemen"]
    },
    {
        "color": "(255,153,0)",
        "code": "ny",
        "name": "Chichewa",
        "nation": ["Malawi"]
    },
    {
        "color": "(255,204,0)",
        "code": "mg",
        "name": "Madagascar"
    },
    {
        "color": "(255,255,0)",
        "code": "ha",
        "name": "Hausa",
        "nation": ["Nigeria", "Niger"]
    },
    {
        "color": "(204,255,0)",
        "code": "rw",
        "name": "Kinyarwanda",
        "nation": ["Rwanda"]
    },
    {
        "color": "(153,255,0)",
        "code": "ps",
        "name": "Pashto",
        "nation": ["Afghanistan"]
    },
    {
        "color": "(102,255,0)",
        "code": "fa",
        "name": "Persian",
        "nation": ["Iran"]
    },
    {
        "color": "(51,255,0)",
        "code": "st",
        "name": "Sesotho",
        "nation": ["Lesotho"]
    },
    {
        "color": "(0,255,0)",
        "code": "sn",
        "name": "Shona",
        "nation": ["Zimbabwe"]
    },
    {
        "color": "(0,255,51)",
        "code": "so",
        "name": "Somali",
        "nation": ["Somalia", "Djibouti"]
    },
    {
        "color": "(0,255,102)",
        "code": "sw",
        "name": "Swahili",
        "nation": ["Tanzania", "Kenya", "Uganda", "DRC"]
    },
    {
        "color": "(237,32,36)",
        "code": "zu",
        "name": "Zulu",
        "nation": ["South Africa"]
    },
    /* --- non-dominant
    {
        "code": "af",
        "name": "Afrikaans",
        "nation": ["South Africa"]
    },
    {
        "code": "xh",
        "name": "Xhosa*",
        "nation": ["South Africa", "Zimbabwe"]
    },
    {
        "code": "yo",
        "name": "Yoruba*",
        "nation": ["Nigeria"]
    },
    {
        "code": "ig",
        "name": "Igbo*",
        "nation": ["Nigeria"]
    },
    {
        "code": "ku",
        "name": "Kurdish (Kurmanji)*",
        "nation": ["Turkey", "Iran", "Iraq", "Syria"]
    },
    */
// --- AMERICAS
    {
        "color": "(245,255,191)",
        "code": "en",
        "name": "English",
        "nation": ["Anguilla", "Antigua and Barbuda", "Australia", "Bahamas", "Barbados", "Bermuda", "Belize", "Botswana", "Burundi", "Canada", "Cameroon", "Cayman Islands", "Cook Islands", "Dominica", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Gambia", "Ghana", "Grenada", "Guam", "Guyana", "Isle of Man", "Jamaica", "Jersey", "Kiribati", "Liberia", "Marshall Islands", "Micronesia", "Montenegro", "Montserrat", "Namibia", "Nauru", "Niue", "Norfolk Island", "Northern Mariana Islands", "Papua New Guinea", "Palau", "Pitcairn", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and The Grenadines", "Solomon Islands", "Sierra Leone", "Singapore", "South Sudan", "South Georgia and The South Sandwich Islands", "Swaziland", "Trinidad", "Tonga", "Tokelau", "Turks and Caicos Islands", "Tuvalu", "US", "UK", "Vanuatu", "Virgin Islands, British", "Virgin Islands, U.S.", "Zambia"]
    },
    {
        "color": "(0,255,153)",
        "code": "ht",
        "name": "Haitian Creole",
        "nation": ["Haiti"]
    },
    {
        "color": "(0,255,204)",
        "code": "haw",
        "name": "Hawaiian",
        "nation": ["Hawaii"]
    },
// --- EUROPE
    {
        "color": "(0,255,255)",
        "code": "sq",
        "name": "Albanian",
        "nation": ["Albania"]
    },
    {
        "color": "(0,204,255)",
        "code": "hy",
        "name": "Armenian",
        "nation": ["Armenia"]
    },
    {
        "color": "(0,153,255)",
        "code": "az",
        "name": "Azerbaijani",
        "nation": ["Azerbaijan"]
    },
    {
        "color": "(0,102,255)",
        "code": "be",
        "name": "Belarusian",
        "nation": ["Belarus"]
    },
    {
        "color": "(0,51,255)",
        "code": "bs",
        "name": "Bosnian",
        "nation": ["Bosnia and Herzegovina"]
    },
    {
        "color": "(0,0,255)",
        "code": "bg",
        "name": "Bulgarian",
        "nation": ["Bulgaria"]
    },
    {
        "color": "(51,0,255)",
        "code": "ca",
        "name": "Catalan",
        "nation": ["Andorra"]
    },
    {
        "color": "(102,0,255)",
        "code": "hr",
        "name": "Croatian",
        "nation": ["Croatia"]
    },
    {
        "color": "(153,0,255)",
        "code": "cs",
        "name": "Czech",
        "nation": ["Czech Republic"]
    },
    {
        "color": "(204,0,255)",
        "code": "da",
        "name": "Danish",
        "nation": ["Denmark", "Greenland"]
    },
    {
        "color": "(255,0,255)",
        "code": "nl",
        "name": "Dutch",
        "nation": ["Aruba", "Netherlands", "Suriname"]
    },
    {
        "color": "(255,0,204)",
        "code": "et",
        "name": "Estonian",
        "nation": ["Estonia"]
    },
    {
        "color": "(255,0,153)",
        "code": "fi",
        "name": "Finnish",
        "nation": ["Finland"]
    },
    {
        "color": "(255,0,102)",
        "code": "fr",
        "name": "French",
        "nation": ["Benin", "Burkina Faso", "Central African Republic", "Comoros", "Congo", "France", "Gabon", "Guadeloupe", "Guernsey", "Guinea", "Cote D'ivoire", "Mali", "Mauritius", "Mayotte", "Martinique", "Monaco", "New Caledonia", "Reunion", "Saint Pierre and Miquelon", "Senegal", "Seychelles", "Togo", "Wallis and Futuna"]
    },
    {
        "color": "(255,0,51)",
        "code": "ka",
        "name": "Georgian",
        "nation": ["Georgia"]
    },
    {
        "color": "(20,204,204)",
        "code": "de",
        "name": "German",
        "nation": ["Austria", "Belgium", "Germany", "Liechtenstein", "Luxembourg", "Switzerland"]
    },
    {
        "color": "(102,102,2)",
        "code": "el",
        "name": "Greek",
        "nation": ["Greece", "Cyprus"]
    },
    {
        "color": "(153,0,153)",
        "code": "iw",
        "name": "Hebrew",
        "nation": ["Israel"]
    },
    {
        "color": "(102,0,102)",
        "code": "hu",
        "name": "Hungarian",
        "nation": ["Hungary"]
    },
    {
        "color": "(51,0,51)",
        "code": "is",
        "name": "Icelandic",
        "nation": ["Iceland"]
    },
    {
        "color": "(51,0,102)",
        "code": "ga",
        "name": "Irish",
        "nation": ["Ireland"]
    },
    {
        "color": "(51,0,153)",
        "code": "it",
        "name": "Italian",
        "nation": ["Italy", "San Marino", "Holy See (Vatican City State)"]
    },
    {
        "color": "(51,0,204)",
        "code": "kk",
        "name": "Kazakh",
        "nation": ["Kazakhstan"]
    },
    {
        "color": "(51,101,200)",
        "code": "ky",
        "name": "Kyrgyz",
        "nation": ["Kyrgyzstan"]
    },
    {
        "color": "(51,51,255)",
        "code": "lv",
        "name": "Latvian",
        "nation": ["Latvia"]
    },
    {
        "color": "(51,51,204)",
        "code": "lt",
        "name": "Lithuanian",
        "nation": ["Lithuania"]
    },
    {
        "color": "(51,51,102)",
        "code": "mk",
        "name": "Macedonian",
        "nation": ["Macedonia"]
    },
    {
        "color": "(23,127,81)",
        "code": "mt",
        "name": "Maltese",
        "nation": ["Malta"]
    },
    {
        "color": "(149,215,150)",
        "code": "pl",
        "name": "Polish",
        "nation": ["Poland"]
    },
    {
        "color": "(135,64,58)",
        "code": "no",
        "name": "Norwegian",
        "nation": ["Norway", "Svalbard and Jan Mayen"]
    },
    {
        "color": "(71,179,173)",
        "code": "pt",
        "name": "Portuguese*",
        "nation": ["Portugal", "Brazil", "Angola", "Cabo Verde", "Guinea-bissau", "Mozambique", "Sao Tome and Principe", "Timor-leste"]
    },
    {
        "color": "(91,168,88)",
        "code": "ro",
        "name": "Romanian",
        "nation": ["Moldova", "Romania"]
    },
    {
        "color": "(59,147,170)",
        "code": "ru",
        "name": "Russian",
        "nation": ["Russia"]
    },
    {
        "color": "(55,182,70)",
        "code": "gd",
        "name": "Scots Gaelic",
        "nation": ["Scotland"]
    },
    {
        "color": "(61,203,243)",
        "code": "sr",
        "name": "Serbian",
        "nation": ["Serbia"]
    },
    {
        "color": "(58,114,88)",
        "code": "sk",
        "name": "Slovak",
        "nation": ["Slovakia"]
    },
    {
        "color": "(100,122,203)",
        "code": "sl",
        "name": "Slovenian",
        "nation": ["Slovenia"]
    },
    {
        "color": "(100,125,163)",
        "code": "sv",
        "name": "Swedish",
        "nation": ["Sweden", "Åland Islands"]
    },
    {
        "color": "(70,122,111)",
        "code": "es",
        "name": "Spanish",
        "nation": ["Spain", "Mexico", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama", "Cuba", "Dominican Republic", "Puerto Rico", "Argentina", "Bolivia", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela", "Equatorial Guinea", "Cuba"]
    },
    {
        "color": "(62,202,95)",
        "code": "tg",
        "name": "Tajik",
        "nation": ["Tajikistan"]
    },
    {
        "color": "(82,102,181)",
        "code": "tr",
        "name": "Turkish",
        "nation": ["Turkey"]
    },
    {
        "color": "(75,189,64)",
        "code": "tk",
        "name": "Turkmen",
        "nation": ["Turkmenistan"]
    },
    {
        "color": "(107,201,91)",
        "code": "uk",
        "name": "Ukrainian",
        "nation": ["Ukraine"]
    },
    {
        "color": "(83,148,96)",
        "code": "uz",
        "name": "Uzbek",
        "nation": ["Uzbekistan"]
    },
    {
        "color": "(110,130,203)",
        "code": "cy",
        "name": "Welsh",
        "nation": ["Wales"]
    },
    /* --- non-dominant
    {
        "code": "eu",
        "name": "Basque*",
        "nation": ["Basque"]
    },
    {
        "code": "fy",
        "name": "Frisian*",
        "nation": ["Netherlands"]
    },
    {
        "code": "co",
        "name": "Corsican*",
        "nation": ["France", "Italy"]
    },
    {
        "code": "gl",
        "name": "Galician*",
        "nation": ["Spain"]
    },
    {
        "code": "tt",
        "name": "Tatar*",
        "nation": ["Russia"]
    },
    {
        "code": "yi",
        "name": "Yiddish*",
        "nation": ["Russia"]
    },
    {
        "color": "(51,51,153)",
        "code": "lb",
        "name": "Luxembourgish*",
        "nation": ["Luxembourg"]
    },
    */
// --- ASIA
    {
        "color": "(147,178,64)",
        "code": "bn",
        "name": "Bengali",
        "nation": ["Bangladesh"]
    },
    {
        "color": "(147,84,82)",
        "code": "zh-CN",
        "name": "Chinese (Simplified)",
        "nation": ["China"]
    },
    {
        "color": "(23,117,165)",
        "code": "zh-TW",
        "name": "Chinese (Traditional)",
        "nation": ["Hong Kong", "Taiwan", "Macau"]
    },
    {
        "color": "(33,164,122)",
        "code": "tl",
        "name": "Filipino",
        "nation": ["Philippines"]
    },
    {
        "color": "(34,92,22)",
        "code": "hi",
        "name": "Hindi",
        "nation": ["India"]
    },
    {
        "color": "(130,214,35)",
        "code": "id",
        "name": "Indonesian",
        "nation": ["Indonesia"]
    },
    {
        "color": "(47,191,250)",
        "code": "ja",
        "name": "Japanese",
        "nation": ["Japan"]
    },
    {
        "color": "(133,157,155)",
        "code": "km",
        "name": "Khmer",
        "nation": ["Cambodia"]
    },
    {
        "color": "(209,22,236)",
        "code": "ko",
        "name": "Korean",
        "nation": ["North Korea", "South Korea"]
    },
    {
        "color": "(78,35,176)",
        "code": "lo",
        "name": "Lao",
        "nation": ["Laos"]
    },
    {
        "color": "(101,215,172)",
        "code": "ms",
        "name": "Malay",
        "nation": ["Brunei Darussalam", "Malaysia"]
    },
    {
        "color": "(112,138,16)",
        "code": "mi",
        "name": "Maori",
        "nation": ["New Zealand"]
    },
    {
        "color": "(75,215,11)",
        "code": "mn",
        "name": "Mongolian",
        "nation": ["Mongolia"]
    },
    {
        "color": "(193,28,165)",
        "code": "my",
        "name": "Myanmar (Burmese)",
        "nation": ["Myanmar"]
    },
    {
        "color": "(76,14,198)",
        "code": "ne",
        "name": "Nepali",
        "nation": ["Bhutan", "Nepal"]
    },
    
    {
        "color": "(147,49,86)",
        "code": "sm",
        "name": "Samoan",
        "nation": ["Samoa"]
    },
    {
        "color": "(175,100,200)",
        "code": "si",
        "name": "Sinhala",
        "nation": ["Sri Lanka"]
    },
    {
        "color": "(187,141,40)",
        "code": "th",
        "name": "Thai",
        "nation": ["Thailand"]
    },
    {
        "color": "(127,28,151)",
        "code": "ur",
        "name": "Urdu",
        "nation": ["Pakistan"]
    },
    {
        "color": "(138,34,218)",
        "code": "vi",
        "name": "Vietnamese",
        "nation": ["Vietnam"]
    },
    /* --- non-dominant
    {
        "code": "ceb",
        "name": "Cebuano*",
        "nation": ["Philippines"]
    },
    {
        "code": "gu",
        "name": "Gujarati*",
        "nation": ["India"]
    },
    {
        "code": "jw",
        "name": "Javanese*",
        "nation": ["Indonesia"]
    },
    {
        "code": "kn",
        "name": "Kannada*",
        "nation": ["India"]
    },
    {
        "code": "ml",
        "name": "Malayalam*",
        "nation": ["India"]
    },
    {
        "code": "mr",
        "name": "Marathi*",
        "nation": ["India"]
    },
    {
        "code": "su",
        "name": "Sundanese*",
        "nation": ["Indonesia"]
    },
    {
        "code": "ta",
        "name": "Tamil*",
        "nation": ["India", "Sri Lanka"]
    },
    {
        "code": "ug",
        "name": "Uyghur*",
        "nation": ["China"]
    },
    {
        "color": "(49,123,187)",
        "code": "or",
        "name": "Odia (Oriya)",
        "nation": ["India"]
    },
    {
        "color": "(74,215,103)",
        "code": "pa",
        "name": "Punjabi",
        "nation": ["India"]
    },
    {
        "color": "(122,115,158)",
        "code": "sd",
        "name": "Sindhi",
        "nation": ["India"]
    },
    {
        "color": "(113,116,39)",
        "code": "te",
        "name": "Telugu",
        "nation": ["India"]
    },
    */
    ]
}