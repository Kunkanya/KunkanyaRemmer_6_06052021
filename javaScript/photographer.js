import loadFactoryPhoto from '../javaScript/class/FactoryMedia.js'

//-------------------Page Photograger----------------------------//
//--GLOBAL VARIABLES
var dataRequest = new XMLHttpRequest();
const url = "./data.json";
//--GLOBAL DOM VAR
const body = document.getElementById("body");
const locationPhotographer = document.querySelector(".location");
const profileContainer = document.getElementById("profile_container");
const linkPage = document.getElementById("link_profile");
//const btnContact = document.querySelector(".btn-contact");
const btnContact = document.getElementById("contact");
const logo= document.getElementById("back_index");

//const photographerPage = document.getElementById("photographerPage")

//--MODAL

var listGallery = new Object();
var newObject = [];
var arrListGallery = [];
var arrLightbox =[];
var countLike = 0;
var passedName = "";
var passedFullName ="";
var currentSlideIndex = 0;
//--Request data from Json file
dataRequest.open("GET", url);
dataRequest.onload = function () {
  //--set json data to object in javasrcipt
  var ourData = JSON.parse(dataRequest.responseText);
  newObject = ourData;
  //--for searching for the ID of photographer"
  var link = document.location.search;
  /*--seperate the result from locarion.search with '=' then we will have 2 array
  array[0]= "?id=", array[1]= ID of photographer--*/
  const myArr = link.split("=");
  var photoId = myArr[1];
  //--convert string to integer for checking ID 
  var passedId = parseInt(photoId);

  for (let i = 0; i < newObject.photographers.length; i++) {
    const checkId = newObject.photographers[i].id;
    if (passedId == checkId) {
      var name = "";
      //--to get only firstname using for the variable for Photos Path
      name = newObject.photographers[i].name;
      passedFullName = name;
      name = name.split(' ').slice(0, 1);
      passedName = name;
      

      photographertTemplate(i);
      gallery(passedId, name);
      return i, name, passedFullName;
    }
  }
  return newObject;
  //--------------------------------------------------------------------------
}
dataRequest.send();


function photographertTemplate(index) {
  var eachTag = [];
  eachTag = newObject.photographers[index].tags;

  photographerPage.innerHTML = ` 
        <header class= "id_header">
          <nav class= "id_header-top">
              <h1 id="id_name">${newObject.photographers[index].name}</h1>
              <h2 class="id_location">${newObject.photographers[index].city} , 
              ${newObject.photographers[index].country}</h2>
              <p class="id_slogan">${newObject.photographers[index].tagline}</p>
              <div class="tag-name">
                  ${tags(eachTag)}
              </div>    
          </nav>
          <div class="id_btn">
              <button id="contact" class="btn btn-contact" onclick=modal_contact() type="submit">Contactez-moi</button>               
          </div>
          <figure class="id_avatar"> 
            <div class="avatar">
              <img src="./Sample Photos/Photographers ID Photos/${newObject.photographers[index].portrait}" 
                alt="Photo of ${newObject.photographers[index].name}">
            </div>
          </figure>
        </header>
      
      <label for="dropdown_menu">Trier par</label>
      <select onchange="loadBySort(this.value)" role="" class="btn dropdown" name="sort_menu" id="sort_menu">
          <option value="popular">Popularité</option>
          <option value="date">Date</option>
          <option value="title">Titre</option>
      </select>

      <div class = "media_container" id="galleryContainer"></div>
      <div class="like_total">
          <div class = "like_box_bottom">
            <p id="total_like"></p>  
            <i class="fas fa-heart"></i>
          </div>
          <span>300euro/jour</span>
      </div>

      <div id="myModal" class="modal" role="dialog" aria-label="image closeup view">
      <button id="close-btn" class="close curser"  " 
      aria-label="button for close lightbox modal">Fermer</button>
      <button class="previous curser"  >Précédent</button>
      <button class="next curser" >Suivant</button>
        `
}
//--------------------------------------------------------------------------


