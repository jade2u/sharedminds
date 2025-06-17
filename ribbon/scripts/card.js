/* VARS */
const list_items = document.getElementsByClassName('list-items'); 
const title_cards = document.getElementsByClassName('title-card'); 


/* ---- HEAD CARDS ----*/
function headCard(name, list, genre){
    //VARS
    let head_card = document.querySelector('ol').parentNode; //head card
    let ol = document.querySelector("ol"); //head card text
    let body = document.querySelector('body'); //body
    let buttons = document.querySelectorAll("button"); //buttons
    let section = document.getElementById('title-cards'); //all title cards

    ol.setAttribute('id', name.toString() + "-list"); //set list id
    section.setAttribute('class', name.toString() + "-cards"); //set class

    //MAKE LIST ITEMS
    var new_div = document.createElement("div"); //new div
    
    new_div.innerHTML = list; //add list to div
    new_div.setAttribute('class', 'list-items'); //change div class
    ol.appendChild(new_div); // nest div in ol
    
    //CHANGE STYLE (only for artist & genre)
    if((data_class == "artists") || (data_class == "genres")){
        //call function
        findStyle(genre);
        //basics
        head_card.style.color = font_color; 
        head_card.style.backgroundColor = card_color; 
        head_card.style.fontFamily = font_type;

        //bg
        var body_color = adjustHSLAColor(card_color, 1, 1.6, 1.3, 1);
        body.style.backgroundColor = body_color;
    
        //li
        var list_item = new_div.querySelector('li');
        if(data_class == "artists"){
            list_item.style.background = 'linear-gradient(to right, ' + body_color + ', hsla(0, 0%, 0%, 0.0)';
        }
        if(data_class == "genres"){
            list_item.style.backgroundColor = body_color;
        }
    }
    
    //CHANGE BUTTON COLOR
    for(var i=0; i < buttons.length; i++){
        let btn_class = buttons[i].getAttribute("class");
        //if selected button
        if((btn_class == "time_selected") || (btn_class == "data_selected")){
            //change color
            buttons[i].style.color = body_color;
        }
        //else change back to white
        else{ buttons[i].style.color = "white";}
    } 

    //$("#head-card").fadeIn("slow");
  
}


/* ---- NEW CARDS ----*/
function new_card(content, genre, card_num, pic_id, alt){
    //only top 5
    if(title_cards.length <= card_num){
        //MAKE NEW CARDS
        const old_section = document.getElementById('title-cards'); //div w/ all title cards
        var new_section = document.createElement("section"); //new card
        new_section.innerHTML = content; //change content
        old_section.appendChild(new_section) // nest in container
        new_section.setAttribute('class', 'title-card'); //put all title cards in same class
        document.body.insertAdjacentElement("beforeend", old_section); //show new card after the last  

        //IMAGE
        let img = document.createElement("img"); //create img
        img.setAttribute("src", pic_id); //link source
        //track color picker while img.complete
        if(data_class == "tracks"){
            trackColor(img);
        }
        img.setAttribute("class", "card-img"); //set class
        img.setAttribute("alt", alt); //alt text
        new_section.appendChild(img); //add to card

        //CHANGE STYLE (only for artist & genre)
        if((data_class == "artists") || (data_class == "genres")){
            //call function
            findStyle(genre);
            //basics
            new_section.style.fontFamily = font_type;
            new_section.style.color = font_color; 
            new_section.querySelector('.num-place').style.fill = font_color; //num svg

            //details
            var heading = new_section.querySelector('h1'); //title
            var h5 = new_section.querySelector('h5'); //name
            if(data_class == "artists"){
                new_section.style.background = 'radial-gradient(closest-side,' + gradient_color + ',' + card_color + ')';  //bg
                heading.style.background = 'linear-gradient(to left, ' + heading_gradient_color + ', hsla(0, 0%, 0%, 0.0)'; //heading
            } 
            if(data_class == "genres"){
                new_section.style.background = 'radial-gradient(closest-side,' + gradient_color + ',' + card_color + ')'; //bg
                heading.style.background = 'linear-gradient(to right, ' + heading_gradient_color + ', hsla(0, 0%, 100%, 0.0)'; //heading
                new_section.querySelector('.top-artist').style.fill = font_color; //artist svg
                h5.style.background = 'linear-gradient(to right, ' + heading_gradient_color + ', hsla(0, 0%, 100%, 0.0)'; //artist name
            } 
        }
    }
    //$("#title-cards").fadeIn("slow");
}


/* ---- DELETING CARDS ----*/
function clearCards(){
    
    //if there are still title cards or list items
    while((title_cards.length - 1) > 0 || (list_items.length) > 0){ 
        title_cards[0].parentNode.removeChild(title_cards[0]); //delete cards 
        list_items[0].parentNode.removeChild(list_items[0]); //delete list items
    }
    //clear all lists
    card_colors.length = 0;
    font_colors.length = 0;
    font_types.length = 0;
}
