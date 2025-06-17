/* Setting the variables when buttons are clicked */
var time_class;
var data_class;
// TIME
$('.time>button').on('click', function() {
    //set time
    time_class = this.id.toString();
    //change header
    $("h2").text(this.textContent);
})
//CATEGORY
//when category button clicked
$('.data>button').on('click', function(){
    //set category
    data_class = this.id.toString();
    //change header
    $("h1").text("Top " + this.textContent);
})
