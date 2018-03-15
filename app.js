
const userlistTab = document.querySelectorAll(".channelTabs li a");
const sendBtn = document.querySelector("#sendBtn");
const msgToSend = document.querySelector("#message-to-send");
const loginBtn = document.querySelector(".form button");
const nick = document.querySelector(".registerForm input");
const webserviceURL = "http://127.0.0.1:5000/";
const chatMainWindow = document.querySelector(".chatMainWindow");


loginBtn.addEventListener("click", function loginToChat() {
  //validating nick value
  if (nick.value.trim() != "") {
    document.querySelector("main").style.display = "flex";
    document.querySelector(".login").style.display = "none";
    //getting channels for the user who is logged in
    getChannels(nick.value.trim());
    //getting user list so that it is already loaded when user logs in
    const activeTab = document.querySelector(".active");
    getUserList(activeTab.innerText);
  } else {
    //show error message
  }
});

//
function addListenersToChatTabs(tabList) {
  tabList.forEach(x => x.addEventListener("click", function toggleChatWindow() {
    const activeTab = document.querySelector(".active");
  
    document.querySelector("#" + activeTab.dataset.toggle).style.display = "none";
    activeTab.classList.remove("active");
    this.classList.add("active");
    document.querySelector("#" + this.dataset.toggle).style.display = "block";
    //update user list on channel change
    getUserList(this.innerText); 
  }));
}



userlistTab.forEach(x => x.addEventListener("click", function toggleUserlistWindow() {
  const activeTab2 = document.querySelector(".channelTabs .active");
 
  document.querySelector("#" + activeTab2.dataset.toggle).style.display = "none";
  activeTab2.classList.remove("active");
  this.classList.add("active");
  document.querySelector("#" + this.dataset.toggle).style.display = "block";
}));


sendBtn.addEventListener("click", sendMessage);
msgToSend.addEventListener("keyup", function(e) {
  if (e.which == 13) { //e.keyCode  13="Enter"
    sendMessage();
  }
});


function sendMessage() {
  if (msgToSend.value.trim() != "") { //trim = removing whitespace
    const activeTab = document.querySelector(".active");
    const activeChat = document.querySelector("#" + activeTab.dataset.toggle + " ul");
    let time = ((new Date().toLocaleTimeString()));
    addMessage(activeChat, time, nick.value, msgToSend.value.replace(/</g, "&#60")); //check if this is enough
    activeChat.parentElement.scrollTop = activeChat.parentElement.scrollHeight; //scroll to the bottom of div
    msgToSend.value = "";
  }
};


function addMessage(convUl, time, nick, msg) {
  const li = `
  <li class="chatMessage">
    <span>${time}</span>
    <span>${nick}</span>
    <span>${msg}</span>
  </li>
  `
  convUl.insertAdjacentHTML('beforeend', li); //
};

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
      document.getElementById("users1").innerHTML = output;
    }
  }
  xhr.send();
}

document.querySelector("[data-toggle='channels']").addEventListener("click", getChannelList);

function getChannelList() {
  const url = webserviceURL + "channels";
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    if(this.status == 200) {
      console.log(this.responseText);
      const apiChannels = JSON.parse(this.responseText);
      let output = "";
      apiChannels["channels"].forEach(function(chan){
        output += `
          <li class="channel">
            <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/17842-200.png" alt="avatar"/>
            <div class="channelInfo">
              <div class="name">${chan}</div>
            </div>
          </li>
          `
        //     <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/1190378-200.png" alt="avatar" />
    });
    document.getElementById("channels").innerHTML = output;
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
      console.log(this.responseText);
      const apiChannels = JSON.parse(this.responseText);
      let tabsOutput = "";
      let conversationOutput = "";
      
      apiChannels["channels"].forEach(function(chan){
        if(chan === apiChannels["channels"][0]) {
          tabsOutput += `
            <li><a class="active" href="#" data-toggle="${chan}">${chan}</a></li>
           `
          conversationOutput += `
            <div class="chatConv" id="${chan}">
              <ul>
                <li class="chatMessage">element ${chan}</li>
              </ul>
            </div>
          `
        } else {
          tabsOutput += `
            <li><a href="#" data-toggle="${chan}">${chan}</a></li>
           `
          conversationOutput += `
            <div class="chatConv" id="${chan}" style="display: none">
              <ul>
                <li class="chatMessage">element testowy</li>
              </ul>
            </div>
          `
        }
    });
    document.querySelector(".tabs").innerHTML = tabsOutput;
    const chatTab = document.querySelectorAll(".tabs.group li a");
    chatMainWindow.innerHTML = conversationOutput;

    addListenersToChatTabs(chatTab);
    }
  }   
  xhr.send();
}

function getMessages(channel) {
  const url = webserviceURL + "messages/" + channel;
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
      // later
    console.log(this.responseText);
  }
  xhr.send();
}





/* <div class="section">
<ul class="tabs group">
</ul>
</div>*/




















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

