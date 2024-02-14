// Get the input box and the canvas element
const inputBox = document.getElementById('inputBox');
const canvas = document.getElementById('myCanvas');
let input_values = [];
let rows = [];
let rect_x = 0;
let rect_y = 0;
let random_color;
let space_num = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Add event listener to the input box
inputBox.addEventListener('keydown', function (event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        //input box
        const inputValue = inputBox.value;
        const ctx = canvas.getContext('2d');
        const inputBoxRect = inputBox.getBoundingClientRect();
        const x = inputBoxRect.left;
        const y = inputBoxRect.top;
        const inputLength = inputValue.length;

        //get a random color depending on length & word count
        random_color = Math.floor(Math.random() * (inputLength * space_num));
        console.log(random_color);

        // NEW SQUARE
        input_values.push(inputValue);
        //set position depending on num
        rect_y = 100 * rows.length;
        rect_x = 100 * input_values.length;
        //draw rect
        ctx.fillStyle = 'hsl(' + random_color + ', 100%, 50%)';
        ctx.fillRect(rect_x, rect_y, 100, 100)
        //new row when overflow
        if(rect_x > (window.innerWidth - 200)){
            rows +=1;
            input_values.length = 0;
        }

        //reset input box
        inputBox.value = '';
    }
});

// Add event listener to the document for mouse down event
document.addEventListener('mousedown', (event) => {
    // Set the location of the input box to the mouse location
    inputBox.style.left = event.clientX + 'px';
    inputBox.style.top = event.clientY + 'px';

});
document.addEventListener('keyup', (event) => {
    // Set the location of the input box to the mouse location
    if (event.code === 'Space') {
        space_num++;
      }

});
