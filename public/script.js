const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      //modeToggle = document.querySelector(".dark-light"),
      searchToggle = document.querySelector(".searchToggle"),
      sidebarOpen = document.querySelector(".sidebarOpen"),
      siderbarClose = document.querySelector(".siderbarClose");

      // let getMode = localStorage.getItem("mode");
      //    if(getMode && getMode === "dark-mode"){
       //     body.classList.add("dark");}
          

// js code to toggle dark and light mode
 //     modeToggle.addEventListener("click" , () =>{
   //     modeToggle.classList.toggle("active");
     //   body.classList.toggle("dark");

        // js code to keep user selected mode even page refresh or file reopen
       // if(!body.classList.contains("dark")){
         //   localStorage.setItem("mode" , "light-mode");
        //}else{
          //  localStorage.setItem("mode" , "dark-mode");
      //  }
     // 

// js code to toggle search box
        searchToggle.addEventListener("click" , () =>{
        searchToggle.classList.toggle("active");
      });
 
      
//   js code to toggle sidebar
sidebarOpen.addEventListener("click" , () =>{
    nav.classList.add("active");
});

body.addEventListener("click" , e =>{
    let clickedElm = e.target;

    if(!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")){
        nav.classList.remove("active");
    }
});



document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleDarkMode');
  const body = document.body;

  // Check user's preference from localStorage
  if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
  }

  // Toggle dark mode on button click
  toggleButton.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      const darkModeEnabled = body.classList.contains('dark-mode');
      // Save user's preference to localStorage
      localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
  });
});



