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

export function matchLanguage(pos){
    //console.log(pos);
    let new_lang;
    
    /*
    ///S AM
    //spanish
    if((pos.x<3.4 && pos.x>-5.6) && (pos.y<4.8 && pos.y>-5.52)){
        //portugese
        if(pos.x<-1.78 && (pos.y<0.57 && pos.y>-3.54)){new_lang = "pt";}
        else {new_lang = "es"};
    }
    
    /// N AM
    //english
    if((pos.x<3 && pos.x>-2) && (pos.y<8 && pos.y>3.2)){new_lang = "en";}
    //hawaiian
    if((pos.x<5.6 && pos.x>5) && (pos.y<2.4 && pos.y>2.1)){new_lang = "haw";} 

    /// ASIA
    //japanese
    if((pos.x<4 && pos.x>3) && (pos.y<4.5 && pos.y>3)){new_lang = "ja";}

    
    return new_lang;
    */
}

var language = {
    "description": "",
    "languages": [
// --- AFRICA
    {
        "code": "af",
        "name": "Afrikaans",
        "nation": ["South Africa"]
    },
    {
        "code": "am",
        "name": "Amharic",
        "nation": ["Ethiopia"]
    },
    {
        "code": "ar",
        "name": "Arabic",
        "nation": ["Algeria", "Bahrain", "Egypt", "Iraq", "Jordan", "Kuwait", "Lebanon", "Libya", "Mauritania", "Morocco", "Oman", "Palestine", "Qatar", "Saudi Arabia", "Sudan", "Syria", "Tunisia", "UAE", "Yemen"]
    },
    {
        "code": "ny",
        "name": "Chichewa",
        "nation": ["Malawi"]
    },
    {
        "code": "mg",
        "name": "Madagascar"
    },
    {
        "code": "ha",
        "name": "Hausa",
        "nation": ["Nigeria", "Niger"]
    },
    {
        "code": "rw",
        "name": "Kinyarwanda",
        "nation": ["Rwanda"]
    },
    {
        "code": "ps",
        "name": "Pashto",
        "nation": ["Afghanistan"]
    },
    {
        "code": "fa",
        "name": "Persian",
        "nation": ["Iran"]
    },
    {
        "code": "st",
        "name": "Sesotho",
        "nation": ["Lesotho"]
    },
    {
        "code": "sn",
        "name": "Shona",
        "nation": ["Zimbabwe"]
    },
    {
        "code": "so",
        "name": "Somali",
        "nation": ["Somalia"]
    },
    {
        "code": "sw",
        "name": "Swahili",
        "nation": ["Tanzania", "Kenya", "Uganda", "DRC"]
    },
    {
        "code": "zu",
        "name": "Zulu",
        "nation": ["South Africa"]
    },
    /* --- non-dominant
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
        "code": "en",
        "name": "English",
        "nation": ["US", "Canada", "Singapore", "UK", "Jamaica", "Barbados", "Trinidad", "Bahamas", "Guyana", "Fiji", "Tonga", "Solomon", "Micronesia", "Vanuatu", "Kiribati", "Cameroon", "Ghana", "Botswana"]
    },
    {
        "code": "ht",
        "name": "Haitian Creole",
        "nation": ["Haiti"]
    },
    {
        "code": "haw",
        "name": "Hawaiian",
        "nation": ["Hawaii"]
    },
// --- EUROPE
    {
        "code": "sq",
        "name": "Albanian",
        "nation": ["Albania"]
    },
    {
        "code": "hy",
        "name": "Armenian",
        "nation": ["Armenia"]
    },
    {
        "code": "az",
        "name": "Azerbaijani",
        "nation": ["Azerbaijan"]
    },
    {
        "code": "be",
        "name": "Belarusian",
        "nation": ["Belarus"]
    },
    {
        "code": "bs",
        "name": "Bosnian",
        "nation": ["Bosnia"]
    },
    {
        "code": "bg",
        "name": "Bulgarian",
        "nation": ["Bulgaria"]
    },
    {
        "code": "ca",
        "name": "Catalan",
        "nation": ["Andorra"]
    },
    {
        "code": "hr",
        "name": "Croatian",
        "nation": ["Croatia"]
    },
    {
        "code": "cs",
        "name": "Czech",
        "nation": ["Czechia"]
    },
    {
        "code": "da",
        "name": "Danish",
        "nation": ["Denmark"]
    },
    {
        "code": "nl",
        "name": "Dutch",
        "nation": ["Netherlands"]
    },
    {
        "code": "et",
        "name": "Estonian",
        "nation": ["Estonia"]
    },
    {
        "code": "fi",
        "name": "Finnish",
        "nation": ["Finland"]
    },
    {
        "code": "fr",
        "name": "French",
        "nation": ["Benin", "Congo", "DRC", "Ivory Coast", "France", "Gabon", "Guinea", "Monaco", "Senegal", "Togo"]
    },
    {
        "code": "ka",
        "name": "Georgian",
        "nation": ["Georgia"]
    },
    {
        "code": "de",
        "name": "German",
        "nation": ["Germany", "Austria", "Belgium", "Luxembourg"]
    },
    {
        "code": "el",
        "name": "Greek",
        "nation": ["Greece", "Cyprus"]
    },
    {
        "code": "iw",
        "name": "Hebrew",
        "nation": ["Israel"]
    },
    {
        "code": "hu",
        "name": "Hungarian",
        "nation": ["Hungary"]
    },
    {
        "code": "is",
        "name": "Icelandic",
        "nation": ["Iceland"]
    },
    {
        "code": "ga",
        "name": "Irish",
        "nation": ["Ireland"]
    },
    {
        "code": "it",
        "name": "Italian",
        "nation": ["Italy", "San Marino"]
    },
    {
        "code": "kk",
        "name": "Kazakh",
        "nation": ["Kazazkhstan"]
    },
    {
        "code": "ky",
        "name": "Kyrgyz",
        "nation": ["Kyrgyzstan"]
    },
    {
        "code": "lv",
        "name": "Latvian",
        "nation": ["Latvia"]
    },
    {
        "code": "lt",
        "name": "Lithuanian",
        "nation": ["Lithuania"]
    },
    {
        "code": "lb",
        "name": "Luxembourgish*",
        "nation": ["Luxembourg"]
    },
    {
        "code": "mk",
        "name": "Macedonian",
        "nation": ["Macedonia"]
    },
    {
        "code": "mt",
        "name": "Maltese",
        "nation": ["Malta"]
    },
    {
        "code": "pl",
        "name": "Polish",
        "nation": ["Poland"]
    },
    {
        "code": "no",
        "name": "Norwegian",
        "nation": ["Norway"]
    },
    {
        "code": "pt",
        "name": "Portuguese*",
        "nation": ["Portugal", "Brazil", "Angola", "Cabo Verde", "Guinea-Bissau", "Mozambique", "Sao Tome", "East Timor"]
    },
    {
        "code": "ro",
        "name": "Romanian",
        "nation": ["Romania"]
    },
    {
        "code": "ru",
        "name": "Russian",
        "nation": ["Russia"]
    },
    {
        "code": "gd",
        "name": "Scots Gaelic",
        "nation": ["Scotland"]
    },
    {
        "code": "sr",
        "name": "Serbian",
        "nation": ["Serbia"]
    },
    {
        "code": "sk",
        "name": "Slovak",
        "nation": ["Slovakia"]
    },
    {
        "code": "sl",
        "name": "Slovenian",
        "nation": ["Slovenia"]
    },
    {
        "code": "sv",
        "name": "Swedish",
        "nation": ["Sweden"]
    },
    {
        "code": "es",
        "name": "Spanish",
        "nation": ["Spain", "Mexico", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama", "Cuba", "Dominican Republic", "Puerto Rico", "Argentina", "Bolivia", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela", "Equatorial Guinea"]
    },
    {
        "code": "tg",
        "name": "Tajik",
        "nation": ["Tajikistan"]
    },
    {
        "code": "tr",
        "name": "Turkish",
        "nation": ["Turkey"]
    },
    {
        "code": "tk",
        "name": "Turkmen",
        "nation": ["Turkmenistan"]
    },
    {
        "code": "uk",
        "name": "Ukrainian",
        "nation": ["Ukraine"]
    },
    {
        "code": "uz",
        "name": "Uzbek",
        "nation": ["Uzbekistan"]
    },
    {
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
        "code": "bn",
        "name": "Bengali",
        "nation": ["Bangladesh"]
    },
    {
        "code": "zh-CN",
        "name": "Chinese (Simplified)",
        "nation": ["China"]
    },
    {
        "code": "zh-TW",
        "name": "Chinese (Traditional)",
        "nation": ["Hong Kong", "Taiwan", "Macau"]
    },
    {
        "code": "tl",
        "name": "Filipino",
        "nation": ["Philippines"]
    },
    {
        "code": "hi",
        "name": "Hindi",
        "nation": ["India"]
    },
    {
        "code": "id",
        "name": "Indonesian",
        "nation": ["Indonesia"]
    },
    {
        "code": "ja",
        "name": "Japanese",
        "nation": ["Japan"]
    },
    {
        "code": "km",
        "name": "Khmer",
        "nation": ["Cambodia"]
    },
    {
        "code": "ko",
        "name": "Korean",
        "nation": ["Korea"]
    },
    {
        "code": "lo",
        "name": "Lao",
        "nation": ["Laos"]
    },
    {
        "code": "ms",
        "name": "Malay",
        "nation": ["Malaysia"]
    },
    
    {
        "code": "mi",
        "name": "Maori",
        "nation": ["New Zealand"]
    },
    {
        "code": "mn",
        "name": "Mongolian",
        "nation": ["Mongolia"]
    },
    {
        "code": "my",
        "name": "Myanmar (Burmese)",
        "nation": ["Myanmar"]
    },
    {
        "code": "ne",
        "name": "Nepali",
        "nation": ["Nepal"]
    },
    {
        "code": "or",
        "name": "Odia (Oriya)",
        "nation": ["India"]
    },
    {
        "code": "sm",
        "name": "Samoan",
        "nation": ["Samoa"]
    },
    {
        "code": "pa",
        "name": "Punjabi",
        "nation": ["India"]
    },
    {
        "code": "sd",
        "name": "Sindhi",
        "nation": ["Samoa"]
    },
    {
        "code": "te",
        "name": "Telugu",
        "nation": ["India"]
    },
    {
        "code": "th",
        "name": "Thai",
        "nation": ["Thailand"]
    },
    {
        "code": "ur",
        "name": "Urdu",
        "nation": ["Pakistan"]
    },
    {
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