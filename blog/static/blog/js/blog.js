//make ajax request to figure out what page/set of restaurants this is
var restaurantInfoMaster;
var numberOfRestaurants;
var filters;
var downvoteButtons;
var upvoteButtons;
var restaurantOptions;
var animation;
var serverFilterScores;
var serverFilterUsernamesUp;
var serverFilterUsernamesDown;



var filtersActive = [];
var filtersServer = [];

var animationTest;
var httpRequest;
var titleInDatabase = 'testfilterset'
var list;

var usernameField;
var debug;

var runJS

var urlCode = 'testfilterset';

var orderedRestaurants;

var restaurantHeader = document.getElementsByClassName("article-title");
var restaurantContainer = document.getElementsByClassName("restElements")
var restaurantScore = document.getElementsByClassName("score")
var restaurantID = document.getElementsByClassName("restElements")
var filterScores = document.getElementsByClassName("scoreFilter")
var restaurantBoxes = document.getElementsByClassName("media content-section")

var filterUpvoteButtons;
var filterDownvoteButtons;

var usernameCreated = false;
var links = document.getElementsByClassName('dynamicLink');
var href = "http://www.google.com"; //any other link as wish


//ajax request to figure out what page is and get restaurant data
if(document.URL.includes("group")){
        titleInDatabase = document.URL.slice(54);
}
$.ajax({
            url : document.URL,
            type : "GET",
            data : {title: titleInDatabase},
            success : function (json) {
               runJS = false;
                //filtersServer = json_response.user

                if(document.URL.includes("group")){

                    runJS = true;
                    restaurantInfoMaster=JSON.parse(json['restaurantInfo']);


                    serverFilterScores = JSON.parse(json['filterInfo'])

                    serverFilterUsernamesDown = JSON.parse(json['serverFilterUsernamesDown'])
                    serverFilterUsernamesUp = JSON.parse(json['serverFilterUsernamesUp'])


                    initializeFilters()
                    loadJS()



                    updateOrder()


                }
                console.log(restaurantInfoMaster)

            },
            error : function () {
                console.log("Error Ajax");
            }
        })

