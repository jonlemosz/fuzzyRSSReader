var showLoginModal = function()
{
    Ply.factory('login', function (options, data, resolve) {
    options.flags = {
      closeBtn: false,
      closeByEsc: true,
      closeByOverlay: true,
      visibleOverlayInStack: true
    };

    options.onaction = function (ui) {
      var data = ui.data;
      console.log(ui.data);
      
    };

    // Use base factory
    Ply.factory.use('base', options, {
      title: 'Login',
      form: {
        email: 'E-mail',
        password: { hint: 'Password', type: 'password' }
      },
      ok: 'Enter',
      cancel: false
    }, resolve);
  });
  Ply.dialog('login').done(function (ui) {
    Ply.dialog('alert', 'Bingo!');
  });
}

var theUser = "test";
var allSubs = null;
var postObjList = null;
var debug = null;

var aSubSelected = function(index){
  var list = document.getElementById("myFeedList").getElementsByClassName("listItem")
  for(var i = 0; i < list.length; i++){
    if(i == index){
      list[i].style.color = "red";
      list[i].style.backgroundColor= "white";
    }
    else{
      list[i].style.color = "";
      list[i].style.backgroundColor= "";
    }
  }
  var link = allSubs[index].link;
  var url = "./getAllPosts?link=" + link;
  loadURL(url, function(data){
    var title = JSON.parse(data).feed.title.label;
    postObjList = JSON.parse(data).feed.entry;
    var markUp = "<h1>" + title + "</h1>";
    for (var i = 0; i < postObjList.length; i++){
        var aPost = postObjList[i];
        markUp += "<a href='javascript:aPostSelected(" + i + ")' class='listItem'>" + aPost.title.label +" </a>";
    }
    document.getElementById("currFeedWrapper").innerHTML = markUp;
  });
}

var aPostSelected = function(index){
  var list = document.getElementById("currFeedWrapper").getElementsByClassName("listItem")
  for(var i = 0; i < list.length; i++){
    if(i == index){
      list[i].style.color = "red";
      list[i].style.backgroundColor= "white";
    }
    else{
      list[i].style.color = "";
      list[i].style.backgroundColor= "";
    }
  }
  var postObj = postObjList[index]
  var markUp = "";
  markUp += "<h1>" + postObj.title.label + "</h1>";
  markUp += "<h2>" + postObj["im:artist"].label + "</h1>";
  markUp += "<img src='" + postObj["im:image"][0].label + "'>"
  var price = postObj["im:price"].label;
  if(price.toLowerCase() === "get") price = "$0.00";
  markUp += "<i>" + price  + "</i>";

  document.getElementById("selFeedWrapper").innerHTML = markUp;
}


var startUp = function(){
  //showLoginModal();
  loadMySubs();
}

var addFeed = function()
{
  var link = prompt("Add New Feed URL (json)");
  if(link == null) return;
  var url = "./addOrEditSub?user=" + theUser;
  url += "&link=" + encodeURIComponent(link);
  url += "&date=" + new Date().getTime();
  url += "&id=" + theUser + new Date().getTime();
  loadURL(url, function(data){
    loadMySubs();
  });
}

var loadMySubs = function()
{
  var url = "./listSubs?user=" + theUser;
  loadURL(url, function(data){
    var mySubs = JSON.parse(data);

    if(mySubs.length == 0){
      document.getElementById("myFeedList").innerHTML = "No subscriptions";
    }
    else{
      var markUp = "";
      for (var i = 0; i < mySubs.length; i++){
        var aFeed = mySubs[i];
        markUp += "<a href='javascript:aSubSelected(" + i + ")' class='listItem'>" + aFeed.id + " : " + aFeed.link +" </a>";
      }
      document.getElementById("myFeedList").innerHTML = markUp;
    }
  });
}