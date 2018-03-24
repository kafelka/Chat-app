const webserviceURL = "http://127.0.0.1:5000/";
const nick = document.querySelector(".registerForm input");
const loginBtn = document.querySelector(".form button");
const mobileMenu = document.querySelector(".mobileMenu");
const sendBtn = document.querySelector("#sendBtn");
const msgToSend = document.querySelector("#messageToSend");

const chatMainWindow = document.querySelector(".chatMainWindow");
const chatNavigation = document.querySelector(".chatNavigation");
const usersAndChannelsNavigation = document.querySelectorAll(".usersAndChannels .tabs li a");
const channelList = document.getElementById("channelsList");

/* **************
 * EVENT LISTENERS - CLICK
 * **************/

loginBtn.addEventListener("click", function loginToChat() {
  //validating nick value
  if (nick.value.trim() != "") {
    document.querySelector("main").style.display = "flex";
    document.querySelector(".login").style.display = "none";
    //getting channels for the user who is logged in
    getChannels(nick.value.trim());
    if (window.matchMedia('(max-width: 480px)').matches) {
      document.querySelector(".mobileMenu").style.display = "block";
    }
  } else {
    //show error message
  }
});

usersAndChannelsNavigation.forEach(x => x.addEventListener("click", function toggleUserlistWindow() {
  const activeTab2 = document.querySelector(".usersAndChannels .tabs .active");
 
  document.querySelector("#" + activeTab2.dataset.toggle).style.display = "none";
  activeTab2.classList.remove("active");
  this.classList.add("active");
  document.querySelector("#" + this.dataset.toggle).style.display = "block";
}));

// usersAndChannels tabs - get channelsList from API
document.querySelector("[data-toggle='channelsList']").addEventListener("click", getChannelList);

mobileMenu.addEventListener("click", function showUserChannel() {
  const userList = document.querySelector(".usersAndChannels");
  const section = document.querySelector(".section");
  if (userList.classList.contains("slideCenter")) {
    userList.classList.add("slideRight");
    userList.classList.remove("slideCenter");
    section.style.display = "block";
  } else {
    userList.classList.remove("slideRight");
    userList.classList.add("slideCenter");
    section.style.display = "none";
  }
});

sendBtn.addEventListener("click", sendMessageAction);

msgToSend.addEventListener("keyup", function(e) {
  if (e.which == 13) { //e.keyCode  13="Enter"
    sendMessageAction();
  }
});

// function addListenersToChatTabs(tabList) {
//   tabList.forEach(x => x.addEventListener("click", 
function toggleChatWindow(currentTab) {
  console.log("toggleChatWindow");
  const activeTab = document.querySelector(".active");
  document.querySelector("#" + activeTab.dataset.toggle).style.display = "none";
  activeTab.classList.remove("active");
  currentTab.classList.add("active");
  document.querySelector("#" + currentTab.dataset.toggle).style.display = "block";
  //update user list on channel change
  getUserList(currentTab.innerText); 
}
// ));
// }

/* **************
 * SENDING MESSAGES
 * **************/
function sendMessageAction() {
  if (msgToSend.value.trim() != "") { //trim = removing whitespace
    const activeTab = document.querySelector(".active");
    const activeChat = document.querySelector("#" + activeTab.dataset.toggle + " ul");
    let currentTime = ((new Date().toLocaleTimeString()));
    const messageText = msgToSend.value.replace(/</g, "&#60");
    postMessage(activeTab.dataset.toggle, messageText);
    addMessage(activeChat, currentTime, nick.value, messageText); 
    activeChat.parentElement.scrollTop = activeChat.parentElement.scrollHeight; //scroll to the bottom of div
    msgToSend.value = "";
  }
};

function addMessage(convUl, messageTime, nick, msg) {
  const li = `
  <li class="chatMessage">
    <span>${messageTime}</span>
    <span>${nick}</span>
    <span>${msg}</span>
  </li>
  `
  convUl.insertAdjacentHTML('beforeend', li); //
};

/* **************
 * NEW CHANNEL
 * **************/

 function openChannel(channelName){
  const activeChannels = Array.from(chatMainWindow.children).map(x => x.id);
  if (activeChannels.includes(channelName)) {
    //to do close channel 
  } else {
    const chatNavTab = new ChatNavigationTab(channelName, false);
    chatNavigation.innerHTML += chatNavTab.getHTML();
    const chatConvDiv = new ChatConversation(channelName, false);
    chatMainWindow.innerHTML += chatConvDiv.getHTML();
    getMessages(channelName);
  }
}



/* **************
 * CLASSES
 * **************/