function loadJS(){

    filters = document.getElementById("FilterOptions").getElementsByTagName("li");
    restaurantOptions = document.getElementById("RestaurantOptions").getElementsByTagName("article");
    animation = document.getElementsByClassName("animated");
    downvoteButtons = document.getElementsByClassName("downvoteButton")
    upvoteButtons = document.getElementsByClassName("upvoteButton")
    filterUpvoteButtons = document.getElementsByClassName("upvoteFilterButton")
    filterDownvoteButtons = document.getElementsByClassName("downvoteFilterButton")
    animationTest = document.getElementById("elem");

    usernameContainer = document.getElementById('usernameContainer')
    //we are on group page

    usernameContainer[0]

    titleInDatabase = document.URL.slice(34);
    numberOfRestaurants = Object.keys(restaurantInfoMaster).length



    document.getElementById("usernameSubmitButton").addEventListener("click", usernameSubmitted)

    for(i=0; i<filterScores.length; i++){
        //add button listeners here
        filterUpvoteButtons[i].addEventListener("click", clickFilterUpvoteButton)
        filterDownvoteButtons[i].addEventListener("click", clickFilterDownvoteButton)

    }


    for(m=0;m<numberOfRestaurants;m++){
        downvoteButtons[m].addEventListener("click", clickDownvoteRestaurant)
        upvoteButtons[m].addEventListener("click", clickUpvoteRestaurant)
    }

    for(n=0;n<animation.length;n++){

        animation[n].removeAttribute('hidden');
        animation[n].classList.add('fadeInUp');



        //animationGhost[n].removeAttribute('hidden');
        //animationGhost[n].classList.add('fadeInRight');


    }


    setInterval(checkForUpdate, 1000);

}
if(document.getElementById("page").getAttribute("data-title")=="homepage"){
    //we are on the homepage
    var animation = document.getElementsByClassName("animated");
    var buttons = document.getElementById("buttonCase").getElementsByTagName("button");
    for(i=0; i<buttons.length; i++){
        buttons[i].addEventListener("click", activateButton)
    }
    for(n=0;n<animation.length;n++){

        animation[n].removeAttribute('hidden');
        animation[n].classList.add('fadeInRight');

    }
}
function clickDownvoteRestaurant(){
    if(usernameCreated){
        //now we know they have a username
        //next, we need to check if they have already voted down on this restaurant
        //then, check if they have voted UP on it already and if so ---> remove from up, add to down
        console.log("usernmae is created")
        for(e=0;e<numberOfRestaurants;e++){
            //find the index of the restaurant who's id is matched
            if(restaurantInfoMaster[e].id == this.parentElement.parentElement.parentElement.id){
                //we have a match
                console.log("Match found")

                if(restaurantInfoMaster[e].usernamesVotedDown.includes(","+usernameField+",")){
                    console.log("USER HAS VOTED DOWN ON THIS ALREADY")
                    //So now we are going to "unvote" and remove them from the list since their influence is gone
                    restaurantInfoMaster[e].usernamesVotedDown = restaurantInfoMaster[e].usernamesVotedDown.replace(","+usernameField+",", "")
                    document.getElementsByClassName("dislikeButtonRestaurants")[e].src = dislike2grey

                    upvoteRestaurantAnonymous(restaurantInfoMaster[e])
                    updateServer()
                }else{
                    //user has not already voted down on this

                    //now let's check if they have voted up on it?
                    if(restaurantInfoMaster[e].usernamesVotedUp.includes(","+usernameField+",")){
                        //user has already upvoted on this restaurant
                        //we want to swap their vote to down
                        //do this by 1. initiate 2 downvotes
                        //2. add them to the the list of ppl that downvoted
                        //3. remove them from ppl that upvoted

                        //remove them from people that upvoted
                        //anonymous downvote (1)
                        //actual downvote (2) - this should add them to pp that downvoted
                        restaurantInfoMaster[e].usernamesVotedUp = restaurantInfoMaster[e].usernamesVotedUp.replace(","+usernameField+",", "")
                        document.getElementsByClassName("dislikeButtonRestaurants")[e].src = dislike2red
                        document.getElementsByClassName("likeButtonRestaurants")[e].src = like2grey

                        downvoteRestaurantAnonymous(restaurantInfoMaster[e])
                        downvoteRestaurant(restaurantInfoMaster[e])
                        updateServer()

                    }else{
                        //they havent voted down already
                        //they havent voted up already
                        //and they have a username so now they can finally vote down!
                        document.getElementsByClassName("dislikeButtonRestaurants")[e].src = dislike2red

                        console.log("downvoting restauraint")
                        downvoteSingleRestaurantWithParameter(this.parentElement.parentElement.parentElement.id)
                        updateServer()
                    }
                }
            }
        }



    }else{
        console.log("YOU DONT HAV A USERNAME")
        alert("Please create a username first")
    }
}
function clickUpvoteRestaurant(){
    if(usernameCreated){
        console.log("usernmae is created")

        for(e=0;e<numberOfRestaurants;e++){
            //find the index of the restaurant who's id is matched
            if(restaurantInfoMaster[e].id == this.parentElement.parentElement.parentElement.id){
                //we have a match
                console.log("Match found")
                if(restaurantInfoMaster[e].usernamesVotedUp.includes(","+usernameField+",")){
                    console.log("USER HAS VOTED UP ON THIS ALREADY")
                    //So now we are going to "unvote" and remove them from the list since their influence is gone
                    restaurantInfoMaster[e].usernamesVotedUp = restaurantInfoMaster[e].usernamesVotedDown.replace(","+usernameField+",", "")
                    document.getElementsByClassName("likeButtonRestaurants")[e].src = like2grey

                    downvoteRestaurantAnonymous(restaurantInfoMaster[e])
                    updateServer()
                }else{
                    console.log("username hasn't voted up already")
                    if(restaurantInfoMaster[e].usernamesVotedDown.includes(","+usernameField+",")){
                        console.log("user has voted down already!")
                        restaurantInfoMaster[e].usernamesVotedDown = restaurantInfoMaster[e].usernamesVotedDown.replace(","+usernameField+",", "")
                        document.getElementsByClassName("likeButtonRestaurants")[e].src = like2green
                        document.getElementsByClassName("dislikeButtonRestaurants")[e].src = like2grey

                        upvoteRestaurantAnonymous(restaurantInfoMaster[e])
                        upvoteRestaurant(restaurantInfoMaster[e])
                        updateServer()

                    }else{
                        //they havent voted up already
                        //they havent voted down already
                        //and they have a username so now they can finally vote down!
                        console.log("upvoting restauraint")
                        document.getElementsByClassName("likeButtonRestaurants")[e].src = like2green
                        upvoteSingleRestaurantWithParameter(this.parentElement.parentElement.parentElement.id)
                        updateServer()
                    }
                }
            }
        }

    }else{
        console.log("YOU DONT HAV A USERNAME")
        alert("Please create a username first")

    }
}
function clickFilterUpvoteButton(){
    if(usernameCreated){



        for(e=0;e<Object.keys(filters).length;e++){
            //find the index of the filter who's id is matched
            if(filters[e].id == this.parentElement.id){
                //we have a match
                console.log("Match found")
                if(serverFilterUsernamesUp[e].includes(","+usernameField+",")){
                    console.log("USER HAS VOTED UP ON THIS ALREADY")
                    //So now we are going to "unvote" and remove them from the list since their influence is gone
                    serverFilterUsernamesUp[e] = serverFilterUsernamesUp[e].replace(","+usernameField+",", "")
                    downvoteFilterAnonymous(filters[e])
                    updateServer()
                }else{
                    console.log("username hasn't voted up already")
                    if(serverFilterUsernamesDown[e].includes(","+usernameField+",")){
                        console.log("user has voted down already!")
                        serverFilterUsernamesDown[e] = serverFilterUsernamesDown[e].replace(","+usernameField+",", "")
                        upvoteFilterAnonymous(filters[e])
                        upvoteFilter(filters[e])
                        updateServer()

                    }else{
                        //they havent voted up already
                        //they havent voted down already
                        //and they have a username so now they can finally vote down!
                        console.log("upvoting restauraint")
                        upvoteSingleFilterWithParameter(filters[e].id)
                        updateServer()
                    }
                }
            }
        }






    }else{
        console.log("YOU DONT HAVE A USERNAME")
        alert("Please create a username first")

    }
}
function clickFilterDownvoteButton(){
    if(usernameCreated){

        for(e=0;e<Object.keys(filters).length;e++){
            //find the index of the filter who's id is matched
            if(filters[e].id == this.parentElement.id){
                //we have a match
                console.log("Match found")
                if(serverFilterUsernamesDown[e].includes(","+usernameField+",")){
                    console.log("USER HAS VOTED UP ON THIS ALREADY")
                    //So now we are going to "unvote" and remove them from the list since their influence is gone
                    serverFilterUsernamesDown[e] = serverFilterUsernamesDown[e].replace(","+usernameField+",", "")
                    upvoteFilterAnonymous(filters[e])
                    updateServer()
                }else{
                    console.log("username hasn't voted up already")
                    if(serverFilterUsernamesUp[e].includes(","+usernameField+",")){
                        console.log("user has voted down already!")
                        serverFilterUsernamesUp[e] = serverFilterUsernamesUp[e].replace(","+usernameField+",", "")
                        downvoteFilterAnonymous(filters[e])
                        downvoteFilter(filters[e])
                        updateServer()

                    }else{
                        //they havent voted up already
                        //they havent voted down already
                        //and they have a username so now they can finally vote down!
                        console.log("upvoting restauraint")
                        downvoteSingleFilterWithParameter(filters[e].id)
                        updateServer()
                    }
                }
            }
        }

    }else{
        alert("YOU DONT HAVE A USERNAME")
    }
}

