$('#postModal').on('shown.bs.modal', function () {
    $('#createPostBtn').trigger('focus')
}) 

 //! !!!!!!! for UI testing >>>>> remove this code 
 
 

$("#logoutBtn").click( function() {
    localStorage.clear();
    location.href = '/index.html';
});

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
            localStorage.setItem("followers", auth.user.followers);
            localStorage.setItem("following", auth.user.following);
            localStorage.setItem("hatts", auth.user.hatts);
            // window.location.href = '/index.html';
            populateHatts();
            populateFollowSection();
            getProfilePic();
            setFollowers();
            setFollowing();
            setHatts();
        } else {
            alert(auth.response);
        }
    })


//populating hatts section

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

async function populateHatts(){
    let recentHatts = '';
    let commentsPerHatt = new Map();
    let content = ''
    $.get('/api/getRecentHatts')
        .then(response => {
            recentHatts = response;
            // console.log(recentHatts);
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
                        // let day = moment(element.tweet_time);
                        // console.log(moment(element.tweet_time).startOf('day').fromNow());
                        content += `<div data-userid="${element.user_id}" class="card card-post">
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
                                <h5 class="card-title">${element.name}</h5>
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
                                <a class="image" href="" data-toggle="modal" data-target="#commentModal" id="commentsIcon">
                                    <img src="./assets/Chat.svg" width="25" height="25" class="d-inline-block align-top" alt="comment-bubble">
                                </a>
                                <div class="counter">
                                    <h5 id="commentsNum">${commentsPerHatt.get(element.id)?commentsPerHatt.get(element.id):0}</h5>
                                </div>
                            </div>
                            <div class="hattsOffContainer">
                                <a class="image" href="" id="hattsOffIcon">
                                    <img src="./assets/Heart-Empty.svg" width="25" height="25" class="d-inline-block align-top" alt="heart">
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
                })
        })

}

async function populateFollowSection(){
    $.get('/api/getTop5Followed')
    .then(result => {
        // console.log(result);
        let content = '';
            result.forEach(element=>{
            //     content += `<div class="card card-follow">
            //     <div class="card-body">
            //         <div class="row row-follow">
            //             <div class="col-8">
            //                 <h4 class="followAccount">${element.name}</h4>
            //             </div>
            //             <div class="col-4">
            //                 <button id="followBTn" data-id="${element.user}" data-name="${element.name}" type="submit"
            //                     class="btn btn-sm btn-secondary" onClick="follow(event);">Follow</button>
            //             </div>
            //         </div>
            //     </div>
            // </div>`

            content += `<div class="card card-follow">
            <div class="card-body">
                <div class="row row-follow-main">
                    <div class="followPicContainer col-4">
                        <div class="followPic"></div>
                    </div>
                    <div class="col-8">
                        <label class="followAccount">${element.name}</label>
                        <button id="followBTn" data-id="${element.user}" data-name="${element.name}" type="submit" class="btn btn-sm btn-secondary" onClick="follow(event);">Follow</button>
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
    const userId = localStorage.getItem('userId');
    console.log("u ", userId);
    const profileImage = await $.get(`/api/getProfilePic/${userId}`);
    console.log(profileImage);
        if(profileImage.response == 'OK') {
            //alert("call successful")
            //$("#profilePic").attr("src",profileImage.path); 
            document.getElementById("profilePic").style.backgroundImage = 'url('+profileImage.path+')';
            document.getElementById("profilePic").style.backgroundPosition = 'center';
        } else {
            alert(profileImage.response);
        }
}

function follow(event){
    // console.log('btn follow clicked');
    // console.log(event.target.dataset.id);
    postData = {
        user:localStorage.getItem('userId'),
        follower:event.target.dataset.id
    }
    // console.log(postData);
    $.post('/api/addFollower',postData)
    .then(result => {
        alert(`You are now following ${event.target.dataset.name}`);
    })
    .catch(error=>{
        alert('Error! Please try again later!')
    })
}
async function renderUserHatts(){
    // let userId = localStorage.getItem('userId');
    let userId=1;
    let getData = {
        user_id:userId
    }
    // console.log(getData);
    let commentsPerHatt = new Map();
    let result = await $.get('/api/getNoOfCommentsPerHatt');
    result.forEach(element => {
                        commentsPerHatt.set(element.hatt_id, element.num);
    })
    // console.log(commentsPerHatt);
    result = await $.post('/api/getUserHatts',getData);
    // console.log(result);
    let content = '';
    result.forEach(element=>{
        content += `<div class="card card-post card-delete">
            <div class="card-body">
                <div class="row">
                    <div class="postPicContainer col-lg-2 col-sm-12">
                        <div class="postPic"></div>
                    </div>
                    <div class="cardContent col-lg-10 col-sm-12">
                        <div class="row">
                            <div class="titleContainer">
                                <h5 class="card-title">${element.name}</h5>
                                <h6 class="timeSince">${moment(element.tweet_time).startOf('minute').fromNow()}</h6>
                            </div>
                        </div>
                        <div class="row row-content">
                            <p class="card-text">${element.text}</p>
                        </div>
                        <div class="row row-metrics">
                            <div class="commentsContainer">
                                <a class="image" href="" data-toggle="modal" data-target="#commentModal" id="commentsIcon">
                                    <img src="./assets/Chat.svg" width="25" height="25" class="d-inline-block align-top" alt="comment-bubble">
                                </a>
                                <div class="counter">
                                    <h5 id="commentsNum">${commentsPerHatt.get(element.id)?commentsPerHatt.get(element.id):0}</h5>
                                </div>
                            </div>
                            <div class="hattsOffContainer">
                                <a class="image" href="" id="hattsOffIcon">
                                    <img src="./assets/Heart-Empty.svg" width="25" height="25" class="d-inline-block align-top" alt="heart">
                                </a>
                                <div class="counter">
                                    <h5 id="hattsOffNum">25</h5>
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
    // console.log(content);
    $('#feedSectionWrapper').html('');
    $('#feedSectionWrapper').html(content);

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
}


// $(document).ready(function(){
//     if (localStorage.key('userId')){
//     $("#loginHeader").hide();
//     populateHatts();
//     populateFollowSection();
//     getProfilePic();
//     }
// })
// renderUserHatts();

$(document).ready(function() {
    $("#main").hide();
    console.log('test');
});