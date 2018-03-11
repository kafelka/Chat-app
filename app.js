const chatTab = document.querySelectorAll(".tabs li a");
const sendBtn = document.querySelector("#sendBtn");
const msgToSend = document.querySelector("#message-to-send");


chatTab.forEach(x => x.addEventListener("click", function toggleChatWindow() {
  const activeTab = document.querySelector(".active");

  document.querySelector("#" + activeTab.dataset.toggle).style.display = "none";
  activeTab.classList.remove("active");
  this.classList.add("active");
  document.querySelector("#" + this.dataset.toggle).style.display = "block";
}));

sendBtn.addEventListener("click", sendMessage);
msgToSend.addEventListener("keyup", function(e) {
  if (e.which == 13) { //e.keyCode
    sendMessage();
  }
});

function sendMessage() {
  if (msgToSend.value != "") {
    const activeTab = document.querySelector(".active");
    const activeChat = document.querySelector("#" + activeTab.dataset.toggle + " ul");
    console.log(activeChat);
    addMessage(activeChat, "16:05", "Jenien", msgToSend.value);
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
  convUl.insertAdjacentHTML('beforeend', li);
};







 












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