function upvoteSingleFilterWithParameter(filterID){
    upvoteFilter(document.getElementById(filterID))
}
function downvoteSingleFilterWithParameter(filterID){
    downvoteFilter(document.getElementById(filterID))
}

function upvoteSingleRestaurantWithParameter(restaurantID){
    console.log("upvoting single restaurant with parameter")
    upvoteRestaurant(document.getElementById(restaurantID))

}
function downvoteSingleRestaurantWithParameter(restaurantID){
    console.log("downvoting single restaurant with parameter")
    downvoteRestaurant(document.getElementById(restaurantID))
}
function upvoteRestaurant(restaurantToUpvote){
    for(i=0;i<numberOfRestaurants;i++){

        if(restaurantToUpvote.id == restaurantInfoMaster[i].id){
            restaurantInfoMaster[i].score = restaurantInfoMaster[i].score+1
            //goign to have to make this add/remove once we figure out limits
            restaurantInfoMaster[i].usernamesVotedUp = restaurantInfoMaster[i].usernamesVotedUp + "," + usernameField + ","

        }
    }
}
function downvoteRestaurant(restaurantToDownvote){
    for(i=0;i<numberOfRestaurants;i++){

        if(restaurantToDownvote.id == restaurantInfoMaster[i].id){
            restaurantInfoMaster[i].score = restaurantInfoMaster[i].score-1
            restaurantInfoMaster[i].usernamesVotedDown = restaurantInfoMaster[i].usernamesVotedDown + "," + usernameField + ","
        }
    }

}
function upvoteFilter(filterToUpvote){
    for(g=0;g<Object.keys(serverFilterScores).length;g++){
        if(filters[g].id==filterToUpvote.id){
            serverFilterScores[g] = serverFilterScores[g]+1
            serverFilterUsernamesUp[g] = serverFilterUsernamesUp[g] + "," + usernameField + ","
            console.log("updateOrder whuy is this repeating")
            filterToggledUpdateRestaurants(filterToUpvote.id, 1)
        }
    }

}
function downvoteFilter(filterToDownvote){
    for(h=0;h<Object.keys(serverFilterScores).length;h++){
        if(filters[h].id==filterToDownvote.id){
            serverFilterScores[h] = serverFilterScores[h]-1
            serverFilterUsernamesDown[h] = serverFilterUsernamesDown[h] + "," +usernameField + ","
            console.log("downvote whuy is this repeating")
            filterToggledUpdateRestaurants(filterToDownvote.id, -1)
        }
    }

}
function upvoteFilterAnonymous(filterToUpvote){
    for(g=0;g<Object.keys(serverFilterScores).length;g++){
        if(filters[g].id==filterToUpvote.id){
            serverFilterScores[g] = serverFilterScores[g]+1
            filterToggledUpdateRestaurants(filterToUpvote.id, 1)
        }
    }

}
function downvoteFilterAnonymous(filterToDownvote){
    for(h=0;h<Object.keys(serverFilterScores).length;h++){
        if(filters[h].id==filterToDownvote.id){
            serverFilterScores[h] = serverFilterScores[h]-1
            filterToggledUpdateRestaurants(filterToDownvote.id, -1)
        }
    }

}
function upvoteRestaurantAnonymous(restaurantToUpvote){
    for(i=0;i<numberOfRestaurants;i++){

        if(restaurantToUpvote.id == restaurantInfoMaster[i].id){
            restaurantInfoMaster[i].score = restaurantInfoMaster[i].score+1
        }
    }
}
function downvoteRestaurantAnonymous(restaurantToDownvote){
    for(i=0;i<numberOfRestaurants;i++){
        console.log(i)
        if(restaurantToDownvote.id == restaurantInfoMaster[i].id){
            console.log(restaurantInfoMaster[i].score)
            restaurantInfoMaster[i].score = restaurantInfoMaster[i].score-1
            console.log(restaurantInfoMaster[i].score)

        }
    }

}



