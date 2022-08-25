"use strict";

/*****  There are two set of codes for this exercise. One in JQuery and one in Javascript. ******/


const showsList = $("#shows-list");
const episodesArea = $("#episodes-area");
const searchForm = $("#search-form");
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */



async function getShowsByTerm(query) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  console.log(res);
  console.log(res.data);
  
  // res.data will have an array of objects (which are tv shows) with possible results based on the search query. Use map to itererate through each show and get the id, name, summary and image
  // let shows = res.data.map(result => {
  //   let show = result.show;
  //   return {
  //     id: show.id,
  //     name: show.name,
  //     summary: show.summary,
  //     image: show.image ? show.image.medium : MISSING_IMAGE_URL,
  //   };
  // });
  // console.log(shows);
  // return shows;


  /****** Without using map ******/
  let shows = res.data;
  let listShowsObj = [];
  for (let i = 0; i < shows.length; i++){
    let showObj = {
      id : shows[i].show.id,
      name : shows[i].show.name,
      summary : shows[i].show.summary,
      image : shows[i].show.image ? shows[i].show.image.medium : MISSING_IMAGE_URL,
    };
    listShowsObj.push(showObj);
  }
  console.log(listShowsObj);
  return listShowsObj;
}




/** Given list of shows, create markup for each and to DOM */


/*********** JQuery version ***********/
// function populateShows(shows) {
//   // clear $showsList everytime we do a new search
//   showsList.empty();

//   for (let show of shows) {
//     const $show = $(
//         `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
//          <div class="media">
//            <img 
//               src="${show.image}"  
//               class="w-25 mr-3">
//            <div class="media-body">
//              <h5 class="text-primary">${show.name}</h5>
//              <div><small>${show.summary}</small></div>
//              <button class="btn btn-outline-dark btn-sm Show-getEpisodes">
//                Episodes
//              </button>
//            </div>
//          </div>  
//        </div>
//       `);

//     showsList.append($show);  
//   }
// }



/*********** Javascript version ***********/
function populateShows(shows) {
  const showsList = document.querySelector('#shows-list');
  const episodesList = document.querySelector("#episodes-list");
  episodesList.innerHTML = "";
  showsList.innerHTML='';
  document.getElementById("episodes-area").style.display = "none";

  for (let show of shows){
    let showContainer = document.createElement("div");
    showContainer.setAttribute("data-show-id", show.id);
    showContainer.classList.add("showContainer");

    // adding image
    let showImage = document.createElement("img");
    showImage.src = show.image;

    let mediaContainer = document.createElement("div");
    mediaContainer.classList.add("mediaContainer");

    let mediaBody = document.createElement("div");
    mediaBody.classList.add("mediaBody");

    let showTitle = document.createElement("p");
    showTitle.innerText = show.name;
    showTitle.classList.add('showTitle');
    mediaBody.append(showTitle);

    let showSummary = document.createElement("div");
    showSummary.innerHTML = show.summary;
    showSummary.classList.add("showSummary");
    mediaBody.append(showSummary);

    let button = document.createElement("button");
    button.innerHTML = "Episodes";
    button.setAttribute("id", "episodeBtn");
    mediaBody.append(button);

    mediaContainer.append(showImage);
    mediaContainer.append(mediaBody);
    showContainer.append(mediaContainer);

    // append all of show info to showContainer
    showsList.append(showContainer);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */


/*********** JQuery version ***********/
// async function searchForShowAndDisplay() {
//   const term = $("#search-query").val();
//   const shows = await getShowsByTerm(term);

  
//   populateShows(shows);
// }

// searchForm.on("submit", async function (evt) {
//   evt.preventDefault();
//   await searchForShowAndDisplay();
// });


/*********** Javascript version ***********/
async function searchForShowAndDisplay() {
  const term = document.querySelector('#search-query').value;
  const shows = await getShowsByTerm(term);

  populateShows(shows);
}

const form = document.querySelector("#search-form");
form.addEventListener("submit", async function(e) {
  e.preventDefault();
  await searchForShowAndDisplay();
});




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const response = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );

  let episodes = response.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  console.log(episodes);
  return episodes;
}


/** Write a clear docstring for this function... */

/*********** JQuery version ***********/
// function populateEpisodes(episodes) {
//   const episodesList = $("#episodes-list");
//   episodesList.empty();

//   for (let episode of episodes) {
//     let item = $(
//       `<li>
//         ${episode.name}
//         (season ${episode.season}, episode ${episode.number})
//       </li>`);
//   episodesList.append(item);
//   }

//   episodesArea.show()
// }


/*********** Javascript version ***********/
function populateEpisodes(episodes) {
  const episodesArea = document.querySelector("#episodes-area");
  const episodesList = document.querySelector("#episodes-list");
  episodesList.innerHTML='';

  for (let episode of episodes) {
    
    let item = document.createElement('li');
    item.innerHTML = `${episode.name} (season ${episode.season}, episode ${episode.number})`;
    episodesList.append(item);
  }

  episodesArea.style.display = 'block';
}


/*********** JQuery version ***********/
// $("#shows-list").on("click", ".Show-getEpisodes",async function handleEpisodeClick(evt) {
//   let showID = $(evt.target).closest(".Show").data("show-id");
//   let episodes = await getEpisodes(showID);
//   populateEpisodes(episodes);

// })


/*********** Javascript version ***********/
const episodeList = document.querySelector("#shows-list");
episodeList.addEventListener("click", async function handleEpisodeClick(e) {
  // Need to see if there is a better way to target outter most parent element
  let mostOuterParentNode = e.target.parentNode.parentNode.parentNode;
  let showID = mostOuterParentNode.getAttribute("data-show-id");
  let episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
});
