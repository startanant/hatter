
$("#logoutBtn").click( function() {
    localStorage.clear();
    location.href = '/index.html';
});

$("#searchBtn").click(async function(event){
    //alert("search");
    event.preventDefault();
    const searchTerm = $('#searchBar').val();
    //alert(searchTerm);

    const search = await $.post("/api/search", {searchTerm})
    console.log(search);
    if (search.response == 'OK') {
        //console.log('search ok');
        renderSearchResults(search.searchResults)
    } else {
        console.log('search not found');
        console.log(search.response);
        let content = '';
        content += `<div id="noHatts" class="card card-body card-noHatts">
            <div class="row row-noHatts">
            <div class="noHatts-heading col-7">No results found for search term "${searchTerm}".</div>
            <div class="noHatts-button col-5">
                 <button type="button" id="createPostBtn" data-toggle="modal" data-target="#postModal" class="btn btn-sm btn-primary">Create Hatt</button>
            </div>
            </div>
            </div>`;
        $('#feedSectionWrapper').html('');
        $('#feedSectionWrapper').html(content);
    }
});

$("#searchBtnMobile").click(async function(event){
    //alert("search");
    event.preventDefault();
    const searchTerm = $('#searchBarMobile').val();
    //alert(searchTerm);

    const search = await $.post("/api/search", {searchTerm})
    console.log(search);
    if (search.response == 'OK') {
        //console.log('search ok');
        renderSearchResults(search.searchResults)
    } else {
        console.log('search not found');
        console.log(search.response);
        let content = '';
        content += `<div id="noHatts" class="card card-body card-noHatts">
            <div class="row row-noHatts">
            <div class="noHatts-heading col-7">No results found for search term "${searchTerm}".</div>
            <div class="noHatts-button col-5">
                 <button type="button" id="createPostBtn" data-toggle="modal" data-target="#postModal" class="btn btn-sm btn-primary">Create Hatt</button>
            </div>
            </div>
            </div>`;
        $('#feedSectionWrapper').html('');
        $('#feedSectionWrapper').html(content);
    }
});

// for mobile view
$('#viewProfileBtn').click( function(event){
    event.preventDefault();
    $('#section-profile').show();  
});

$('#closeBtn').click( function(event){
    event.preventDefault();
    $('#section-profile').hide(); 
});