function addSingleRestaurant(restaurantToAdd){
    restaurantToAdd.children[0].style.display = ""
    restaurantToAdd.classList.remove('fadeOutLeft');
    restaurantToAdd.removeAttribute('hidden', 'true');
    restaurantToAdd.classList.add('fadeInRight');
    $(restaurantToAdd).slideDown();


}


function activateButton(){
    //reroute to /phl/ then create group
    if(this.innerText == "Philadelphia"){
        generateNewGroup("PH")
    }
    if(this.innerText == "East Lansing"){
        generateNewGroup("EL")
    }
}


function checkForUpdate(){
    //every second we want it to check for the file and see if it's changed?



    $.ajax({
            url : "/alphaSort.php",
            type : "GET",
            data : {'title' : JSON.stringify(titleInDatabase)} ,
            success : function (json) {

               restaurantInfoMaster = JSON.parse(json['sortedDict'])
               //console.log(json['sortedFilter'])
               serverFilterScores = JSON.parse(json['sortedFilter'])
               //console.log(serverFilterScores)

               serverFilterUsernamesDown = JSON.parse(json['serverFilterUsernamesDown'])
               serverFilterUsernamesUp = JSON.parse(json['serverFilterUsernamesUp'])

               updateOrder()
            },
            error : function () {
                console.log("Error Ajax checking update");
            }
        })
}