//--------------------------------------------------------------------------
function tags(tags) {
  /*--Page 1: Crate HTML block for "tags" which is array in jsonData and object, so use method map()
  to get the new array for "tags" also use join() to loop for each tags
   --*/
  return `
    ${tags.map(function (tags) {
    return `  
          <a onclick="filterTag(this)" class="tag_name test"> 
          ${tags}
          </a>          
      `
  }).join('')}
  `
}
//--------------------------------------------------------------------------
//Function create gallery for each photographer by passing parameter of 
//array of each photographer and the name
function gallery(photographerId, photographerName) {
  var imgPath = "";
  const galleryContainer = document.getElementById("galleryContainer");
  const myModal = document.getElementById("myModal");

  for (let j = 0; j < newObject.media.length; j++) {
    let isId = newObject.media[j].photographerId
    if (photographerId == isId) {
      listGallery = Object.assign(newObject.media[j]);
      arrListGallery.push(listGallery);
    };
  };
  createGallery(arrListGallery, photographerName);
}
//--------------------------------------------------------------------------
function createGallery(arrGallery, isName) {

  let path = "";
  let source = "";
  let testId= "";
  //--add newarray for create lightbox to arrTest
  arrLightbox = arrGallery;
  for (let i = 0; i < arrGallery.length; i++) {
    let likes = arrGallery[i].likes;
    let id = arrGallery[i].id;
//    <a class="media curser" onclick="test(${arrGallery[i].id})">

    var gallery = `
    <figure class="media curser"><a href="#" onclick="launchModal(${id})" >${sourcePath(arrGallery, i)}</a>  
      <figcaption class="figcaption_media">${arrGallery[i].title}     
         <div class"show">${likes}</div>       
         <div data-like="${likes}" class="like" role="button"><i class="fas fa-heart"></i></div>
      </figcaption>
      <p>${arrGallery[i].date}</p>
      <figure>
     `
    //--add number of like from each photo to total-like
    countLike += likes;

    // add html block to the page

    galleryContainer.innerHTML += gallery;
    //Function to check whether media is image or video
      function sourcePath(arrGallery) {
      
        if (arrGallery[i].image == null) {
          path = `"./Sample Photos/${isName}/${arrGallery[i].video}"`
          source = `<video  src=${path} type="video/mp4"> </video>`
          return source;
        } else if (arrGallery[i].video == null) {
          testId = (arrGallery[i].id);
          console.log(testId);
          path = `"./Sample Photos/${isName}/${arrGallery[i].image}"`
          source = `<img  src=${path} alt="Photo of ${arrGallery[i].title}">`
          return source;
        }
    }
  }
  //--add the total likes for each photographer  
  const total_like = document.querySelector("#total_like");
  total_like.innerText = countLike;

  //-- increment like when click
  const heart = document.querySelectorAll(".like");
  for (let i = 0; i < heart.length; i++) {
    //-- access dataset from class likeand pass it to integer
    let x = parseInt(heart[i].dataset.like);
    //--addEventlistener to each heart
    heart[i].addEventListener("click", () => {
      x++;
      //-- add each like-click to total like
      countLike++;
      //--select previousElementSibling from heart[i]to change the value to (X)
      const show = heart[i].previousElementSibling;
      show.innerText = x;
      total_like.innerText = countLike;
    }, false);
  }  
  return;
}
//--------------------------------------------------------------------------
//--Function for sort when choose the option in dropdown list.
function loadBySort(option) {
  //--set countLike to 0 eachtime onchange for not accumulate the likes
  countLike = 0;
  if (option == "popular") {
    const sortByLike = arrListGallery.sort(function (a, b) {
      return a.likes - b.likes;
    });
    console.log(sortByLike);
    // set container for gallery = "" and call the function to create a new gallery sorted by likes
    galleryContainer.innerHTML = "";
    createGallery(sortByLike, passedName);
    return;
  } else if (option == "date") {
    const sortByDate = arrListGallery.sort(function (a, b) {
      return new Date(a.date).valueOf() - new Date(b.date).valueOf(); //timestamps      
    });
    galleryContainer.innerHTML = "";
    createGallery(sortByDate, passedName);
    return;
  } else if (option == "title") {
    const sortByName = arrListGallery.sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1; // a comes first
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1; // b comes first
      if (a.title.toLowerCase() = b.title.toLowerCase()) return 0; // nothing change
    });
    galleryContainer.innerHTML = "";
    createGallery(sortByName, passedName);
    return;
  }
}
//--------------------------------------------------------------------------
//--Function for filter the tagsname 
function filterTag(ele) {
  //--set countLike to 0 for not accumulate the like on change event
  countLike = 0;
  //ele.innerHTML = tagname to be searched : use trim()to have only string ready for search
  let searchText = ele.innerHTML;
  console.log(searchText.trim());
  searchText = searchText.trim();
  var newArray = arrListGallery.filter(function (e) {
    //change e.tags which is object to string 
    var x = e.tags.toString();
    console.log("x is= " + x)
    return x == searchText;
  });
  console.log(newArray);
  galleryContainer.innerHTML = "";
  createGallery(newArray, passedName);
}
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//--FUNCTION LIGHTBOX
function launchModal(id) {
  const next = document.querySelector(".next");
  const prev = document.querySelector(".previous");
  //--check Id which passed from event onlclick to check which array is currentphoto
  var currentPhoto ;
  //--find the ID of currentphoto once click by passing "id"
  let indexCurrentSlide = arrLightbox.findIndex(a =>{
    if(a.id === id){
      // currentPhoto is now array with the passed id
      return a.id == id, currentPhoto = a; 
    } 
  }); 
      indexCurrentSlide = parseInt(indexCurrentSlide);
      myModal.style.display = "block";
      myModal.setAttribute("aria-hidden", "false");
      //--if the first or the last photo of array are clicked the previos or next button will be disabled accordingly.
      if(indexCurrentSlide === 0){
        prev.style.display = 'none';
        prev.disabled = true;
        next.style.display = 'block';
        next.disabled = false;
      }else if(indexCurrentSlide  === arrLightbox.length - 1){
        next.style.display = 'none';
        next.disabled = true;
        prev.style.display = 'block';
        prev.disabled = false;
      }
      //--create new object by using Factory method to load lightbox currentphoto.
      const lightboxCurrentPhoto = loadFactoryPhoto(currentPhoto, indexCurrentSlide);
      //--now lightboxCurrentPhoto is ein object with property load() from Factory function "loadFactoryPhoto"
      lightboxCurrentPhoto.load();

      //--AddEventListener to Prev and next button
      next.addEventListener('click',nextPhoto);
      prev.addEventListener('click',prevPhoto);
/**
 * ADD KEYBOARD EVENT ON MODAL
 */
      this.addEventListener("keydown", keyboardLightbox);

      function keyboardLightbox(e){
        const keyCode = e.keyCode ? e.keyCode : e.which
          e.preventDefault();
        console.log(keyCode);
        if (keyCode == 27 && myModal.getAttribute("aria-hidden", "false")) {//27 = escape button
          console.log(keyCode, myModal);
          closeModal();
        } else if (keyCode == 39 && myModal.getAttribute("aria-hidden", "false")) {//39 = arrowright button
          console.log("next", keyCode, myModal);
          next.focus()
          nextPhoto();    
        } else if (keyCode == 37 && myModal.getAttribute("aria-hidden", "false")) {//37 = arrowleft button
          console.log("previous", keyCode, myModal);
          prev.focus();
          prevPhoto();
        } else if (keyCode == 40 && myModal.getAttribute("aria-hidden", "false")) {//40 = arrowdown button
          next.focus();
        }else if (keyCode == 27) {//40 = arrowdown button
          const logo = document.querySelector(".logo")
          alert(e.focus)
          logo.focus();
        }
      }
    //-------------------------------------------------------------------------
    //-- Function to call next photo
    function nextPhoto() {
        var nextIndex = indexCurrentSlide + 1
        console.log("currentphoto array is"+ arrLightbox.length) 
        console.log(nextIndex)
        //disable next button when the last photo of array 
        if (nextIndex === arrLightbox.length-1 || nextIndex >= arrLightbox.length){
          const lightboxCurrentPhotoPrev = loadFactoryPhoto(arrLightbox[arrLightbox.length -1], arrLightbox.length-1);
          lightboxCurrentPhotoPrev.load();
          next.style.display = 'none'
          next.disabled = false
          prev.style.display = 'block'
          prev.disabled = true
          // set indexcurrentSlide always to the last array.lenght-1
          indexCurrentSlide = arrLightbox.length - 1
          return
        }else  { 
          next.style.display = 'block'
          next.disabled = false
          prev.style.display = 'block'
          prev.disabled = false
          const lightboxCurrentPhotoNext = loadFactoryPhoto(arrLightbox[nextIndex], nextIndex);
            lightboxCurrentPhotoNext.load();
            indexCurrentSlide = nextIndex ;
            return
          }
        };  
    //-------------------------------------------------------------------------
    //-- Function to call previous photo
    function prevPhoto() {
      var prevIndex = indexCurrentSlide - 1;
      if (prevIndex === 0 || indexCurrentSlide <=0){
        prev.style.display = 'none';
        prev.disabled = true;
        next.style.display = 'block';
        next.disabled = false;
        const lightboxCurrentPhotoPrev = loadFactoryPhoto(arrLightbox[0], 0);
          indexCurrentSlide = 0;
          lightboxCurrentPhotoPrev.load();
        return
      }else  { 
        prev.style.display = 'block';
        prev.disabled = false
        next.style.display = 'block';
        next.disabled = false
        const lightboxCurrentPhotoPrev = loadFactoryPhoto(arrLightbox[prevIndex], prevIndex);
          lightboxCurrentPhotoPrev.load();
        indexCurrentSlide = prevIndex
        return
        }
      };  

//--Function close lightbox modal
function closeModal() {
  //--remove keyboardEvent for lightbox when close
   this.removeEventListener("keydown", keyboardLightbox);
   myModal.style.display = "none";
   myModal.setAttribute("aria-hidden", "true");
   photographerPage.style.display="block";
   photographerPage.setAttribute("aria-hidden", "false");
   //--remove class to hide scrollbar on body 
   body.classList.remove("no-scroll");
   //--clear modalContent.innerHTML = null 
   const modalContent = document.getElementById("modal_content");
   if (modalContent != null) {
     modalContent.remove();
   };
//   location.href="photographer.html";
 };

    }