function renderSearchResults(hatts) {
    //alert("rendering search results");
    let content = '';
    hatts.forEach(element => {
        // console.log(element.hatt_id);
        // console.log(commentsPerHatt.get(element.hatt_id));
        // let day = moment(element.tweet_time);
        // console.log(moment(element.tweet_time).startOf('day').fromNow());
        content += `<div data-userid="${element.user_id}" data-hattid="${element.id}" class="card card-post">
        <div class="card-body">
            <div class="row">
                <!-- hatt starts picture -->
                <div class="postPicContainer col-lg-2 col-sm-12">
                    <div class="postPic"></div>
                </div>
                <!-- pciture ends -->
                <!-- hatt contents -->
                <div class="cardContent col-lg-10 col-sm-12">
                    <div class="row">
                        <div class="titleContainer">
                            <h5 class="card-title"><a href="/${element.username}">${element.username}</a></h5>
                            <h6 class="timeSince">${moment(element.tweet_time).startOf('minute').fromNow()}</h6>
                        </div>
                    </div>
                    <div class="row">
                        <div class="card-text">
                        <p>${element.text}</p>
                        </div>
                    </div>
                    
                    <div class="row row-metrics">
                        <div class="commentsContainer">
                            <a onclick="updateModal(event)" data-hattid=${element.id} data-user_id=${element.user_id} data-username=${element.username} class="image" href="" data-toggle="modal" data-target="#commentModal" id="commentsIcon">
                                <img data-username="${element.username}" data-userid="${element.user_id}" data-hattid="${element.id}" src="./assets/svg/Chat.svg" width="25" height="25" class="d-inline-block align-top" alt="comment-bubble">
                            </a>
                            <div class="counter">
                                <h5 id="commentsNum">${element.comments}</h5>
                            </div>
                        </div>
                        <div class="hattsOffContainer">
                            <a class="image" href="" id="hattsOffIcon">
                                <img src="./assets/svg/Heart-Empty.svg" width="25" height="25" class="d-inline-block align-top" alt="heart">
                            </a>
                            <div class="counter">
                                <h5 id="hattsOffNum">25</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    });
    // console.log(content);
    $('#feedSectionWrapper').html('');
    $('#feedSectionWrapper').html(content);

    
}

$("#loginBtn").click(async function(event){
        event.preventDefault();
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        const loginInfo = {
            email: email,
            password: password
        };

        const auth = await $.post("/api/auth", loginInfo);
        if(auth.response == 'OK') {
            // alert("login successful")
            $("#loginHeader").hide();
            $("#welcome").hide();
            $("#main").show();
            console.log(auth.user.id);
            localStorage.setItem("userId", auth.user.id);
            localStorage.setItem("username", auth.user.name);
            localStorage.setItem("email", auth.user.email);
            localStorage.setItem("followers", auth.user.followers);
            localStorage.setItem("following", auth.user.following);
            localStorage.setItem("hatts", auth.user.hatts);
            localStorage.setItem("location", auth.user.location);
            localStorage.setItem("currentProfile", auth.user.id);
            // window.location.href = '/index.html';
            populateHatts();
            populateFollowSection();
            getProfilePic();
            setFollowers();
            setFollowing();
            setHatts();
            setUsername();
            setLocation();
        } else {
            alert(auth.response);
        }
    })

window.onload = function() {
    updateLocalStorage();
    renderStart();
};

async function updateLocalStorage(){
    const email = localStorage.getItem('email');
    const update = await $.post("/api/update", {email});
    console.log(update);
    if(update.response == 'OK') {
        // alert("login successful")
        $("#loginHeader").hide();
        $("#welcome").hide();
        $("#main").show();
        console.log(update.user.id);
        //localStorage.setItem("userId", update.user.id);
        localStorage.setItem("username", update.user.name);
        localStorage.setItem("email", update.user.email);
        localStorage.setItem("followers", update.user.followers);
        localStorage.setItem("following", update.user.following);
        localStorage.setItem("hatts", update.user.hatts);
        localStorage.setItem("location", update.user.location);
        // window.location.href = '/index.html';
        //populateHatts();
        //populateFollowSection();
        getProfilePic();
        setFollowers();
        setFollowing();
        setHatts();
        setUsername();
        setLocation();
    } else {
        alert(auth.response);
    }

}

//populating hatts section

function setUsername() {
    const username = localStorage.getItem('username');
    document.getElementById('username').innerHTML = `<h2>${username}</h2>`;
}

function setFollowers() {
    const followers = localStorage.getItem('followers');
    document.getElementById('followersNum').innerHTML = followers;
}

function setFollowing() {
    const following = localStorage.getItem('following');
    document.getElementById('followingNum').innerHTML = following;
}
function setHatts(){
    const hatts = localStorage.getItem('hatts');
    document.getElementById('hattsSentNum').innerHTML = hatts;
}
function setLocation(){
    const location = localStorage.getItem('location');
    if(location != null) {
        document.getElementById('location').innerHTML = `<h4>${location}</h4>`;
    }
}
async function showComments(event){
    // console.log(event.target);
    if (event.target.id == 53){
        // console.log(event.target.dataset.hattid);
        const postData = {
            id:event.target.dataset.hattid
        }
        const resultSingle = await $.post('/api/getSingleHatt',postData);
        // console.log(resultSingle);
        const result = await $.post('/api/getComments',postData);
        // console.log(result);
        if (result.length > 0){
        let contentMain = `<!-- comment card -->
        <div class="card card-post card-comment">
            <div class="card-body">
                <div class="row">
                    <!-- hatt starts picture -->
                    <div class="postPicContainer col-lg-2 col-sm-12">
                        <div class="postPic" style="background-image:url('${resultSingle[0].picture_path}');background-size:cover;"></div>
                    </div>
                    <!-- pciture ends -->
                    <!-- hatt contents -->
                    <div class="cardContent col-lg-10 col-sm-12">
                        <div class="row">
                            <div class="titleContainer">
                                <h5 class="card-title"><a href="${resultSingle[0].name}">${resultSingle[0].name}</a></h5>
                                <h6 class="timeSince">${moment(resultSingle[0].tweet_time).startOf('minute').fromNow()}</h6>
                            </div>
                        </div>
                        <div class="row row-content">
                            <p class="card-text">${resultSingle[0].text}</p>
                        </div>
                        <div class="row row-metrics">
                            <div class="commentsContainer">
                                <a class="image" href="" data-toggle="modal" data-target="#commentModal" id="commentsIcon">
                                    <img src="./assets/svg/Chat.svg" width="25" height="25" class="d-inline-block align-top" alt="comment-bubble">
                                </a>
                                <div class="counter">
                                    <h5 id="commentsNum">${result.length}</h5>
                                </div>
                            </div>
                            <div class="hattsOffContainer">
                                <a class="image" href="" id="hattsOffIcon" onclick="hattLike(event,${resultSingle[0].id});return false;">
                                    <img data-currentlike=${resultSingle[0].likecount?resultSingle[0].likecount:0} data-clicked=false src="./assets/svg/Heart-Empty.svg" width="25" height="25" class="d-inline-block align-top" alt="heart">
                                </a>
                                <div class="counter">
                                    <h5 id="hattsOffNum">${resultSingle[0].likecount?resultSingle[0].likecount:0}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><div class="commentsSection-container">`;
            let content = '';
        result.forEach(element =>{
            content += `
                
                    <div class="commentPost">
                        <div class="row row-comment-header">
                            <div class="poster-username"><a href="${element.name}">${element.name}</a></div>
                            <div class="timeSince timeSince-comment">${moment(element.comment_time).startOf('minute').fromNow()}</div>
                        </div>
                        <div class="comment-text">
                            ${element.comment}
                        </div>
                    </div>

            `
        })
        $('#feedSectionWrapper').html('');
        $('#feedSectionWrapper').html(contentMain+content + "</div>");
        }

        
    }
    // console.log(event.target.id);
    // console.log(event.target.dataset.id);
}
async function populateHatts(){
    let recentHatts = '';
    let commentsPerHatt = new Map();
    let content = ''
    $.get('/api/getRecentHatts')
        .then(response => {
            recentHatts = response;
            console.log(recentHatts);
            $.get('/api/getNoOfCommentsPerHatt')
                .then(result => {
                    // console.log(result);
                    result.forEach(element => {
                        commentsPerHatt.set(element.hatt_id, element.num);
                    });
                    // console.log(recentHatts);
                    // console.log(commentsPerHatt.get(1));
                    recentHatts.forEach(element => {
                        // console.log(element.hatt_id);
                        // console.log(commentsPerHatt.get(element.hatt_id));
                        content += `<div onclick="showComments(event);" data-userid="${element.user_id}" data-hattid="${element.id}" class="card card-post">
            <div class="card-body">
                <div class="row" data-userid="${element.user_id}" data-hattid="${element.id}">
                    <!-- hatt starts picture -->
                    <div class="postPicContainer col-lg-2 col-sm-12">
                         <div class="postPic" style="background-image:url('${element.picture_path}');background-size:cover;" data-userid="${element.user_id}"></div>
                         <!-- <img src="${element.picture_path}" style="height:20px;width:20px"> -->
                        
                    </div>
                    <!-- pciture ends -->
                    <!-- hatt contents -->
                    <div class="cardContent col-lg-10 col-sm-12">
                        <div class="row">
                            <div class="titleContainer">
                                <h5 class="card-title"><a href="/${element.name}">${element.name}</a></h5>
                                <h6 class="timeSince">${moment(element.tweet_time).startOf('minute').fromNow()}</h6>
                            </div>
                        </div>
                        <div class="row" id="53" data-userid="${element.user_id}" data-hattid="${element.id}">
                            <div class="card-text">
                            <p>${element.text}</p>
                            </div>
                        </div>
                        
                        <div class="row row-metrics">
                            <div class="commentsContainer">
                                <a onclick="updateModal(event)" data-hattid=${element.id} data-user_id=${element.user_id} data-username=${element.name} class="image" href="" data-toggle="modal" data-target="#commentModal" id="commentsIcon">
                                    <img data-username="${element.name}" data-userid="${element.user_id}" data-hattid="${element.id}" src="./assets/svg/Chat.svg" width="25" height="25" class="d-inline-block align-top" alt="comment-bubble">
                                </a>
                                <div class="counter">
                                    <h5 id="commentsNum">${commentsPerHatt.get(element.id)?commentsPerHatt.get(element.id):0}</h5>
                                </div>
                            </div>
                            <div class="hattsOffContainer">
                                <a class="image" href="" id="hattsOffIcon" onclick="hattLike(event,${element.id});return false;">
                                    <img data-currentLike=${element.likecount?element.likecount:0} data-clicked=false src="./assets/svg/Heart-Empty.svg" width="25" height="25" class="d-inline-block align-top" alt="heart">
                                </a>
                                <div class="counter">
                                    <h5 id="hattsOffNum" data-likeCount="0">${element.likecount?element.likecount:0}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
                    });
                    // console.log(content);
                    $('#feedSectionWrapper').html('');
                    $('#feedSectionWrapper').html(content);
                })
        })

}

