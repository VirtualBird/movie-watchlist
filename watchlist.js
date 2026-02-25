import { getHtmlFromObj } from '/functions.js'
import { handleWatchlist } from '/functions.js'

console.log("Watchlist.js has loaded")

document.addEventListener("click", (e) =>
{
    if(e.target.dataset.imdbid)
    {
        // Add it to watchlist or remove from watch list?
        handleWatchlist(e.target.dataset.imdbid)
        renderWatchlistHtml()
    }
})

//  Render Html
function renderWatchlistHtml(){
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))
    let html = []
    
    //  if Watchlist is empty
    if (watchlist === null ||
        watchlist.length == 0)
    {
        console.log("No items in watchlist")
        
        let thisHtml = `
        <div class="default-space">
        
            <p class="text-light-gray font-18px bold">Your watchlist is looking a little empty...</p>
            <a href="index.html">
            <div class="msg-add-movies bold"><img src="images/plus-dark.png"><p>Let's add some movies!</p></div>
            </a>
        </div>
        `
        document.getElementById("watchlist-container").innerHTML = thisHtml
        document.getElementById("watchlist-container").classList.remove("margin-top")
    }
    else    //  Render items in watchlist
    {
        for (let item of watchlist)
        {
            //  was used for bugtesting, if invalid entry was found skip over it
            if (item === null)
                console.log("Invalid item found in watchlist. Skipping item")
            else    //  Run normally
                html.push(getHtmlFromObj(item))
        }
        
        let finalHtml = `<div class="container">`
        finalHtml += html.join("<hr>")
        finalHtml += `</div>`
        
        document.getElementById("watchlist-container").innerHTML = finalHtml
        document.getElementById("watchlist-container").classList.add("margin-top")
    }
}

renderWatchlistHtml()