/**END LAUNCHMODAL FUNCTION */
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
  
//-------------------------------------------------------------------------
//--Factory function to return the function load() once the lightbox is open. 
//to load currentphoto in the lightbox

//------------------------------------------------------------------------
//--PHOTOGRAPHER PAGE KEYBOARD EVENT
window.addEventListener("keydown", keyboardPhotograph,);
function  keyboardPhotograph(e) {
  e.preventDefault();
  const keyCode = e.keyCode ? e.keyCode : e.which
  console.log(keyCode);
  if (keyCode === 27) {//27 = escape button: go back to index.html
    location.href="index.html";
  } else if (keyCode === 9) {//9 = tab focus on btn-contact button
    modal_contact();
  } else if (keyCode == 37 && myModal.getAttribute("aria-hidden", "false")) {//37 = arrowleft button
    console.log("e");
  };
};
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//--CONTACT FORM

/**
 * 
 */
function modal_contact(){

    var contactHTML= `   
   <div id="form_modal">
     <div id="form_container">   
     <header>
          <h1>Contactez-moi</h1>
          <h2>${passedFullName}</h2>
      </header>
      <button id="closeModalForm" class="close_form curser" onclick="closeContactModal()">
        X
      </button>
      
      <form name="myForm" action="#" id= "contact_modal_content" onsubmit="return validation()" method="GET">
          <div class="input">
            <label for="firstname">Prénom</label>
            <input type="text" name="firstname" id="firstname" minlength="2">
            <small></small>
          </div>
          <div class="input">
            <label for="lastname">Nom</label>
            <input type="text" name="lastname" id="lastname" minlength="2">
            <small></small>
          </div>
          <div class="input">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" required>
            <small></small>
          </div>

          <div class="input">
          <label for="message">Votre message</label>
          <textarea name="message" id="message"></textarea>
          </div>
          <input type="submit" id="validate" class="btn btn-submit" value="Envoyer">        
      </form>
      
      </div>
    </div>
`
    body.insertAdjacentHTML("beforeend", contactHTML);
//-- EVENT VALADATION FORM
    const validate = document.getElementById("validate");
    validate.addEventListener("click", validation);
}
//--DOM VALIDATION FORM
function validation(e){
    e.preventDefault()
    const form = document.forms["myform"]
    let firstname = document.forms["myForm"]["firstname"]
    let lastname  = document.forms["myForm"]["lastname"]
    let email = document.forms["myForm"]["email"]
    let message = document.forms["myForm"]["message"]
    //-- Error messages for function validate()
    const nameErrorMessage = "Veuillez entrer 2 caractères ou plus pour le champ du nom.";
    const emailErrorMessage = "Veuillez entrer valid E-mail address.";
    if(firstname.value === null|| firstname.value.length <2 ){
      setInputError(firstname, nameErrorMessage)
      return false
    }else{
      setInputSuccess(firstname)
    }

    if(lastname.value === null|| lastname.value.length <2 ){
      setInputError(lastname, nameErrorMessage)
      return false
    }else{
      setInputSuccess(lastname)
    }

    if(email.value === "" || email.valu ){
      setInputError(email, emailErrorMessage)
      return false
    }else{
      setInputSuccess(email)
    }

function setInputError(input, errMessage){
    input.style.border = "black 3px solid"
    input.className ="text control "
    input.className ="text control error"
    let parent = input.parentElement
    let err = parent.querySelector("small")
    err.style.display= "block"
    err.innerText= errMessage
    input.focus()
}
function setInputSuccess(input){
  input.style.border = "green 3px solid"
  input.className ="text control "
  input.className ="text control success"
  let parent = input.parentElement
  let err = parent.querySelector("small")
  err.style.display = "none"
}

    console.log("Prénom : " + firstname.value)
    console.log("Nom : " + lastname.value)
    console.log("Email : " + email.value)
    console.log("Message : " + message.value)
    
    alert ("close contac_form")
    
  }

  
