      jQuery(function($) {
          var socket = io.connect();
          var $quoteBox = $('#quoteBox');
          var $quoteInput = $('#quote');
          var $quoteShow = $('#outputQuote');
          var $quoteButton = $('#button');
          var $quoteHistory = $('#quoteHistory');
          var $nameInput = $('#name');
          var $likeButton = $('#like');
          var currentQuote;

          socket.on('newquote', function(data) {
              var quote = '\'' + data.quote + '\'' + ' - ' + data.name;
              $quoteShow.empty().append('<i>' + quote + '</i>').fadeIn('slow');
              currentQuote = data;
              $likeButton.prop('disabled', false);
              $likeButton.text('Like');
              $likeButton.css('background-color', '#28B78D');
          });


          socket.on('newlike', function(data) {
              currentQuote = data;
              console.log(data);
              $likeButton.text('Like - ' + data.like);
          });

          socket.on('quotehistory', function(data) {
              $quoteHistory.empty();
              for (var i = 0; i < data.length; i++) {
                  var quote = '\'' + data[i].quote + '\'' + ' - ' + data[i].name + ' | ' + data[i].like;
                  $quoteHistory.append('<i>' + (i + 1) + '. ' + quote + '<br></i>').fadeIn('slow');
              }
          });

          $quoteBox.submit(function(e) {
              e.preventDefault();
              if ($nameInput.val() == '' || $quoteInput.val() == '') {
                  $quoteShow.empty();
                  $quoteShow.append('aye fill in da boxes');
                  $quoteInput.val('');
                  return;
              }

              if ($quoteInput.val() == currentQuote.quote && $nameInput.val() == currentQuote.name) {
                  $quoteInput.empty();
                  return;
              }

              socket.emit('sendname', $nameInput.val());
              socket.emit('sendquote', $quoteInput.val());
              $quoteInput.val('');

          });

          $likeButton.click(function(e) {
              e.preventDefault();
              socket.emit('like', 0);
              $likeButton.prop('disabled', true);
              $likeButton.css('background-color', '#efefef');
          });

      });