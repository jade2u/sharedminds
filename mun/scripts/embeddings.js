
async function search(search){
    const url = 'https://youtube-v2.p.rapidapi.com/search/?query=' + search;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '22e6a8f89fmshf805719fefbd862p1d3f2fjsn27884eb9fc89',
            'X-RapidAPI-Host': 'youtube-v2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        let video_id = result.videos[0].video_id;
        if(video_id != undefined){download(video_id);}
    } catch (error) {
        console.error(error);
    }
}


/* --- API --- */
export async function askForWords() {
    //ask
    const replicateProxy = "https://replicate-api-proxy.glitch.me"
    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            //change prompt a-z, add set json set
            prompt: "What are 5 well-known pop-songs?",
            system_prompt: "Give the response directly with no  introductory or explanatory sentences. Provide the answers as an un-numbered list.",
            max_tokens: 100000,
            max_length: 100000,
        },
    };
    //get answer
    console.log("Asking for Words", data);
    let url = replicateProxy + "/create_n_get/";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    //turn answer into json
    const words_response = await fetch(url, options);
    const proxy_said = await words_response.json();
    //turn answer into embedding
    if (proxy_said.output.length == 0) {console.log("Something went wrong, try it again");} 
    else {
        let reply = proxy_said.output.join("");
        let reply_arr = reply.split("\n* ")
        reply_arr.shift();
        return reply_arr;
    }
}

