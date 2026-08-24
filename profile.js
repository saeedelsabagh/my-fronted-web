function $(id) {
    return document.getElementById(id);
}


let token = localStorage.getItem("token");
let user = localStorage.getItem("user");


if (!token || !user) {

    window.location.href = "index.html";

} else {

    user = JSON.parse(user);


    $("profileName").innerText =
        user.name || "No Name";


    $("profileUsername").innerText =
        "@" + (user.username || "");


    $("usernameInfo").innerText =
        user.username || "Not available";


    $("nameInfo").innerText =
        user.name || "Not available";


    $("emailInfo").innerText =
        user.email || "Not available";


    if (typeof user.profile_image === "string") {

        $("profileImage").src = user.profile_image;

    } else {

        $("profileImage").style.display = "none";

    }

}


function goHome() {

    window.location.href = "index.html";

}


function getuser_posts(user) {
    console.log(user);
    console.log(user.id);
    return axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}/posts`)

        .then((response) => {

            const posts = response.data.data;

            for (let post of posts) {

                let imghtml = "";

                if (typeof post.image === "string") {

                    imghtml = `
                        <img
                            class="post-image3"
                            src="${post.image}"
                            alt="Post Image">
                    `;
                }

                let profilehtml = "";

                if (typeof post.author.profile_image === "string") {

                    profilehtml = `
                    <img
                        class="profile-image3"
                        src="${post.author.profile_image}"
                        alt="Profile">
                `;
                }

                $("postcontainer3").innerHTML += `

                    <div class="post-card3" id="${post.id}">

                        <div class="post-header3">

                            ${profilehtml}

                            <strong>
                                ${post.author.name}
                            </strong>

                            <button onclick="editPost(${post.id})" id="update_post">update</button>
                            <button onclick="deletePost(${post.id})" id="delete_post"> Delete</button>
                        
                        </div>

                        ${imghtml}

                        <div class="post-content3">

                            <div class="time3">
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

                        <div class="comments3" onclick="openComments(${post.id})">

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
getuser_posts(user);


function editPost(postId) {
    localStorage.setItem("editPostId", postId);

    window.location.href = "index.html";
}


function deletePost(postId) {

    let token = localStorage.getItem("token");
    console.log("DELETE POST ID:", postId);

    axios.delete(
        `https://tarmeezacademy.com/api/v1/posts/${postId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
        .then(function (response) {

            console.log("DELETED:", response.data);

            // امسح البوست من الصفحة مباشرة
            let post = document.getElementById(postId);

            if (post) {
                post.remove();
                
            }
            window.location.reload();
        })
        .catch(function (error) {

            console.log(error.response);

        });
}