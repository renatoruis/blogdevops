var lunrIndex,
$results,
pagesIndex;

// Initialize lunrjs using our generated index file
function initLunr() {
// First retrieve the index file
$.getJSON("/index.json")
    .done(function(index) {
        pagesIndex = index;
        
        // Set up lunrjs by declaring the fields we use
        // Also provide their boost level for the ranking
        lunrIndex = lunr(function() {
            this.field("title", {
                boost: 10
            });
            this.field("content", {
                boost: 10
            });
            this.field("description", {
                boost: 10
            });
            this.field("tags", {
                boost: 10
            });

            // ref is the result item identifier (I chose the page URL)
            this.ref("permalink");

            index.forEach(function(page) {
                this.add(page);
            }, this);
        });

        // Feed lunr with each file and let lunr actually index them
        
    })
    .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.error("Error getting Hugo index flie:", err);
    });
}

// Nothing crazy here, just hook up a listener on the input field
function initUI() {

    triggerSearch = function() {
        var query = $("#searchValue").val()
        var results = search(query);
        renderResults(results);
    }


    $("#searchValue")
        .focusout(triggerSearch)
        .keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                console.log("APERTOU ENTER")
                triggerSearch();
            }
    })
}

/**
* Trigger a search in lunr and transform the result
*
* @param  {String} query
* @return {Array}  results
*/
function search(query) {
    return lunrIndex.search(query).map(function(result) {
        return pagesIndex.filter(function(page) {
            return page.permalink === result.ref;
        })[0];
    });
}

/**
* Display the 10 first results
*
* @param  {Array} results to display
*/
function renderResults(results) {

    divResult = document.getElementById("results");

    divResult.innerHTML = "";

    results.forEach(function(result) {
        
        divResult.innerHTML += `

        <div class="card" >
            <div class="row no-gutters">
                <div class="col-md-5">
                <img src="${result.permalink}${result.image[0].src}" class="card-img-top" alt="${result.image[0].name}">
                </div>
                
                <div class="col-md-7">
                    <div class="card-body">
                        <h5 class="card-title">${result.title}</h5>
                        <p class="card-text">${result.description}</p>
                        <a href="${result.permalink}" class="btn btn-primary stretched-link">Read</a>
                    </div>
                </div>
            </div>
        `;
        
    });

}

// Let's get started
initLunr();

$(document).ready(function() {
$("#searchValue").focus()
initUI();
});