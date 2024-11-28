$(document).ready(function() {
	
	// Optional: Add logic to handle the closing of the lightbox
	$(document).on('click', '.close', function() {
		$(this).closest('.lightbox').remove();
		// Optionally, destroy the Plyr instance if you're not going to use it anymore
		player.destroy();
	});
	
	$(document).on('click', '.tut', function() {
		$('body').append(`<div class="lightbox w-100 h-100 position-fixed top-0 start-0 vstack justify-content-center align-items-center frosted-glass-effect z-3 p-5">
			<div class="col-12 col-lg-9 col-xl-8 gap-4 d-flex flex-column align-items-center justify-content-center">
				<div class="w-100 bg-dark shadow overflow-hidden rounded-4">
					<video id="player" playsinline controls data-poster="https://embed-ssl.wistia.com/deliveries/242aa1ff4b65c066403aefda27252662e50a70ff.jpg?image_crop_resized=1280x720">
						<source src="./assets/video/How_To_Bridge_To_Base.mp4" type="video/mp4" />
                        <source src="./assets/video/How_To_Bridge_To_Base.webm" type="video/webm" />
                        Your browser does not support the video tag.
					</video>
				</div>
				<button class="btn btn-lg btn-light fw-bold px-4 close rounded-pill">
					<i class="bi bi-x-circle"></i>
					<span>Close Tutorial</span>
				</button>
			</div>
		</div>`);

		// Initialize Plyr on the newly added video element
		const player = new Plyr('#player');
	});
	
	$(document).on('click', '#request-song', function() {
		$('body').append(`<div class="lightbox w-100 h-100 position-fixed top-0 start-0 vstack justify-content-center align-items-center frosted-glass-effect z-3 p-5">
			<form id="request-song-form" class="p-5 bg-white shadow rounded-4 border d-flex flex-column col-12 col-lg-8 col-xl-4 gap-3">
				<h5 class="fw-bolder">Request A Song</h5>
				<div class="result"></div>
				<input id="name" name="name" class="form-control form-control-lg" placeholder="Your name here" />
				<textarea class="form-control form-control-lg" id="message" name="message" placeholder="Insert request here"></textarea>
				<button type="submit" id="send-request" class="btn btn-md btn-primary fw-bold">
					<span>Send Request</span>
				</button>
				<button type="button" class="close btn btn-sm btn-danger fw-bold">
					<span>Cancel Request</span>
				</button>
			</form>
		</div>`);
	});
	
	function resetForm(){
		$('button#send-request').html("Send Request");
		$('#name').val('');
		$('#message').val('');
		setTimeout(function() {
			$('.result').html('');  // Clears the content of the result element
		}, 3000);  // 3000 milliseconds = 3 seconds
	}
	
	$(document).on('submit', '#request-song-form', function(e){
		e.preventDefault();

		$.ajax({
			type: "POST",
			url: "/request",
			data: $(this).serialize(),
			dataType: 'json',
			beforeSend: function(){
				$('button#send-request').html("<div class=\"spinner-border spinner-border-sm\" role=\"status\"></div> Sending....");
			},
			success: function(data) {
				if(data.status === "success"){
					$('.result').html(`<span class="w-100 float-start py-2 px-3 rounded-3 my-2 bg-success text-white fw-bold">${data.message}</span>`);
					resetForm();
				}else if(data.status === "error"){
					$('.result').html(`<span class="w-100 float-start py-2 px-3 rounded-3 my-2 bg-danger text-white fw-bold">${data.message}</span>`);
					resetForm();
				}
			}
		});
	});

	$(document).on('click', '.copy', function(){
		var textToCopy = $(this).attr('data-text');
		var element = $(this); // Store the reference to 'this' outside the promise chain

		navigator.clipboard.writeText(textToCopy).then(function() {
			// Use the stored reference instead of 'this'
			element.html("<i class=\"bi bi-clipboard2-check\"></i>");
			element.removeClass('btn-light').addClass('btn-success');
			$(".contact").text("Contract Address Copied");
		}).catch(function(error) {
			alert('Error copying text: ' + error);
			// Fallback or error handling code can go here
		});
	});
	
	$(document).on('click', 'a.polarmy-link', function (e) {
        e.preventDefault(); // Prevent default behavior of opening in a new tab

        var url = $(this).attr('href'); // Get the href attribute value
        var windowFeatures = 'width=600,height=800,scrollbars=yes,resizable=yes'; // Set window dimensions and properties
		
        // Open the popup window
        var popupWindow = window.open(url, '_blank', windowFeatures);

        if (popupWindow) {
            popupWindow.focus(); // Bring the new window to the front
        } else {
            alert('Please allow popups for this website');
        }
    });


	var scrollTrigger = 100; // px, the point at which the class is added

	$(window).on('scroll', function() {
		var scrollTop = $(window).scrollTop(); // current vertical position of the scroll bar
		if (scrollTop > scrollTrigger) {
			$('header').removeClass('header-faded').addClass('bg-white shadow'); // add class to header
		} else {
			$('header').removeClass('bg-white shadow').addClass('header-faded'); // remove class from header
		}
	});

	$(document).on('click', '.disclaimer-btn', function() {
		var data = $(this).data('id');
		if(data === "risk"){
			$("#risk").toggleClass("d-none");
		}
		if(data === "legal"){
			$("#legal").toggleClass("d-none");
		}
	});

	$(document).on('click', 'a[href^="#"]', function(event) {
		event.preventDefault();

		// Define the offset here. For example, assuming a 60px offset for a fixed header.
		var offset = 60; // Ensure this variable is declared and initialized within the function.

		var targetId = $(this).attr('href');
		var $targetElement = $(targetId);

		if ($targetElement.length) {
			// Calculate the position to scroll to using the offset
			var scrollToPosition = $targetElement.offset().top - offset;

			// Execute the smooth scroll
			$('html, body').animate({
				scrollTop: scrollToPosition
			}, 1000);
		}
	});

	var offset = 100; // Example: height of a fixed header

	$(window).scroll(function() {
		var scrollDistance = $(window).scrollTop();

		$('div.menu-list > a').each(function(i) {
			var href = $(this).attr('href');
			// Check if href is more than just '#' and corresponds to an element on the page
			if (href.length > 1 && $(href).length) {
				var sectionTop = $(href).position().top;
				if (sectionTop <= scrollDistance + offset) {
					$('a.active').removeClass('active');
					$('div.menu-list > a').eq(i).addClass('active');
				}
			}
		});
	}).scroll(); // Execute the scroll handler on page load
	
	
	
	$('#downloadApkApp').on('click', function() {
		   // Set the URL for downloading the APK
		   const downloadUrl = 'https://polaonbase.com/assets/POLAVPN.apk';

		   // Open the URL in a new tab or trigger a direct download
		   window.open(downloadUrl, '_blank');

	});
				
	$('#openRadio').on('click', function() {
		// Window properties
		var windowFeatures = 'width=800,height=350';

		// URL you want to open in the new window
		var url = "https://altair.streamerr.co/public/pola";

		// Open the new window
		var win = window.open(url, "_blank", windowFeatures);

		// Focus on the new window if it opened successfully
		if (win) {
			win.focus();
		} else {
			alert('Please allow popups for this website');
		}
	});

	
	
	function fetchRadioStats() {
		var randomNumber = Math.floor(Math.random() * 11) + 10; 

		$.ajax({
			url: 'https://altair.streamerr.co/json/stream/pola',
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				if(data.status===false){
					$("#radio-live-indicator").html(`<div class="hstack gap-2 fw-bolder"><span>Off Air</span><i class="bi bi-mute"></i></div>`);
					$('#servertitle').text('No Title Available')
					$('#listeners').text(``);
				}else{
					console.log(data.connections + randomNumber)
					$('#servertitle').text(data.nowplaying);
					$("#radio-live-indicator").html(`<div class="hstack gap-2 blinker fw-bolder"><span>Live</span><i class="bi bi-broadcast"></i></div>`);
				    $('#listeners').text(`${data.connections + randomNumber} Current Listeners`);
					$('#songtitle').text(data.songtitle ||'');
					$('#max').text(`${data.maxlisteners}`);
					$('#peak').text(`${data.peaklisteners}`);
					$('#unique').text(`${data.uniquelisteners}`);
					$('#streams').text(`${data.streamhits}`);	
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				$("#radio-live-indicator").html(`<div class="hstack gap-2 fw-bolder"><span>Off Air</span><i class="bi bi-mute"></i></div>`);
			}
		});
	}

	setInterval(fetchRadioStats, 60000);
	fetchRadioStats();
});