async function hattLike(...args){
    // console.log(args);
    // let currentLike = args[0].dataset.currentlike;
    // let hatt_id = args[1];
    const postData = {
        count:Number(args[0].target.dataset.currentlike)+1,
        hatt_id:args[1]
    }
    // console.log(postData);
    const result = await $.post('/api/updateLikeCount',postData);
    renderStart();
    // console.log(count);

}
function updateModal(event){
    // console.log(event.target.dataset);
    $('#postModalBtnComment').data("hattid",event.target.dataset.hattid);
    $('#postModalBtnComment').data("userid",event.target.dataset.user_id);
    $('#commentTo').text(`@${event.target.dataset.username}`);
    $('#postFormComment').val('')

}
async function populateFollowSection(){
    $.get('/api/getTop5Followed')
    .then(result => {
        // console.log('result for top10 followed',result);
        let content = '';
            result.forEach(element=>{
            content += `<div class="card card-follow">
            <div class="card-body">
                <div class="row row-follow-main">
                    <div class="followPicContainer col-3">
                        <div class="followPic" style="background-image:url('${element.picture_path}');background-size:cover;"></div>
                    </div>
                    <div class="follow-card-body col-9">
                        <h5 class="followAccount">${element.name}</h5>
                        <button id="followBtn"data-id="${element.user}"data-name="${element.name}"class="btn btn-primary btn-sm"onClick="follow(event);">follow</button>
                    </div>
                </div>
            </div>
        </div>`
            })
            $('#followSection').html('');
            $('#followSection').html(content)

    })
    .catch(error => {
        console.log(error);
    })
}