function updateServer(){
    console.log(titleInDatabase)

     $.ajax({
            url : "/alphaUpdateServer.php",
            type : "GET",
            data : { 'values' : JSON.stringify(restaurantInfoMaster), 'title' : JSON.stringify(titleInDatabase), 'clientFilters': JSON.stringify(serverFilterScores), 'clientFilterUsernamesUp': JSON.stringify(serverFilterUsernamesUp), 'clientFilterUsernamesDown':JSON.stringify(serverFilterUsernamesDown)} ,
            success : function (json) {
               console.log(json)
               restaurantInfoMaster = json

               updateOrder()
            },
            error : function () {
                console.log("Error Ajax");
            }
        })

}

function activateFilter(){
    toggleFilter(this.innerText, true)
}

function updateOrder(){
    //console.log("update order")

    //For each link object, we need to check its text and set it to the proper link
    for (var i = 0; i < links.length; i++) {
        for(var x = 0; x < numberOfRestaurants; x++){
            //find the restaurant that this link should correspond to
            if(links[i].text == restaurantInfoMaster[x].title){
                links[i].href = restaurantInfoMaster[x].link
                links[i].innerHTML = href.replace('http://',"");

            }
        }
     }

     //set the tooltips for each of the restaurant voting buttons


     //set the tooltips for each of the filter voting buttons


    for(i=0;i<numberOfRestaurants;i++){

                if(restaurantContainer[i].id != restaurantInfoMaster[i].id){
                    console.log("different id's")
                    restaurantContainer[i].classList.remove('fadeInUp');
                    console.log(i)
                    restaurantContainer[i].classList.add('fadeOutUp');
                    fadeInUpRestaurant(restaurantContainer[i])


                }

                restaurantContainer[i].id = restaurantInfoMaster[i].id
                restaurantHeader[i].innerText = restaurantInfoMaster[i].title
                restaurantScore[i].innerText = restaurantInfoMaster[i].score
                restaurantID[i+1] = restaurantInfoMaster[i].id




                if(restaurantInfoMaster[i].usernamesVotedUp.includes(","+usernameField+",")){
                    document.getElementsByClassName("likeButtonRestaurants")[i].src = like2green
                    document.getElementsByClassName("dislikeButtonRestaurants")[i].src = dislike2grey
                }else if(restaurantInfoMaster[i].usernamesVotedDown.includes(","+usernameField+",")){
                    document.getElementsByClassName("dislikeButtonRestaurants")[i].src = dislike2red
                    document.getElementsByClassName("likeButtonRestaurants")[i].src = like2grey
                }else{
                    document.getElementsByClassName("likeButtonRestaurants")[i].src = like2grey
                    document.getElementsByClassName("dislikeButtonRestaurants")[i].src = dislike2grey
                }

                if(restaurantInfoMaster[i].usernamesVotedUp!="" || restaurantInfoMaster[i].usernamesVotedDown!=""){
                    var usersUpSplit
                    var usersDownSplit

                    var usersUpTool = ""
                    var usersDownTool = ""

                    usersDownSplit = (restaurantInfoMaster[i].usernamesVotedDown).split(',')
                    usersUpSplit = (restaurantInfoMaster[i].usernamesVotedUp).split(',')

                    for(z=0;z<usersDownSplit.length;z++){
                        usersDownTool = usersDownTool+usersDownSplit[z]
                    }
                    for(z=0;z<usersUpSplit.length;z++){
                        usersUpTool = usersUpTool+usersUpSplit[z]
                    }

                    document.getElementsByClassName("restElements")[i].setAttribute('tooltip', "\xa0 Upvotes: "+usersUpTool +"\xa0"+ "\n"+"\xa0 Downvotes: "+usersDownTool+ "\xa0")
                }else{
                    document.getElementsByClassName("restElements")[i].setAttribute('tooltip',"\xa0No votes yet\xa0")
                }

                //now we need to change the color to match the score
                //console.log(restElements[i].getAttribute)

                if(true){
                    if(restaurantInfoMaster[i].score == 0){
                        restaurantBoxes[i].style.background = "#FFFFFF"
                    }else if(restaurantInfoMaster[i].score > 0){

                        if(restaurantInfoMaster[i].score == 1){
                            restaurantBoxes[i].style.background = "#E3F7DD"
                        }else if(restaurantInfoMaster[i].score == 2){
                            restaurantBoxes[i].style.background = "#C7EFBC"
                        }else if(restaurantInfoMaster[i].score == 3){
                            restaurantBoxes[i].style.background = "#ABE89A"
                        }else if(restaurantInfoMaster[i].score == 4){
                            restaurantBoxes[i].style.background = "#8FE079"
                        }else if(restaurantInfoMaster[i].score == 5){
                            restaurantBoxes[i].style.background = "#74D958"
                        }else{
                            restaurantBoxes[i].style.background = "#5CAD46"
                        }

                    }else if(restaurantInfoMaster[i].score<0){
                        if(restaurantInfoMaster[i].score == -1){
                            restaurantBoxes[i].style.background = "#FED2D2"
                        }else if(restaurantInfoMaster[i].score == -2){
                            restaurantBoxes[i].style.background = "#FDA6A6"
                        }else if(restaurantInfoMaster[i].score == -3){
                            restaurantBoxes[i].style.background = "#FD7A7A"
                        }else if(restaurantInfoMaster[i].score == -4){
                            restaurantBoxes[i].style.background = "#FC4E4E"
                        }else if(restaurantInfoMaster[i].score == -5){
                            restaurantBoxes[i].style.background = "#FC2222"
                        }else{
                            restaurantBoxes[i].style.background = "#C91B1B"
                        }
                    }

                }





    }
    for(x=0;x<Object.keys(filters).length;x++){
        filterScores[x].innerText = serverFilterScores[x]

        if(serverFilterUsernamesUp[x].includes(","+usernameField+",")){
                    document.getElementsByClassName("likeButtonFilters")[x].src = like2green
                    document.getElementsByClassName("dislikeButtonFilters")[x].src = dislike2grey
                }else if(serverFilterUsernamesDown[x].includes(","+usernameField+",")){
                    document.getElementsByClassName("dislikeButtonFilters")[x].src = dislike2red
                    document.getElementsByClassName("likeButtonFilters")[x].src = like2grey
                }else{
                    document.getElementsByClassName("likeButtonFilters")[x].src = like2grey
                    document.getElementsByClassName("dislikeButtonFilters")[x].src = dislike2grey
        }


        if(serverFilterUsernamesUp[x] != "" || serverFilterUsernamesDown[x] != ""){
                    //need to make this into a string or figure out how i want to format the users that have voted



                    document.getElementsByClassName("filterElements")[x].setAttribute('tooltip', "\xa0 Upvotes: "+serverFilterUsernamesUp[x] +"\xa0"+ "\n"+"\xa0 Downvotes: "+serverFilterUsernamesDown[x]+ "\xa0")

                }else{
                    document.getElementsByClassName("filterElements")[x].setAttribute('tooltip',"No votes yet")
                }
    }
}

