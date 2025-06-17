/* ---- AUTHORIZATION ----*/
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
const spotify_root = 'https://api.spotify.com/v1';

/* ---- DATA ORGANIZING ----*/
//update whenever button clicked
$("button").on('click', function() {
  $("#head-card").fadeOut("1000");
  $("#title-cards").fadeOut("1000");

  /// VARS
  //artists
  let artists_list = [];
  //genres
  let artists_genres = []; //initial genre list
  let genres_list = []; //organized list
  //tracks
  const tracks_list = []; //organized list
  let track_artist_ids = [];
  let track_pics = [];

  //svg lists
  let svg_nums = [
    //1
    "m44.3,0C19.84,0,0,19.84,0,44.3s19.84,44.3,44.3,44.3,44.3-19.84,44.3-44.3S68.77,0,44.3,0Zm11.13,73.81h-16.7V27.77h-10.96v-12.99h27.66v59.03Z",
    //2
    "m44.3,0C19.84,0,0,19.84,0,44.3s19.84,44.3,44.3,44.3,44.3-19.84,44.3-44.3S68.77,0,44.3,0Zm23.53,73.82H21.87v-10.54l22.01-20.58c1.63-1.46,2.81-2.77,3.54-3.92s1.22-2.18,1.48-3.08c.25-.9.38-1.77.38-2.61,0-1.86-.63-3.32-1.9-4.39-1.26-1.07-3.16-1.6-5.69-1.6-2.14,0-4.12.48-5.95,1.43-1.83.96-3.33,2.36-4.51,4.22l-12.4-6.83c2.14-3.71,5.29-6.69,9.45-8.94,4.16-2.25,9.13-3.37,14.93-3.37,4.55,0,8.54.75,11.97,2.24,3.43,1.49,6.11,3.56,8.05,6.2,1.94,2.64,2.91,5.82,2.91,9.53,0,1.86-.25,3.74-.76,5.65-.51,1.91-1.48,3.92-2.91,6.03s-3.56,4.46-6.37,7.04l-11.09,10.29h22.81v13.24Z",
    //3
    "m44.3,0C19.84,0,0,19.84,0,44.3s19.84,44.3,44.3,44.3,44.3-19.84,44.3-44.3S68.77,0,44.3,0Zm21.28,65.83c-1.83,3.01-4.62,5.45-8.39,7.34-3.77,1.88-8.63,2.83-14.59,2.83-4.1,0-8.21-.49-12.31-1.48-4.1-.98-7.62-2.43-10.54-4.34l5.99-12.48c2.36,1.52,4.99,2.7,7.88,3.54,2.89.84,5.72,1.27,8.48,1.27s5.14-.53,6.83-1.6c1.69-1.07,2.53-2.58,2.53-4.55,0-1.8-.7-3.21-2.11-4.22-1.41-1.01-3.71-1.52-6.92-1.52h-7v-10.46l10.49-11.38h-23.31v-12.99h42.75v10.54l-12.16,13.06c3.82.76,6.95,2.18,9.37,4.27,3.82,3.29,5.73,7.52,5.73,12.69,0,3.32-.91,6.48-2.74,9.49Z",
    //4
    "m44.3,0C19.84,0,0,19.84,0,44.3s19.84,44.3,44.3,44.3,44.3-19.84,44.3-44.3S68.77,0,44.3,0Zm27.01,62.51h-8.77v11.3h-16.28v-11.3H15.07v-10.79L41.55,14.78h17.37l-24.16,34.58h12.01v-10.12h15.77v10.12h8.77v13.16Z",
    //5
    "m44.3,0C19.84,0,0,19.84,0,44.3s19.84,44.3,44.3,44.3,44.3-19.84,44.3-44.3S68.77,0,44.3,0Zm20.91,64.67c-1.83,3.06-4.62,5.55-8.39,7.46-3.77,1.91-8.6,2.87-14.5,2.87-4.16,0-8.28-.49-12.35-1.48-4.08-.98-7.63-2.43-10.67-4.34l6.16-12.48c2.36,1.52,4.96,2.7,7.8,3.54,2.84.84,5.64,1.27,8.39,1.27s5.17-.53,6.92-1.6c1.74-1.07,2.61-2.61,2.61-4.64,0-1.18-.32-2.22-.97-3.12-.65-.9-1.81-1.6-3.5-2.11s-4.02-.76-7-.76h-16.02l2.95-34.49h37.61v12.99h-23.8l-.71,8.52h3.94c5.85,0,10.54.83,14.08,2.49,3.54,1.66,6.13,3.89,7.76,6.7,1.63,2.81,2.45,5.96,2.45,9.44s-.91,6.68-2.74,9.74Z"
  ];
  let genre_artist_svg = (
    "m78.86,30.74c-.98-.56-2.09-.84-3.34-.84s-2.37.28-3.36.84c-.99.56-1.78,1.37-2.38,2.42-.59,1.06-.89,2.34-.89,3.84s.3,2.75.89,3.84c.59,1.09,1.38,1.91,2.38,2.47.99.56,2.1.84,3.31.84,1.28,0,2.41-.28,3.38-.84.98-.56,1.76-1.38,2.35-2.47.59-1.09.89-2.37.89-3.84s-.3-2.78-.89-3.84c-.59-1.06-1.38-1.86-2.35-2.42Zm33.12,0c-.98-.56-2.09-.84-3.34-.84s-2.37.28-3.36.84c-.99.56-1.78,1.37-2.38,2.42-.59,1.06-.89,2.34-.89,3.84s.3,2.74.89,3.82c.59,1.07,1.38,1.9,2.38,2.47.99.58,2.11.86,3.36.86s2.36-.29,3.34-.86,1.76-1.4,2.35-2.47c.59-1.07.89-2.34.89-3.82s-.3-2.78-.89-3.84c-.59-1.06-1.38-1.86-2.35-2.42Zm38.98,6.07h10.65l-5.33-12.81-5.33,12.81ZM268.57,0H34.73C15.55,0,0,15.55,0,34.73s15.55,34.73,34.73,34.73h233.84c19.18,0,34.73-15.55,34.73-34.73S287.75,0,268.57,0ZM59.59,22.65h-10.75v27.26h-7.78v-27.26h-10.75v-6.34h29.28v6.34Zm28.27,21.22c-1.22,1.98-2.9,3.55-5.04,4.7-2.14,1.15-4.59,1.73-7.34,1.73s-5.14-.58-7.27-1.73c-2.13-1.15-3.8-2.73-5.02-4.73-1.22-2-1.82-4.28-1.82-6.84s.61-4.89,1.82-6.89c1.22-2,2.89-3.57,5.02-4.7,2.13-1.14,4.55-1.7,7.27-1.7s5.2.57,7.34,1.7c2.14,1.14,3.82,2.7,5.04,4.7,1.22,2,1.82,4.3,1.82,6.89s-.61,4.88-1.82,6.86Zm33.24.17c-1.14,1.97-2.67,3.5-4.61,4.61-1.94,1.1-4.14,1.66-6.6,1.66-2.14,0-4.03-.48-5.66-1.44-.77-.45-1.45-1.03-2.06-1.71v12.07h-7.49V24.09h7.15v3.01c.65-.79,1.41-1.44,2.28-1.95,1.65-.96,3.58-1.44,5.78-1.44,2.46,0,4.66.55,6.6,1.66,1.94,1.1,3.47,2.65,4.61,4.63,1.14,1.98,1.7,4.32,1.7,7.01s-.57,5.06-1.7,7.03Zm45.96,5.88l-2.99-7.2h-15.56l-2.99,7.2h-7.97l14.93-33.6h7.68l15.07,33.6h-8.16Zm27.17-19.25c-.29-.06-.57-.11-.84-.14-.27-.03-.54-.05-.79-.05-2.11,0-3.79.59-5.04,1.78-1.25,1.18-1.87,3.01-1.87,5.47v12.19h-7.49v-25.82h7.15v3.44c.71-.98,1.59-1.79,2.69-2.4,1.7-.94,3.76-1.42,6.19-1.42v6.96Zm18.55,19.22c-1.07.27-2.18.41-3.34.41-3.04,0-5.41-.78-7.1-2.33-1.7-1.55-2.54-3.86-2.54-6.94v-10.61h-3.98v-5.76h3.98v-6.29h7.54v6.29h6.38v5.76h-6.38v10.46c0,1.09.28,1.94.84,2.54.56.61,1.32.91,2.28.91,1.22,0,2.24-.32,3.07-.96l1.97,5.28c-.74.54-1.64.95-2.71,1.22Zm14.52.02h-7.49v-25.82h7.49v25.82Zm-.34-30.65c-.86.82-2,1.22-3.41,1.22s-2.54-.4-3.41-1.2-1.3-1.79-1.3-2.98.43-2.18,1.3-2.98c.86-.8,2-1.2,3.41-1.2s2.5.38,3.38,1.13c.88.75,1.32,1.72,1.32,2.9,0,1.25-.43,2.28-1.3,3.1Zm26.74,27.07c-.96,1.23-2.34,2.2-4.15,2.9-1.81.7-4.01,1.06-6.6,1.06-2.21,0-4.32-.26-6.34-.79-2.02-.53-3.63-1.19-4.85-1.99l2.45-5.33c1.22.7,2.63,1.29,4.25,1.75,1.62.46,3.21.7,4.78.7,1.73,0,2.95-.21,3.67-.62.72-.42,1.08-.99,1.08-1.73,0-.61-.28-1.06-.84-1.37-.56-.3-1.3-.54-2.21-.7-.91-.16-1.93-.32-3.05-.48s-2.23-.38-3.34-.67c-1.1-.29-2.13-.7-3.07-1.22-.94-.53-1.7-1.25-2.26-2.18-.56-.93-.84-2.13-.84-3.6,0-1.63.48-3.08,1.44-4.34.96-1.26,2.32-2.25,4.08-2.95,1.76-.7,3.89-1.06,6.38-1.06,1.79,0,3.59.2,5.4.6,1.81.4,3.34.95,4.58,1.66l-2.54,5.33c-1.22-.7-2.46-1.2-3.72-1.49-1.26-.29-2.47-.43-3.62-.43-1.73,0-2.98.22-3.74.67-.77.45-1.15,1.02-1.15,1.73,0,.64.29,1.13.86,1.46s1.33.58,2.26.74,1.95.32,3.07.48,2.22.38,3.31.67c1.09.29,2.1.7,3.05,1.22.94.53,1.7,1.26,2.26,2.18.56.93.84,2.13.84,3.6,0,1.57-.48,2.97-1.44,4.2Zm19.89,3.55c-1.07.27-2.18.41-3.34.41-3.04,0-5.41-.78-7.1-2.33-1.7-1.55-2.54-3.86-2.54-6.94v-10.61h-3.98v-5.76h3.98v-6.29h7.54v6.29h6.38v5.76h-6.38v10.46c0,1.09.28,1.94.84,2.54.56.61,1.32.91,2.28.91,1.22,0,2.24-.32,3.07-.96l1.97,5.28c-.74.54-1.64.95-2.71,1.22Z"
  );
  
  /// CLEAR CARDS
  clearCards();

  /// BUTTONS
  let btn_type = this.parentNode.getAttribute("class");
  //update selected time button
  if(btn_type == "time"){
    $("button").removeClass('time_selected');
    $(this).addClass('time_selected')
  }
  //update selected data button
  if(btn_type == "data"){
    $('button').removeClass('data_selected');
    $(this).addClass('data_selected');
  }

$.ajax({
  url: spotify_root + '/me/top/artists?time_range=' + time_class + '_term&limit=5',
  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
  success: function(data) { 
    data.items.map(function(artist) {
      //add to initial list
      artists_genres.push(artist_genre);
      //organize in final list
      for(var i = 0; i<artist.genres.length; i++){
        genres_list.push(
          {"genre" : artist.genres[i],
          "artist" : artist.name,
          "pic" : artist.images[0].url}
          );
      }

      //artist list
      var artist_genre = artist.genres[0]; //only get 1st genre
      artists_list.push(
        {"genre" : artist_genre,
        "artist" : artist.name,
        "pic" : artist.images[0].url}
      );
      
    });

/// TOP ARTISTS
    if(artists_list.length >= 5 && data_class == "artists"){
      //create cards
      for(var i = 0; i < artists_list.length; i++){
        headCard('artists', "<li>" + artists_list[i].artist + "</li>", artists_list[0].genre);
        new_card(
          //ranking number
          "<svg class='num-place' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88.61 95.66'><path d='" + svg_nums[i] + "' /></svg>" +
          //artist name
          "<h1>" + artists_list[i].artist + "</h1>", 
          artists_list[i].genre, 
          artists_list.length,
          artists_list[i].pic,
          artists_list[i].artist
        );
      }
    }

/// TOP GENRES
    //update list w/o duplicate genres
    genres_list = genres_list.reduce((accumulator, current) => {
      if (!accumulator.find((item) => item.genre === current.genre)) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
    //return top 5
    genres_list = genres_list.slice(0,5);

    if(data_class == "genres"){
      //create cards
      for(var i = 0; i < genres_list.length; i++){
        headCard('genres', "<li>" + genres_list[i].genre + "</li>", genres_list[0].genre);
        new_card(
          //rank number
          "<svg class='num-place' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88.61 95.66'><path d='" + svg_nums[i] + "' /></svg>" +
          //genre
          "<h1>" + genres_list[i].genre + "</h1>" +
          //top artist svg
          "<svg class='top-artist' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 303.3 69.46'><path d='" + genre_artist_svg + "' /></svg>" + 
          //artist name
          "<h5>" + genres_list[i].artist + "</h5>", 
          genres_list[i].genre, 
          genres_list.length,
          genres_list[i].pic,
          genres_list[i].artist
        );
      }
    }
 
  }
});

/// TOP TRACKS
if(data_class == "tracks"){
    $.ajax({
      url: spotify_root + '/me/top/tracks?time_range=' + time_class + '_term&limit=5',
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
      success: function(data) {
        data.items.map(function(track) {
          //duration conversion
          let millis = track.duration_ms;
          var minutes = Math.floor(millis / 60000);
          var seconds = ((millis % 60000) / 1000).toFixed(0);
          let track_time =  minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          //artist
          let track_artist = track.artists.map((_artist) => _artist.name).join(', ');
          //artist id
          let track_artist_id = track.artists[0].id;
          track_artist_ids.push(track_artist_id);
          //album pic
          let track_pic = track.album.images[0].url;
          track_pics.push(track_pic);

          //organize in list
          tracks_list.push(
            {"song" : track.name,
            "artist" : track_artist,
            "length" : track_time,
            "pic" : track.album.images[0].url}
            );
        
          //when all tracks pulled
          if(tracks_list.length >= 5){
            $.ajax({ 
              //get 1st artist id
              url: spotify_root + '/artists/?ids=' + track_artist_ids[0],
              type: "GET",
              beforeSend: function(xhr){
                  xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
              success: function(data) {
                data.artists.forEach(artist => {
                  //get 1st artist genre
                  let track_genre = artist.genres[0].toString();
                  //make cards
                  for(var i = 0; i < tracks_list.length; i++){
                    headCard('tracks', 
                    "<svg class='num-place' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88.61 95.66'><path d='" + svg_nums[i] + "' /></svg>" + "<li>" + tracks_list[i].song + "</li>", 
                    track_genre)
                    new_card(
                      //ranking number
                      "<svg class='num-place' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88.61 95.66'><path d='" + svg_nums[i] + "' /></svg>" +
                      //song length
                      "<h1>" + tracks_list[i].length + "</h1>" +
                      //song name
                      "<h4>" + tracks_list[i].song + "</h4>"  +
                      //artist name
                      "<h5>" + tracks_list[i].artist + "</h5>", 
                      track_genre, 
                      tracks_list.length,
                      tracks_list[i].pic,
                      tracks_list[i].song + " by " + tracks_list[i].artist
                    ); 
                  }
                })
              }
            });
          }
        });
      }
    }) 
 }
  
})  