async function getProfilePic() {
    const userId = localStorage.getItem('currentProfile');
    // console.log("u ", userId);
    const profileImage = await $.get(`/api/getProfilePic/${userId}`);
    // console.log(profileImage);
        if(profileImage.response == 'OK') {
            //alert("call successful")
            //$("#profilePic").attr("src",profileImage.path); 
            document.getElementById("profilePic").style.backgroundImage = 'url('+profileImage.path+')';
            document.getElementById("profilePic").style.backgroundPosition = 'center';
            document.getElementById("profilePic").style.backgroundSize = 'cover';
        } else {
            alert(profileImage.response);
        }
}


function follow(event){
    // console.log('btn follow clicked');
    // console.log(event.target.dataset.id);
    postData = {
        user:event.target.dataset.id,
        follower:localStorage.getItem('userId')
    }
    // console.log(postData);
    $.post('/api/addFollower',postData)
    .then(result => {
        updateLocalStorage();
        alertBoxFollowing(event.target.dataset.name);
    })
    .catch(error=>{
        alert('Error! Please try again later!')
    })
}

function alertBoxFollowing(name){
    $('#alertBox').html(`<div class="alert alert-primary alert-dismissible fade show" role="alert">
    Following ${name}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
    $('#alertBox').show();
    setTimeout(function(){
    $('#alertBox').hide()}, 2000)
}


async function renderUserHatts(){
    let getData = {
        user_id:localStorage.getItem('userId')
    }
    // console.log(getData);
    let commentsPerHatt = new Map();
    let result = await $.get('/api/getNoOfCommentsPerHatt');
    // console.log(result);
    result.forEach(element => {
                        commentsPerHatt.set(element.hatt_id, element.num);
    })
    // console.log(commentsPerHatt);
    result = await $.post('/api/getUserHatts',getData);
    // console.log(result);
    if (result.length === 0){
        console.log('no user hats to display!');
        let content = `<div id="noHatts" class="card card-body card-noHatts">
        <div class="row row-noHatts">
            <div class="noHatts-heading col-7">You have not created any Hatts yet.</div>
            <div class="noHatts-button col-5">
                 <button type="button" id="createPostBtn" data-toggle="modal" data-target="#postModal" class="btn btn-sm btn-primary">Create Hatt</button>
            </div>
        </div>
     </div>`;
        $('#feedSectionWrapper').html('');
        $('#feedSectionWrapper').html(content);
        return;
    } else {
    let content = '';
    result.forEach(element=>{
        content += `<div onclick="showComments(event);" class="card card-post card-delete">
            <div class="card-body">
                <div  class="row" data-hattid="${element.id}" id="53">
                    <div class="postPicContainer col-lg-2 col-sm-12">
                        <div class="postPic" style="background-image:url('${element.picture_path}');background-size:cover;" data-userid="${element.user_id}"></div>
                    </div>
                    <div class="cardContent col-lg-10 col-sm-12">
                        <div class="row" data-hattid="${element.id}" id="53">
                            <div class="titleContainer">
                                <h5 class="card-title"><a href="${element.name}">${element.name}</a></h5>
                                <h6 class="timeSince">${moment(element.tweet_time).startOf('minute').fromNow()}</h6>
                            </div>
                        </div>
                        <div  class="row  row-content" data-hattid="${element.id}" id="53">
                            <p class="card-text">${element.text}</p>
                        </div>
                        <div class="row row-metrics">
                            <div class="commentsContainer">
                                <a onclick="updateModal(event)" class="image" href="" data-toggle="modal" data-target="#commentModal" id="commentsIcon">
                                    <img data-username="${element.name}" data-userid="${element.user_id}" data-hattid="${element.id}"  src="./assets/svg/Chat.svg" width="25" height="25" class="d-inline-block align-top" alt="comment-bubble">
                                </a>
                                <div class="counter">
                                    <h5 id="commentsNum">${commentsPerHatt.get(element.id)?commentsPerHatt.get(element.id):0}</h5>
                                </div>
                            </div>
                            <div class="hattsOffContainer">
                                <a class="image" href="" id="hattsOffIcon" onclick="hattLike(event,${element.id});return false;">
                                    <img data-currentLike=${element.likecount?element.likecount:0} data-clicked=false src="./assets/svg/Heart-Empty.svg" width="25" height="25" class="d-inline-block align-top" alt="heart">
                                </a>
                                <div class="counter">
                                    <h5 id="hattsOffNum" data-likeCount="0">${element.likecount?element.likecount:0}</h5>
                                </div>
                            </div>
                        </div>
                        <div class="row row-delete">
                            <button onclick="deleteHatt(event)" data-hattId="${element.id}"  id="deleteBtn" type="button" class="btn btn-outline-dark btn-sm">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    })
    $('#feedSectionWrapper').html('');
    $('#feedSectionWrapper').html(content);

}
    
    
    

}
async function deleteHatt(event){
    let hattid = event.target.dataset.hattid;
    let deleteData = {
        id:hattid
    }
    // console.log(deleteData);
    let result = await $.ajax({
        url:'/api/deleteHatt',
        type:'DELETE',
        data:deleteData});
    renderUserHatts();
    alertBoxDelete();
}