function filterToggledUpdateRestaurants(filterVotedID, deltaValue){
    //1. We need to find all restaurants that contain the attribute for this filter
    //2. We need to increase or decrease the value for each of these restaurants
    var tempFilterIndex;
    for(y=0;y<Object.keys(filters).length;y++){
        if(filters[y].id == filterVotedID){
            tempFilterIndex = y
            console.log(tempFilterIndex)
        }
    }


    for(m=0; m<numberOfRestaurants;m++){

                //create a string of all the tags
                var concatenatedString = "";

                for (var item in restaurantInfoMaster[m]){
                    concatenatedString = concatenatedString+restaurantInfoMaster[m][item]
                }
                //console.log(concatenatedString)


                //find all the restaurants to upvote or downvote, then do them all at once
                //then update the order
                if(filterVotedID == "$"){
                    if(concatenatedString.includes("price1")){
                        if(deltaValue == 1){
                            upvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }else if(deltaValue == -1){
                            downvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }
                        console.log("filter applies to:")
                        console.log(restaurantInfoMaster[m])
                    }

                }else if(filterVotedID == "$$"){
                    if(concatenatedString.includes("price2")){
                        if(deltaValue == 1){
                            upvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }else if(deltaValue == -1){
                            downvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }
                        console.log("filter applies to:")
                        console.log(restaurantInfoMaster[m])
                    }
                }else if(filterVotedID == "$$$"){
                    if(concatenatedString.includes("price3")){
                        if(deltaValue == 1){
                            upvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }else if(deltaValue == -1){
                            downvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }
                        console.log("filter applies to:")
                        console.log(restaurantInfoMaster[m])
                    }
                }else if(filterVotedID == "$$$$"){
                    if(concatenatedString.includes("price4")){
                        if(deltaValue == 1){
                            upvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }else if(deltaValue == -1){
                            downvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }
                        console.log("filter applies to:")
                        console.log(restaurantInfoMaster[m])
                    }
                }else{
                    if(concatenatedString.includes(filters[tempFilterIndex].id)){
                        if(deltaValue == 1){
                            upvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }else if(deltaValue == -1){
                            downvoteRestaurantAnonymous(document.getElementById(restaurantInfoMaster[m].id))
                        }
                        //the filter applies to this restaurant
                        console.log("filter applies to:")
                        console.log(restaurantInfoMaster[m])
                    }
               }
    }




}

