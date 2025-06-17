/* ---- AUTHORIZATION ----*/
// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '179a5550a6d24c7cbce8c0e88c443be4';
const redirectUri = 'https://jade2u.github.io/portfolio/select/ribbon/home.html';
const scopes = [
  'user-top-read'
];


/// NOT LOGGED IN
if(!_token){
  //click button 
  let btn = document.querySelector("button");
  btn.addEventListener("click", login);

  //redirect to spotify authorization
  function login(){
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    //console.log("logging in");
  }
}


/// ALREADY LOGGED IN
else { 
  window.location = 'home.html';
  //console.log("logged in");
};



