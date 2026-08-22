
let curruntpage=1;
window.addEventListener("scroll",function(){
    const endofpage=window.innerHeight+window.pageYOffset>=document.body.offsetHeight;
    if(endofpage){
        curruntpage++;
        fillposts(curruntpage);
    }
})

function $(id) {
    return document.getElementById(id);
}


function fillposts(page=1) {

    return axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`)

        .then((response) => {

            const posts = response.data.data;

            //$("postcontainer").innerHTML = "";

            for (let post of posts) {

                let imghtml = "";

                if (typeof post.image === "string") {

                    imghtml = `
                        <img
                            class="post-image"
                            src="${post.image}"
                            alt="Post Image">
                    `;
                }

                let profilehtml = "";

                if (typeof post.author.profile_image === "string") {

                    profilehtml = `
                    <img
                        class="profile-image"
                        src="${post.author.profile_image}"
                        alt="Profile">
                `;
                }

                $("postcontainer").innerHTML += `

                    <div class="post-card" id="post-${post.id}">

                        <div class="post-header">

                            ${profilehtml}

                            <strong>
                                ${post.author.name}
                            </strong>

                        </div>

                        ${imghtml}

                        <div class="post-content">

                            <div class="time">
                                ${post.created_at}
                            </div>

                            <h3>
                                ${post.body}
                            </h3>

                            <p>
                                With supporting text below as a natural lead-in
                                to additional content.
                            </p>

                        </div>

                        <div class="comments" onclick="openComments(${post.id})">

                            <span >✎</span>

                            <span>
                                (${post.comments_count}) Comments
                            </span>

                        </div>

                    </div>
                `;
            }
        });
}
fillposts();


async function findPostAndScroll(postId) {

    let page = 1;

    while (true) {

        let post = document.getElementById(`post-${postId}`);

        // لقينا البوست
        if (post) {

            post.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            break;
        }

        // حمّل الصفحة التالية
        page++;

        await fillposts(page);

        // شوف هل الصفحة رجعت بوستات أصلاً
        let posts = document.querySelectorAll(".post-card");

        // لو مفيش بوستات جديدة، وقف
        if (posts.length === 0) {
            break;
        }
    }
}

let postId = window.location.hash.replace("#post-", "");

if (postId) {
    findPostAndScroll(postId);
} else {
    fillposts();
}





$("form-creatpost").onsubmit = function addposts(e) {

    e.preventDefault();
    $("creatnewpost").disabled = true;
    let body = $("body").value;
    let image = $("image").files[0];

    let token = localStorage.getItem("token");

    let formData = new FormData();

    formData.append("body", body);
    formData.append("image", image);

    axios.post(
        "https://tarmeezacademy.com/api/v1/posts",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
        .then(function (response) {
            showAlert2("post has been made successfully");

            $("form-creatpost").classList.remove("show");


            console.log("SUCCESS:", response.data);

            const post = response.data.data;

            let imghtml = "";

            if (typeof post.image === "string") {
                imghtml = `
                <img
                    class="post-image"
                    src="${post.image}"
                    alt="Post Image">
            `;
            }

            $("postcontainer").innerHTML += `
            <div class="post-card" id="post-${post.id}"  onclick="openComments(${post.id})">

                <div class="post-header">
                    <img src="${post.author.profile_image}">
                    <strong>${post.author.name}</strong>
                </div>

                ${imghtml}

                <div class="post-content">

                    <div class="time">
                        ${post.created_at}
                    </div>

                    <h3>
                        ${post.body}
                    </h3>

                </div>

                <span >✎</span>

            </div>
        `;

        })
        .catch(function (error) {

            let message = error.response.data.message;

            showAlert(message);
        });
};





function openComments(postId) {

    let token = localStorage.getItem("token");

    if (!token) {
        showAlert("You must login first");
        return;
    }

    window.location.href = `index2.html?id=${postId}`;
}






$("loginForm").onsubmit = function log_req(e) {
    let username = $("username").value;
    let password = $("password").value;
    e.preventDefault();
    axios.post(
        "https://tarmeezacademy.com/api/v1/login",

        {
            username: username,
            password: password

        }).then(function (response) {

            showAlert2("logedin succesfully");
            let token = response.data.token;
            localStorage.setItem("token", token);
            $("loginForm").classList.remove("show");
            $("register").classList.add("show");
            $("login").classList.add("show");
            $("logout").classList.add("show");
            $("addPost").classList.add("show");
            $("accinfo").classList.add("show");

            const user = response.data.user;
            localStorage.setItem("user", JSON.stringify(user));

            $("accinfo").innerHTML = `
            <div class="upperAvatar">
                <img src="${user.profile_image}">
            </div>

            <div class="name">
                ${user.username}
            </div>
        `;
        })

        .catch(function (error) {

            let message = error.response.data.message;

            showAlert(message);
        });

}


$("loginForm2").onsubmit = function logout_req(e) {

    let formData = new FormData();

    let username2 = $("username2").value;
    let password2 = $("password2").value;
    let name2 = $("name2").value;
    let email2 = $("email2").value;
    let image2 = $("image2").files[0];

    formData.append("username", username2);
    formData.append("password", password2);
    formData.append("name", name2);
    formData.append("email", email2);
    formData.append("image", image2);

    e.preventDefault();

   

    axios.post(
        "https://tarmeezacademy.com/api/v1/register",
        formData
    )
        .then(function (response) {

            let token = response.data.token;

            localStorage.setItem("token", token);

            console.log("ssssss");

            showAlert2("your account has been created");

            $("loginForm2").classList.remove("show");
            $("register").classList.add("show");
            $("login").classList.add("show");
            $("logout").classList.add("show");
            $("addPost").classList.add("show");
            $("accinfo").classList.add("show");

            const user = response.data.user;
            localStorage.setItem("user", JSON.stringify(user));

            let profilehtml = "";

            if (typeof user.profile_image === "string") {

                profilehtml = `
                <img
                    class="profile-image"
                    src="${user.profile_image}"
                    alt="Profile">
            `;
            }

            $("accinfo").innerHTML = `
            <div class="upperAvatar">
                ${profilehtml}
            </div>

            <div class="name">
                ${username2}
            </div>
        `;
        })

        .catch(function (error) {

            console.log("STATUS:", error.response.status);
            console.log("DATA:", error.response.data);

            let message = error.response.data.message;

            showAlert(message);
        });

}



$("logout").onclick = function VVV() {
    $("register").classList.remove("show");
    $("login").classList.remove("show");
    $("logout").classList.remove("show");
    $("addPost").classList.remove("show");
    $("accinfo").classList.remove("show");
}

function showAlert(message) {

    let alertBox = document.createElement("div");

    alertBox.classList.add("custom-alert");

    alertBox.innerText = message;

    document.body.appendChild(alertBox);

    setTimeout(function () {
        alertBox.remove();
    }, 3000);
}
function showAlert2(message) {

    let alertBox = document.createElement("div");

    alertBox.classList.add("custom-alert2");

    alertBox.innerText = message;

    document.body.appendChild(alertBox);

    setTimeout(function () {
        alertBox.remove();
    }, 3000);
}
$("addPost").onclick = function () {
    $("form-creatpost").classList.toggle("show");

}

$("login").addEventListener("click", function () {
    $("loginForm2").classList.remove("show");
    $("loginForm").classList.toggle("show");

});
$("register").addEventListener("click", function () {
    $("loginForm").classList.remove("show");
    $("loginForm2").classList.toggle("show");
});




function checkLogin() {

    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");

    if (token && user) {

        user = JSON.parse(user);

        $("register").classList.add("show");
        $("login").classList.add("show");
        $("logout").classList.add("show");
        $("addPost").classList.add("show");
        $("accinfo").classList.add("show");

        $("accinfo").innerHTML = `
            <div class="upperAvatar">
                <img src="${user.profile_image}">
            </div>

            <div class="name">
                ${user.username}
            </div>
        `;

    } else {

        $("register").classList.remove("show");
        $("login").classList.remove("show");
        $("logout").classList.remove("show");
        $("addPost").classList.remove("show");
        $("accinfo").classList.remove("show");
    }
}

checkLogin();