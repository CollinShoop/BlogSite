const vSearchResults = 'search-results',
      vSearchQuery = 'search-query',
      urlQueryParam = 'q';

function runSearch() {
    const eResults = $(`#${vSearchResults}`);
    if (eResults == null) {
        // there's a few ways to handle this... instead of adding content to the page, it's probably
        // nicer to error and do nothing. This way there won't be issues if this js is loaded on the wrong page.
        console.error(`required search results element #${vSearchResults} is not found.`)
        return;
    }
    eResults.empty();

    // grab the index file
    $.getJSON("/js/lunr/index.json").done(function (index) {
        const query = getQuery();
        const results = search(index, query);
        renderQuery(query, results.length);
        renderResults(results, eResults);
    }).fail(function (jqxhr, textStatus, error) {
        console.error("Error getting Hugo index file:", textStatus + ", " + error);
    });
}

function getQuery() {
    let q = new URLSearchParams(window.location.search).get(urlQueryParam);
    if (q == null) {
        q = "";
    }
    return decodeURIComponent(q);
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param index
 * @param  {String} query
 * @return {Array}  results
 */
function search(index, query) {
    const lunrIndex = lunr(function () {
        this.field("title", {
            boost: 10
        });
        this.field("tags", {
            boost: 5
        });
        this.field("summary");

        // ref is the result item identifier (I chose the page URL)
        this.ref("href");
        // Feed lunr with each file and let lunr actually index them

        index.forEach(function (page) {
            this.add(page);
        }, this);
    });
    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result:
    //  {ref: "/section/page1", score: 0.2725657778206127}
    // Our result:
    //  {title:"Page1", href:"/section/page1", ...}
    return lunrIndex.search(query).map(function (result) {
        console.log("Lunr result: ", result);
        const filteredMatch = index.filter(function (page) {
            return page.href === result.ref;
        })[0];
        console.log("Match", filteredMatch);
        return filteredMatch;
    });
}

function renderQuery(query, numResults) {
    $(`#${vSearchQuery}`).text(`Search for "${query}" yielded ${numResults} results.`);
}

/**
 * Render results to the provided element eResults
 *
 * @param searchResults
 * @param eResults
 */
function renderResults(searchResults, eResults) {
    const eList = $("<ol>");

    // for now show only first 100 results
    // TODO add pagination
    searchResults.slice(0, 100).forEach(function (result) {
        // render results as new html as children in the
        let eResult = $("<li><p>");

        // create the title of each search result which is a link to the result
        $("<a>", {
            href: result.href,
            class: 'search_result',
            text: `${result.title}`
        }).appendTo(eResult);

        //(optional) add summary with date
        if (result.summary != null) {
            // start with an empty description
            let eDesc = $("<p>", {
                text: "",
            });
            eResult.append(eDesc);

            // (optional) prepend summary with formatted date
            if (result.date != null) {
                let dateLocal = new Date(result.date).toLocaleDateString();
                eDesc.append($("<span>", {
                    class: 'search_result_date',
                    text: `${dateLocal}`,
                }));
                eDesc.append($("<span>", {
                    text: ` - `,
                }));
            }

            // add summary text
            eDesc.append($("<span>", {
                text: `${result.summary}`,
            }))
        }

        // (optional) add tags section
        if (result.tags != null && result.tags.length > 0) {
            let eTags = $("<p>");
            eResult.append(eTags);

            eResult.append($("<p>", {
                text: `[${result.tags.join(", ")}]`
            }));
        }
        eList.append(eResult);
    });
    eResults.append(eList);
}

// Place in header (do not use async or defer)
document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        runSearch();
    }
});
