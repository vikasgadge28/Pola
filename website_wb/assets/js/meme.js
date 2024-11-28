$(document).ready(function() {
    var currentPage = 1;
    var pageSize = 9;
    var memeData = [];

    function loadMemes() {
        $('.loader').show();  // Show loader when starting to load data
    
        fetch('assets/data/memes.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();  // Parse JSON data from the response
            })
            .then(data => {
                console.log("Data loaded", data); // Check what's being loaded
                memeData = data; // Store the data globally
                displayPage(currentPage);
                $('.loader').hide();  // Hide loader when data is ready
            })
            .catch(error => {
                console.error("Request Failed:", error);
                $('.loader').hide();  // Also hide loader on fail
            });
    }
    

    function displayPage(page) {
        $('.loader').show();  // Show loader when changing pages
        var folder = "assets/images/memes/";
        var container = $('.memes');
        container.empty(); // Clear existing memes
        var start = (page - 1) * pageSize;
        var end = start + pageSize;
        var pageData = memeData.slice(start, end);

        pageData.forEach(function(filename) {
            var imgPath = folder + filename;
            var mediaElement;
            
            if (filename.endsWith('.webm')) {
                mediaElement = $('<video>', {
                    src: imgPath,
                    class: 'meme-video',
                    controls: true, 
                }).on('click', function() {
                    this.paused ? this.play() : this.pause();
                });
            } else {
                mediaElement = $('<img>', {
                    src: imgPath,
                    alt: 'Meme Image',
                    class: 'meme-image'
                });
            }
            
            var colDiv = $('<div/>', {
                'class': 'col position-relative'
            });

            var memeCard = $('<div/>', {
                'class': 'rounded-4 bg-white p-4'
            }).append($('<div/>', {
                'class': 'rounded-4 overflow-hidden mb-4'
            }).append(mediaElement));

            var downloadButton = $('<button/>', {
                'class': 'download-btn',
                'title': 'Download',
                'html': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>`
            }).on('click', function() {
                downloadImage(imgPath, filename);
            });

            memeCard.append($('<div/>', {
                'class': 'vstack meme-description align-items-center justify-end mb-2'
            }).append(downloadButton));

            colDiv.append(memeCard);
            container.append(colDiv);
        });

        updateNavigationButtons();
        updatePageNumber()
        $('.loader').hide();  // Hide loader after page is displayed
    }
    
    function updatePageNumber() {
        $('#page').text("Page " + currentPage); // Display current page number
    }
    
    function scrollToPercentage(percent) {
        var scrollPosition = $(window).height() * (percent / 100);
        $('html, body').animate({
            scrollTop: scrollPosition
        }, 200); 
    }

    function updateNavigationButtons() {
        $('.arrow-left').prop('disabled', currentPage === 1);
        $('.arrow-right').prop('disabled', currentPage * pageSize >= memeData.length);
    }

    function downloadImage(url, filename) {
        var a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    $('.arrow-left').click(function() {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            scrollToPercentage(10)
        }
    });

    $('.arrow-right').click(function() {
        if (currentPage * pageSize < memeData.length) {
            currentPage++;
            displayPage(currentPage);
            scrollToPercentage(10)
        }
    });

    loadMemes();
});
