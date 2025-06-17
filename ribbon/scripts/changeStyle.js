/* ---- VARS ----*/
//GENRE VARS
var card_color, gradient_color, heading_gradient_color;
var font_type, font_color;

let card_colors = [];
let font_colors = [];
let font_types = [];

//TRACK COLOR VARS
var dom_hue, dom_lightness, dom_color;
let opposite_color, accent_color;
const track_colors = []; //all colors

//RGB TO HSL VARS
var hue, saturation, lightness, alpha;



/* ---- GENRE COLORS ----*/
function findStyle(genre) {
    //get array
    var genreColorsArray = genreColors["genre-colors"];

    //go through whole array
    for (var i = 0; i < genreColorsArray.length; i++) {
        var genresArray = genreColorsArray[i].genre;
        //return vars
        if (genresArray && genresArray.includes(genre)) {
            card_color = genreColorsArray[i].color;
            gradient_color = adjustHSLAColor(genreColorsArray[i].color, 2, 1.3, 1.5, 1);
            font_color = genreColorsArray[i].font_color;
            font_type = genreColorsArray[i].font_type;
            heading_gradient_color = adjustHSLAColor(genreColorsArray[i].font_color, 0.5, 2, 1.7, 1);
        }
    } 
}


/* ----- TRACK COLORS ----  */
function trackColor(image){
    //set origin
    const img = image;
    img.crossOrigin = 'Anonymous'; 

    /// VARS
    //general
    var body = document.querySelector('body'); //body
    var buttons = document.querySelectorAll("button"); //buttons
    
    //head cards
    var head_card = document.getElementById("head-card"); //head card
    var head_svgs = head_card.querySelectorAll('svg');  //head card svgs
    const last_head_svg = head_svgs[head_svgs.length - 1]; //last head card svg
    var head_li = head_card.querySelectorAll('li'); //head card li
    const last_head_li = head_li[head_li.length - 1]; //last head card li
    //title cards
    var title_cards = document.querySelectorAll('.title-card'); // individual title cards
    const last_title_card = title_cards[title_cards.length - 1]; //last title card
    const title_svg = last_title_card.querySelector('svg'); //title card svg
    
    /// CALL FUNCTIONS
    img.addEventListener('load', function() {
        getDominantColor(img);
        getCommonColors(img);

        //add colors to list
        track_colors.push({
            "card" : dom_color,
            "opposite" : opposite_color,
            "accent" : accent_color
        })

        /// CHANGE STYLES
        //bg
        let track_body_color = adjustHSLAColor(track_colors[0].card, 1, 1.6, 1.3, 1)
        body.style.backgroundColor = track_body_color;

        //head cards
        head_card.style.backgroundColor = track_colors[0].card; //card
        head_card.style.color = track_colors[0].opposite; //font
        last_head_svg.style.fill = track_colors[0].accent; //svg
        last_head_li.style.background = 'linear-gradient(to right, ' + adjustHSLAColor(track_colors[0].accent, 1, 1, 1, 2) + ', hsla(0, 0%, 0%, 0.0)'; //li

        //title cards
        last_title_card.style.backgroundColor = dom_color; //card
        last_title_card.style.color = accent_color; //font
        title_svg.style.fill = opposite_color; //svg

        //CHANGE BUTTON COLOR
        for(var i=0; i < buttons.length; i++){
            let btn_class = buttons[i].getAttribute("class");
            //if selected button
            if((btn_class == "time_selected") || (btn_class == "data_selected")){
                //change color
                buttons[i].style.color = track_body_color;
            }
            //else change back to white
            else{ buttons[i].style.color = "white";}
        }
    });
    track_colors.length = 0; //reset color list
}
 


/* ----- DOM COLOR ----  */
function getDominantColor(img){
    //call functions
    const dominantRGB = new ColorThief().getColor(img);
    RGBToHSL(dominantRGB[0], dominantRGB[1], dominantRGB[2]);
    //set color vars
    dom_hue = hue;
    dom_color =  'hsla(' + hue + ',' + saturation + '%,' + lightness + '%,' + alpha + ')';
}


/* ----- COMMON COLORS ----  */
function getCommonColors(img){
    //vars
    const commonRGBs = new ColorThief().getPalette(img); 
    const common_hues = []; 

    //go thru all colors
    for(let i = 0;i < commonRGBs.length; i++){
        //get hsl values
        RGBToHSL(commonRGBs[i][0], commonRGBs[i][1], commonRGBs[i][2]);
        //push to list
        common_hues.push({
            "color" : 'hsla(' + hue + ',' + saturation + '%,' + lightness + '%,' + alpha + ')',
            "hue_diff" : Math.abs(hue - (dom_hue/2)), //for opposite color
            "saturation": saturation //for accent color
        })
    }

    //color closest to dom's complementary color
    opposite_color = Math.min(...common_hues.map(item => item.hue_diff));
    //most saturated color
    accent_color = Math.max(...common_hues.map(item => item.saturation));

    //get hue's index
    let opposite_index = common_hues.map(function(e) { return e.hue_diff; }).indexOf(opposite_color);
    let accent_index = common_hues.map(function(e) { return e.saturation; }).indexOf(accent_color);
    //update colors
    opposite_color = common_hues[opposite_index].color;
    accent_color = common_hues[accent_index].color;
}


/* ----- RGB TO HSL ----  */
function RGBToHSL(r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;

    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
        : 0;

    hue = Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h);
    saturation = Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0));
    lightness = Math.round((100 * (2 * l - s)) / 2);
    alpha = "1.0";
};


/* ---- ADJUST HSLA ----*/
function adjustHSLAColor(hslaColor, adjustHue, adjustSaturation, adjustLightness, adjustAlpha) {
    // Parse the input HSLA color string
    var match = hslaColor.match(/^hsla\((\d+),\s*(\d+%)\s*,\s*(\d+%)\s*,\s*(\d*\.?\d+)\)$/);

    if (!match) {
        // Invalid color format
        console.log("no match for: " + hslaColor);
        //console.log("no match");
        return 'hsl(141, 73%, 30%)';
    }

    // Extract HSL values and alpha
    var old_hue = parseInt(match[1], 10);
    var old_saturation = parseInt(match[2], 10);
    var old_lightness = parseInt(match[3], 10);
    var old_alpha = parseFloat(match[4]);

    // Adjust values
    var adjustedHue = old_hue / adjustHue;
    var adjustedSaturation = old_saturation / adjustSaturation;
    var adjustedLightness = old_lightness / adjustLightness;
    var adjustedAlpha = old_alpha / adjustAlpha;

    // Return the adjusted color in HSLA format
    return 'hsla(' + adjustedHue + ',' + adjustedSaturation + '%,' + adjustedLightness + '%,' + adjustedAlpha + ')';
}



  