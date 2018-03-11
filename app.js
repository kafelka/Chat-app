const chatTab = document.querySelectorAll(".tabs li a");
console.log(chatTab);

chatTab.forEach(x => x.addEventListener("click", function toggleChatWindow() {
  const activeTab = document.querySelector(".active");

  document.querySelector("#" + activeTab.dataset.toggle).style.display = "none";
  activeTab.classList.remove("active");
  this.classList.add("active");
  console.log(this.dataset.toggle);
  document.querySelector("#" + this.dataset.toggle).style.display = "block";
}));

















 












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

