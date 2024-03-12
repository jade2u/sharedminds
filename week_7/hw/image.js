/* --- VARS ---*/
const IMAGE_WIDTH = 600;
const N_ARTWORKS = 100;
const randomInt = (top) => Math.floor(Math.random() * top) + 1;


/* --- GET ARTWORK W AIC API ---*/
const getRandomArtwork = async (
  seed,
  fields = ["id", "title", "artist_id", "artist_title", "image_id"]
) => {
  try {
    const queryParams = new URLSearchParams({ fields });
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?${queryParams.toString()}`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          size: 1,
          from: seed,
        }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result.data[0];
  } catch (error) {
    console.error("Error:", error);
  }
};

const infoJsonUrl = (image_id) =>
  `https://www.artic.edu/iiif/2/${image_id}/info.json`;
  const getImageUrls = async (image_id) => {
    // get full dimensions from info.json
    const { width, height } = await fetch(infoJsonUrl(image_id)).then((res) =>
      res.json()
    );
  /// SIZE
  /*
    const requestCoords = { x: 100, y: 100 };
    // figure out required square as pct
    if (width > height) {
      // landscape
      const ratio = width / height;
      const maxSide = idealSide / ratio;
      requestCoords["x"] = (maxSide / idealSide) * 100;
      requestCoords["y"] = 100;
    } else {
      // portrait
      const ratio = height / width;
      const maxSide = idealSide / ratio;
      requestCoords["x"] = 100;
      requestCoords["y"] = (maxSide / idealSide) * 100;
    }
    */
  
    return generateTileUrls(await fetch(infoJsonUrl(image_id)).then((res) =>
      res.json()
    ));
  };

/// SHOW
const displayTiles = async (image_id, n_tiles, width) => {
  document.documentElement.style.setProperty("--tiles", n_tiles);
  document.documentElement.style.setProperty("--width", width);
  const imageUrls = await getImageUrls(image_id, n_tiles);
  const puzzleEl = document.getElementById("puzzle");
  //imageUrls.forEach((src, i) => {
    const imageEl = document.createElement("img");
    imageEl.setAttribute("src", src);
    //imageEl.setAttribute("draggable", false);
    i//mageEl.setAttribute("data-solved-coord", indexToCoord(i, n_tiles));
    puzzleEl.appendChild(imageEl);
  //});
};

const initPuzzle = (seed, width) =>
  getRandomArtwork(seed)
    .then(async (data) => {
      //updateTitle(data.id, data.title, data.artist_id, data.artist_title);
      await displayTiles(data.image_id, width);
    })
    //.then(() => shuffle(n_tiles));
    
async function main() {
  await initPuzzle(randomInt(N_ARTWORKS), IMAGE_WIDTH);
}
main();