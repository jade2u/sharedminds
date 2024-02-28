export function siteRedirect() {
    var selectbox = document.getElementById("country");
    var selectedValue = selectbox.options[selectbox.selectedIndex].value;
    console.log(selectedValue);
    window.location.href = "index.html";

    if(window.location.href == "index.html"){
        console.log(selectedValue);
    }
  }