function alertBoxDelete(){
    $('#alertBox').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
    Deleted Post!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
    $('#alertBox').show();
    setTimeout(function(){
    $('#alertBox').hide()}, 2000)
}

function boldHashTag(text){
    let indexStart = text.indexOf('#');
    if ( indexStart != -1){
        let indexEnd = text.indexOf(' ',indexStart);
        if (indexEnd != -1) {
            // console.log('found string to bold it!');
            let toReplace = text.substring(indexStart,indexEnd);
            text = text.replace(toReplace,`<b>${toReplace}</b>`);
        }
    }
    return text;
}

async function createHatt(event){
    // console.log('create hatt clicked');
    // console.log($('#postForm').val());
    // console.log(localStorage.getItem('userId'));
    let postData = {
        user_id:localStorage.getItem('userId'),
        text:boldHashTag($('#postForm').val())
    }
    
    
    // console.log(postData);
    const result = await $.post('/api/addHatt',postData);
    // console.log(result);
    updateLocalStorage();
    // window.location.href = '/index.html';
    renderStart();
    alertBoxCreatePost();
    // $('#postForm')
}

function alertBoxCreatePost(){
    $('#alertBox').html(`<div class="alert alert-primary alert-dismissible fade show" role="alert">
    New hatt posted!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
    $('#alertBox').show();
    setTimeout(function(){
    $('#alertBox').hide()}, 2000)
}

async function createComment2(){
    console.log('create comment button clicked!');
    const postData = {
        user_id:localStorage.getItem('userId'),
        hatt_id:$('#postModalBtnComment').data("hattid"),
        comment:$('#postFormComment').val()
    }
    
    // console.log(postData);
    const result = await $.post('/api/addComment',postData);
    // window.location.href = '/index.html';
    renderStart();
    alertBoxComment();
}

function alertBoxComment(){
    $('#alertBox').html(`<div class="alert alert-primary alert-dismissible fade show" role="alert">
    New comment added!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
    $('#alertBox').show();
    setTimeout(function(){
    $('#alertBox').hide()}, 2000)
}

async function renderStart(){
    if (localStorage.key('userId')){
        console.log('key exists!');
        $("#loginHeader").hide();
        $("#welcome").hide();
        $("#main").show();
        populateHatts();
        populateFollowSection();
        getProfilePic();
        setFollowers();
        setFollowing();
        setHatts();
        setLocation();
        // getProfilePic2();
    } else {
        $("#main").hide();
    }
}

$(document).ready(async function() {

    const pathname = window.location.pathname;
    if(pathname.length > 1) {
        let username = pathname.substr(1);
        (async (username) => {
            //alert(username);
            const getUserProfile = await $.post('/api/username', {username});
            //console.log("hey", getUserProfile);
            if(getUserProfile.response == 'OK') {
                localStorage.setItem('email', getUserProfile.email);
                updateLocalStorage();
                localStorage.setItem('currentProfile', getUserProfile.id);
                renderStart();
            }
        })(username);
    } else {
        renderStart();
    }

    
    // console.log('test');
});