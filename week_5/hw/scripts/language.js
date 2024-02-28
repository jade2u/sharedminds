export async function translate(input, lang) {
    console.log(input + " " + lang);
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
        "nation": ["Algeria", "Bahrain", "Egypt", "Iraq", "Jordan", "Kuwait", "Lebanon", "Libya", "Mauritania", "Morocco", "Oman", "Palestine", "Qatar", "Saudi Arabia", "Sudan", "Syria", "Tunisia", "UAE", "Yemen"]
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
        "nation": ["Somalia"]
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
        "nation": ["US", "Canada", "Singapore", "UK", "Jamaica", "Barbados", "Trinidad", "Bahamas", "Guyana", "Fiji", "Tonga", "Solomon", "Micronesia", "Vanuatu", "Kiribati", "Cameroon", "Ghana", "Botswana"]
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
        "color": "(255,255,0)",
        "code": "sq",
        "name": "Albanian",
        "nation": ["Albania"]
    },
    {
        "color": "(255,255,0)",
        "code": "hy",
        "name": "Armenian",
        "nation": ["Armenia"]
    },
    {
        "color": "(255,255,0)",
        "code": "az",
        "name": "Azerbaijani",
        "nation": ["Azerbaijan"]
    },
    {
        "color": "(255,255,0)",
        "code": "be",
        "name": "Belarusian",
        "nation": ["Belarus"]
    },
    {
        "color": "(255,255,0)",
        "code": "bs",
        "name": "Bosnian",
        "nation": ["Bosnia"]
    },
    {
        "color": "(255,255,0)",
        "code": "bg",
        "name": "Bulgarian",
        "nation": ["Bulgaria"]
    },
    {
        "color": "(255,255,0)",
        "code": "ca",
        "name": "Catalan",
        "nation": ["Andorra"]
    },
    {
        "color": "(255,255,0)",
        "code": "hr",
        "name": "Croatian",
        "nation": ["Croatia"]
    },
    {
        "color": "(255,255,0)",
        "code": "cs",
        "name": "Czech",
        "nation": ["Czechia"]
    },
    {
        "color": "(255,255,0)",
        "code": "da",
        "name": "Danish",
        "nation": ["Denmark"]
    },
    {
        "color": "(255,255,0)",
        "code": "nl",
        "name": "Dutch",
        "nation": ["Netherlands"]
    },
    {
        "color": "(255,255,0)",
        "code": "et",
        "name": "Estonian",
        "nation": ["Estonia"]
    },
    {
        "color": "(255,255,0)",
        "code": "fi",
        "name": "Finnish",
        "nation": ["Finland"]
    },
    {
        "color": "(255,255,0)",
        "code": "fr",
        "name": "French",
        "nation": ["Benin", "Congo", "DRC", "Ivory Coast", "France", "Gabon", "Guinea", "Monaco", "Senegal", "Togo"]
    },
    {
        "color": "(255,255,0)",
        "code": "ka",
        "name": "Georgian",
        "nation": ["Georgia"]
    },
    {
        "color": "(255,255,0)",
        "code": "de",
        "name": "German",
        "nation": ["Germany", "Austria", "Belgium", "Luxembourg"]
    },
    {
        "color": "(255,255,0)",
        "code": "el",
        "name": "Greek",
        "nation": ["Greece", "Cyprus"]
    },
    {
        "color": "(255,255,0)",
        "code": "iw",
        "name": "Hebrew",
        "nation": ["Israel"]
    },
    {
        "color": "(255,255,0)",
        "code": "hu",
        "name": "Hungarian",
        "nation": ["Hungary"]
    },
    {
        "color": "(255,255,0)",
        "code": "is",
        "name": "Icelandic",
        "nation": ["Iceland"]
    },
    {
        "color": "(255,255,0)",
        "code": "ga",
        "name": "Irish",
        "nation": ["Ireland"]
    },
    {
        "color": "(255,255,0)",
        "code": "it",
        "name": "Italian",
        "nation": ["Italy", "San Marino"]
    },
    {
        "color": "(255,255,0)",
        "code": "kk",
        "name": "Kazakh",
        "nation": ["Kazazkhstan"]
    },
    {
        "color": "(255,255,0)",
        "code": "ky",
        "name": "Kyrgyz",
        "nation": ["Kyrgyzstan"]
    },
    {
        "color": "(255,255,0)",
        "code": "lv",
        "name": "Latvian",
        "nation": ["Latvia"]
    },
    {
        "color": "(255,255,0)",
        "code": "lt",
        "name": "Lithuanian",
        "nation": ["Lithuania"]
    },
    {
        "color": "(255,255,0)",
        "code": "lb",
        "name": "Luxembourgish*",
        "nation": ["Luxembourg"]
    },
    {
        "color": "(255,255,0)",
        "code": "mk",
        "name": "Macedonian",
        "nation": ["Macedonia"]
    },
    {
        "color": "(255,255,0)",
        "code": "mt",
        "name": "Maltese",
        "nation": ["Malta"]
    },
    {
        "color": "(255,255,0)",
        "code": "pl",
        "name": "Polish",
        "nation": ["Poland"]
    },
    {
        "color": "(255,255,0)",
        "code": "no",
        "name": "Norwegian",
        "nation": ["Norway"]
    },
    {
        "color": "(255,255,0)",
        "code": "pt",
        "name": "Portuguese*",
        "nation": ["Portugal", "Brazil", "Angola", "Cabo Verde", "Guinea-Bissau", "Mozambique", "Sao Tome", "East Timor"]
    },
    {
        "color": "(255,255,0)",
        "code": "ro",
        "name": "Romanian",
        "nation": ["Romania"]
    },
    {
        "color": "(255,255,0)",
        "code": "ru",
        "name": "Russian",
        "nation": ["Russia"]
    },
    {
        "color": "(255,255,0)",
        "code": "gd",
        "name": "Scots Gaelic",
        "nation": ["Scotland"]
    },
    {
        "color": "(255,255,0)",
        "code": "sr",
        "name": "Serbian",
        "nation": ["Serbia"]
    },
    {
        "color": "(255,255,0)",
        "code": "sk",
        "name": "Slovak",
        "nation": ["Slovakia"]
    },
    {
        "color": "(255,255,0)",
        "code": "sl",
        "name": "Slovenian",
        "nation": ["Slovenia"]
    },
    {
        "color": "(255,255,0)",
        "code": "sv",
        "name": "Swedish",
        "nation": ["Sweden"]
    },
    {
        "color": "(255,255,0)",
        "code": "es",
        "name": "Spanish",
        "nation": ["Spain", "Mexico", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama", "Cuba", "Dominican Republic", "Puerto Rico", "Argentina", "Bolivia", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela", "Equatorial Guinea"]
    },
    {
        "color": "(255,255,0)",
        "code": "tg",
        "name": "Tajik",
        "nation": ["Tajikistan"]
    },
    {
        "color": "(255,255,0)",
        "code": "tr",
        "name": "Turkish",
        "nation": ["Turkey"]
    },
    {
        "color": "(255,255,0)",
        "code": "tk",
        "name": "Turkmen",
        "nation": ["Turkmenistan"]
    },
    {
        "color": "(255,255,0)",
        "code": "uk",
        "name": "Ukrainian",
        "nation": ["Ukraine"]
    },
    {
        "color": "(255,255,0)",
        "code": "uz",
        "name": "Uzbek",
        "nation": ["Uzbekistan"]
    },
    {
        "color": "(255,255,0)",
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
    */
// --- ASIA
    {
        "color": "(255,255,0)",
        "code": "bn",
        "name": "Bengali",
        "nation": ["Bangladesh"]
    },
    {
        "color": "(255,255,0)",
        "code": "zh-CN",
        "name": "Chinese (Simplified)",
        "nation": ["China"]
    },
    {
        "color": "(255,255,0)",
        "code": "zh-TW",
        "name": "Chinese (Traditional)",
        "nation": ["Hong Kong", "Taiwan", "Macau"]
    },
    {
        "color": "(255,255,0)",
        "code": "tl",
        "name": "Filipino",
        "nation": ["Philippines"]
    },
    {
        "color": "(255,255,0)",
        "code": "hi",
        "name": "Hindi",
        "nation": ["India"]
    },
    {
        "color": "(255,255,0)",
        "code": "id",
        "name": "Indonesian",
        "nation": ["Indonesia"]
    },
    {
        "color": "(255,255,0)",
        "code": "ja",
        "name": "Japanese",
        "nation": ["Japan"]
    },
    {
        "color": "(255,255,0)",
        "code": "km",
        "name": "Khmer",
        "nation": ["Cambodia"]
    },
    {
        "color": "(255,255,0)",
        "code": "ko",
        "name": "Korean",
        "nation": ["Korea"]
    },
    {
        "color": "(255,255,0)",
        "code": "lo",
        "name": "Lao",
        "nation": ["Laos"]
    },
    {
        "color": "(255,255,0)",
        "code": "ms",
        "name": "Malay",
        "nation": ["Malaysia"]
    },
    
    {
        "color": "(255,255,0)",
        "code": "mi",
        "name": "Maori",
        "nation": ["New Zealand"]
    },
    {
        "color": "(255,255,0)",
        "code": "mn",
        "name": "Mongolian",
        "nation": ["Mongolia"]
    },
    {
        "color": "(255,255,0)",
        "code": "my",
        "name": "Myanmar (Burmese)",
        "nation": ["Myanmar"]
    },
    {
        "color": "(255,255,0)",
        "code": "ne",
        "name": "Nepali",
        "nation": ["Nepal"]
    },
    {
        "color": "(255,255,0)",
        "code": "or",
        "name": "Odia (Oriya)",
        "nation": ["India"]
    },
    {
        "color": "(255,255,0)",
        "code": "sm",
        "name": "Samoan",
        "nation": ["Samoa"]
    },
    {
        "color": "(255,255,0)",
        "code": "pa",
        "name": "Punjabi",
        "nation": ["India"]
    },
    {
        "color": "(255,255,0)",
        "code": "sd",
        "name": "Sindhi",
        "nation": ["Samoa"]
    },
    {
        "color": "(255,255,0)",
        "code": "te",
        "name": "Telugu",
        "nation": ["India"]
    },
    {
        "color": "(255,255,0)",
        "code": "th",
        "name": "Thai",
        "nation": ["Thailand"]
    },
    {
        "color": "(255,255,0)",
        "code": "ur",
        "name": "Urdu",
        "nation": ["Pakistan"]
    },
    {
        "color": "(255,255,0)",
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
        "code": "si",
        "name": "Sinhala*",
        "nation": ["Pakistan"]
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
    */
    ]
}