class ChatConversation {
  constructor(name, isVisible) {
    this.name = name;
    this.isVisible = isVisible;
  }
  getHTML() {
    const display = this.isVisible ? "" : 'style="display: none"';
    return `
      <div class="chatConv" id="${this.name}" ${display}>
        <ul></ul>
      </div>
    `
  }
}

function closeChatTab(x) {
  console.log(x);
} 

class ChatNavigationTab {
  constructor(name, isActive) {
    this.name = name;
    this.isActive = isActive;
  }
  getHTML() {
    const activeConv = this.isActive ? 'class="active"' : "";
    return `
     <li><a ${activeConv} href="#" onclick="toggleChatWindow(this)" data-toggle="${this.name}">${this.name}<div class="close" onclick="closeChatTab(this)"> </div></a></li>
    `
  }
}

class ChannelLi {
  constructor(name) {
    this.name = name;
  }
  getHTML() {
    return `
    <li class="channel">
      <a href="#" onclick="openChannel('${this.name}')">
        <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/17842-200.png" alt="avatar"/>
        <div class="channelInfo">
          <div class="name">${this.name}</div>
        </div>
      </a>
    </li>
    `
  }
}

/* **************
 * API CALLS
 * **************/
function getMessages(channel) {
  const url = webserviceURL + "messages/" + channel;
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    if(this.status == 200) {
      const channelMsgs = JSON.parse(this.responseText);
      const msgList = document.querySelector("#" + channel + " ul");
      channelMsgs.forEach(function(msg){
        const msgHTML = `
          <li class="chatMessage">
            <span>${msg.timestamp}</span>
            <span>${msg.user}</span>
            <span>${msg.message}</span>
          </li>
        `
        msgList.innerHTML += msgHTML;
      })
    }
  }
  xhr.send();
}

function getChannelList() {
  const url = webserviceURL + "channels";
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    if(this.status == 200) {
      const apiChannels = JSON.parse(this.responseText);
      let output = "";
      apiChannels["channels"].forEach(function(channelName){
        const channelLi = new ChannelLi(channelName);
        output += channelLi.getHTML();
        //     <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/1190378-200.png" alt="avatar" />
    });
    channelList.innerHTML = output;
    }
  }
  xhr.send();
}

function getChannels(user) {
  const url = webserviceURL + "channels/" + user;
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    // click login -> get chats from api list and display them in the main chat window
    if(this.status == 200) {
      const apiChannels = JSON.parse(this.responseText);

      apiChannels["channels"].forEach(function(channelName){ //chanName = channels from json
        const isFirstChannel = (channelName === apiChannels["channels"][0]); //checking if channel is first 
        const chatNavTab = new ChatNavigationTab(channelName, isFirstChannel);
        chatNavigation.innerHTML += chatNavTab.getHTML();
        //adding chat div to page HTML so querySelector(msgList) in getMessages finds an element to append messages
        const chatConvDiv = new ChatConversation(channelName, isFirstChannel);
        chatMainWindow.innerHTML += chatConvDiv.getHTML();
        getMessages(channelName);
    });
    // const chatTab = document.querySelectorAll(".chatNavigation li a");
    // addListenersToChatTabs(chatTab);

    //getting user list so that it is already loaded when user logs in
    const activeTab = document.querySelector(".active");
    getUserList(activeTab.innerText);
    }
  }   
  xhr.send();
}

function getUserList(channel) {
  const url = webserviceURL + "users/" + channel;
  //fetch userlist from above URL
  //set userlist div with content of above fetch
  //similar to adding new message to chat
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    if(this.status == 200) {
      
      const apiUsers = JSON.parse(this.responseText);
      let output = "";
      apiUsers["users"].forEach(function(nick){
        output += `
        <li class="user">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_04.jpg" alt="avatar" />
          <div class="userInfo">
            <div class="name">${nick}</div>
            <div class="status">online</div>
          </div>
        </li>
      `
      });
      document.getElementById("usersList").innerHTML = output;
    }
  }
  xhr.send();
}

function postMessage(channel, messageText) {
  const url = webserviceURL + "send/" + channel;

  const xhr = new XMLHttpRequest();

  xhr.open('POST', url);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({user: nick.value, message: messageText}));
}








// (function($) {

// 	var tabs =  $(".tabs li a");
  
// 	tabs.click(function() {
// 		var content = this.hash.replace('/','');
// 		tabs.removeClass("active");
// 		$(this).addClass("active");
//     $("#content").find('p').hide();
//     $(content).fadeIn(200);
// 	});

// })(jQuery);

