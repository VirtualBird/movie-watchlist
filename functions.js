let movieItems = []

export function getMovieItems(){
    return movieItems
}

export function setMovieItems(moviesArr){
    movieItems = moviesArr    
}

export function getHtmlFromObj(movieObj){
    return `
    <div class="movie-listing">
        <div class="listing-img"><img src="${movieObj.Poster}" alt="${movieObj.Title} Movie Poster"></div>
        
        <div class="listing-container">
            <div class="listing-title">
                <h2>${movieObj.Title}</h2><img src="images/star.png"><span class="listing-rating">${movieObj.imdbRating}</span>
            </div>
            <div class="listing-subtext">
                <ul>
                    <li class="listing-min">${movieObj.Runtime}</li>
                    <li class="listing-genres">${movieObj.Genre}</li>
                    <li class="listing-add" data-imdbid=${movieObj.imdbID}>
                    ${existsInWatchlist(movieObj.imdbID) ? 
                    `<img src="images/minus-dark.png" data-imdbid=${movieObj.imdbID}> Remove`: 
                    `<img src="images/plus-dark.png" data-imdbid=${movieObj.imdbID}> Watchlist`}
                    </li>
                </ul>
            </div>
            <div class="listing-description font-14px text-gray">
                <p>${movieObj.Plot}</p>
            </div>
        </div>
    </div>
    `
}

// Handles adding or removing items to watchlist
export function handleWatchlist(id)
{
    let watchlist = JSON.parse(localStorage.getItem("watchlist"))
    
    // If watchlist in localstorage doesn't exist, create one
    if (watchlist === null)
    {
        console.log("watchlist does not exist in localstorage. Creating watchlist.")
        watchlist = []
    }
    
    //Check if something exists in watchlist
    if (watchlist.some(obj => obj.imdbID == id)){
        //  If movie item already exists in watchlist, remove it
        removeFromWatchlist(id, watchlist)
    }
    else{
        //  If movie item does not exist in watchlist, add it
        addToWatchlist(id, watchlist)
    }
}

function addToWatchlist(id, watchlist)
{
    console.log("Adding ID "+ id + " to watchlist")
    
    let movieItem = getMovieItemByOMDBID(id)
    
    //  hacky fix if movieitem is null, get from watchlist instead
    if (movieItem == null){
        console.log("movieItem is " + movieItem + ". Getting movieItem from localstorage instead.")
        
        movieItem = watchlist.find(obj => {
            return obj.imdbID === id
        })
    }
    
    //If it's still null for some reason, throw some kind of error and don't run anything else
    if (movieItem == null){
        console.error("Error, trying to add movie item that doesn't exist")
    }
    else    // Run normally
    {
        watchlist.push(movieItem)
        
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
}

function removeFromWatchlist(id, watchlist)
{
    console.log("Removing movieItem " + id + " from watchlist")
    //  Remove movies in watchlist that match the same id
    watchlist = watchlist.filter(movie => !(movie.imdbID == id))
    
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
}

function existsInWatchlist(omdbid)
{
    let movieArray = JSON.parse(localStorage.getItem("watchlist"))
    
    // If watchlist in localstorage doesn't exist, create one
    if (movieArray == null)
    {
        movieArray = []
    }
    // Check if an object exists with that id value in watchlist local storage
    return movieArray.some((obj) => obj.imdbID == omdbid)
}

function getMovieItemByOMDBID(omdbid)
{
    return movieItems.find(obj => {
        return obj.imdbID === omdbid
    })
}