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
}

