var readLater = {
    init_: function() {
        var co = document.getElementById("controls");
        co.innerHTML = '<span id="addbtn" class="addbtn">Add this page to read later list</span></li>';

        document.getElementById('addbtn').addEventListener('click', function() {
            readLater.addCurrentPage_();
        });

        this.showList_();
    },
    showList_: function() {
        var c = document.getElementById("container");
        chrome.storage.sync.get("pages", function(obj) {

            if (typeof obj === "object" && obj.hasOwnProperty("pages")) {
                var html = "<ul>";
                for (var i = 0; i < obj.pages.length; i++) {
                    html += '<li><a href="' + obj.pages[i].url + '">' + obj.pages[i].title + '</a> <span class="removebtn" data-index="' + i + '">Remove</span></li>';
                }
                html += "</ul>";
                c.innerHTML = html;
            } else {
                c.innerHTML = "<p>There are currently no pages to read later.</p>";
            }
        });


    },
    removeItem_: function(index) {
        chrome.storage.sync.get("pages", function(obj) {

            if (typeof obj === "object" && obj.hasOwnProperty("pages")) {
                obj.pages.splice(index, 1);

                chrome.storage.sync.set({'pages': obj.pages}, function() {
                    readLater.showList_();
                }); //end of set pages

            }

        });
    },
    addCurrentPage_: function() {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {

            chrome.storage.sync.get("pages", function(obj) {
                if (typeof obj !== "object" || !obj.hasOwnProperty("pages")) {
                    obj = {'pages': []};
                }
                obj.pages.push({'url': tabs[0].url, 'title': tabs[0].title});

                chrome.storage.sync.set({'pages': obj.pages}, function() {
                    readLater.showList_();
                }); //end of set pages

            }); //end of get pages

        }); //end of get current tab
    }
}

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
    //kittenGenerator.requestKittens();
    readLater.init_();
    $('#container').on('click', '.removebtn', function(e) {
        readLater.removeItem_($(this).attr('data-index'));
    });
    $('body').on('click', '#addbtn', function(e) {
        readLater.addCurrentPage_();
    });
    $('#container').on('click', 'a', function(e) {
        chrome.tabs.create({url: $(this).attr('href')});
    })
});
