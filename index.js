import { getHtmlFromObj } from "/functions.js"
import { handleWatchlist } from "/functions.js"
import { getMovieItems, setMovieItems} from "/functions.js"

const apikey = "c193f06c"

console.log("index.js has loaded")

// Submit Button
document.addEventListener("submit", (e) =>
{
    console.log("Submit Button was clicked")
    e.preventDefault()
    
    const searchInput = document.getElementById("search-input").value
    searchMovie(searchInput)
})

document.addEventListener("click", (e) =>
{
    if(e.target.dataset.imdbid){
        // Add it to watchlist or remove from watch list?
        handleWatchlist(e.target.dataset.imdbid)
        renderHTML()
    }
})

function renderHTML()
{
    let html = []
    let finalHtml = `<div class="container">`
    
    for (let movie of getMovieItems())
    {
        html.push(getHtmlFromObj(movie))
    }
    
    finalHtml += html.join("<hr>")
    finalHtml += `</div>`
    
    document.getElementById("film-container").innerHTML = finalHtml
}

async function searchMovie(searchTopic){
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${searchTopic}`)
    const data = await res.json()
    
    // If search found no results
    if (data.Response == 'False'){
        console.log("No search results")
    }
    
    findFilmRenderHTML(data)
}

async function findFilmRenderHTML(data){
    let html = ""
    let movieItems = []
    
    // If search found no results
    if (data.Response == 'False')
    {
        html = `
            <div class="default-space container text-light-gray">
                <p class="bold font-18px">Unable to find what you're looking for. Please try another search</p>
            </div>`
        
        
        document.getElementById("film-container").innerHTML = html
        document.getElementById("film-container").classList.remove("margin-top")
    }
    else    //  Run normally
    {
        for (let movie of data.Search)
        {
            const movieItem = await searchByOMDBid(movie.imdbID)
            movieItems.push(movieItem)
        }
        
        document.getElementById("film-container").classList.remove("text-light-gray")
        document.getElementById("film-container").classList.add("margin-top")
        
        setMovieItems(movieItems)
        renderHTML()
    }
}

// fetch movie object by id for more details
async function searchByOMDBid(id)
{
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&i=${id}`)
    const data = await res.json()
    
    return data
}