function delayedRemoveRestaurant(vari, varx, num){
    console.log(num)
    setTimeout(function(){ removeRestaurant(document.getElementsByClassName("animated")[vari+1]) }, 75*num);


}


function removeRestaurant(restaurantToRemove){
    restaurantToRemove.classList.add('fadeOutLeft');
    restaurantToRemove.classList.remove('fadeInRight');
    $(restaurantToRemove).slideUp();



}



function convertToTF(array){
    var converted = [];
    for(x=0;x<array.length;x++){
        if(array[x]==true){
            converted.push('t')
        }else if(array[x]==false){
            converted.push('f')
        }
    }

    return converted;
}

function updateServerFilters(activeFilterClient, filterIndex){
    //this needs to change the server file to be equivalent to the activeFiltersClient
    //make an ajax request with
    //1. info of what changed on the client,
    //2. what title is in the database


    $.get('/updateServerFilters.php', {title: titleInDatabase, filterChanged: filterIndex, filterValue: activeFilterClient}, function(json_response){

            //filtersServer = json_response.user


    });

}

function updateClientFilters(){

    var itemIndex = 0;
    for (var item in filtersServer){

        if(item == "title"){
            //we have the title
        }else if(item == "manuallyDisabled"){
            //this is the manually disabled parameter

        }else{
            //we have a filter


            //now item and itemIndex match
            if((filtersServer[item] == 't') == filtersActive[itemIndex-1]){

            }else{
                toggleFilter(filters[itemIndex-1].innerText, false)
            }
        }

        itemIndex=itemIndex+1;
    }

}


function generateNewGroup(region){
    //make ajax request that returns the title and url, set our title to titleindatabase
    //redirect to the generated url

    $.get('/newGroup.php', {}, function(json_response){
            urlCode = json_response.urlString.url
            titleInDatabase=urlCode
            window.location.href = "https://shrouded-mesa-49267.herokuapp.com/group/"+region+"/?t="+urlCode;
    });


}


function initializeFilters(){
    //this funciton runs when the page is first loaded and just sets the score of
    //all the filters to 0/the inital values

    for(i=0; i<Object.keys(filterScores).length;i++){

        filterScores[i].innerText = serverFilterScores[i]
    }
}


function usernameSubmitted(){
    console.log("username subimtted")
    usernameField = document.getElementById("usernameField").value
    console.log(usernameField)
    if(usernameField == ""){
        //username is blank
        alert("Please enter a username")
    }else{
        //now we need to update the server and all that shit

        //need to also check if this username has already been created?
        usernameContainer.classList.remove('fadeInUp')
        usernameContainer.classList.add('fadeOutUp')
        $(usernameContainer).slideUp();

        usernameCreated = true;

    }
}


function fadeInUpRestaurant(restToFade){


    setTimeout(function(){ restToFade.classList.remove('fadeOutUp'); restToFade.classList.add('fadeInUp'); }, 0);


}
