$(function () {
  // Prompt for setting a username
  var username;
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  var $messages = $('.messages'); // Messages area
  // Keyboard events
var $window = $(window);
  $window.keydown(function (event) {
    // // Auto-focus the current input when a key is typed
    // if (!(event.ctrlKey || event.metaKey || event.altKey)) {
    //   $('.inputMessage').focus();
    // }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });
 // Sets the client's username
  function setUsername () {
    username = cleanInput($('.usernameInput').val().trim());

    // If the username is valid
    if (username) {
      $('.login.page').fadeOut();
      $('.chat.page').show();
      $('.login.page').off('click');
      //$currentInput = $('.inputMessage').focus();

      // Tell the server your username
      io().emit('add user', username);
    }
  }
  // Sends a chat message
  function sendMessage () {
    var message = $('.inputMessage').val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      io().emit('new message', message);
    }
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html();
  }

// Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    console.log(data);
    // Don't fade the message in if there is an 'X was typing'
    //var $typingMessages = getTypingMessages(data);
    options = options || {};
    // if ($typingMessages.length !== 0) {
    //   options.fade = false;
    //   $typingMessages.remove();
    // }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    //var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
//      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

    // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }
// Socket events
  // Whenever the server emits 'user joined', log it in the chat body
  io().on('user joined', function (data) {
    //log(data.username + ' joined');
    //addParticipantsMessage(data);
    console.log(data);
  });

  // Whenever the server emits 'new message', update the chat body
  io().on('new message', function (data) {
    addChatMessage(data);
  });
  });
