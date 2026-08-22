function $(id) {
    return document.getElementById(id);
}


$("send").onclick = function addComment() {

    let comment = $("writecomment").value;

    let token = localStorage.getItem("token");

    axios.post(
        "https://tarmeezacademy.com/api/v1/posts/2/comments",
        {
            body: comment
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then(function (response) {

        console.log(response.data);

        const commentData = response.data.data;
        
         let profilehtml = "";

        if (typeof commentData.author.profile_image === "string") {

            profilehtml = `
                <div class="comment-avatar2">
                    <img src="${commentData.author.profile_image}">
                </div>
            `;

        } else {

            profilehtml = `
                <div class="comment-avatar2">
                    👨
                </div>
            `;
        }
       
        $("commentbody2").innerHTML += `
                <div class="comment2">
                    
                    ${profilehtml}

                    <div class="comment-body2" >
                        <strong>${commentData.author.name}</strong>
                        <p>${commentData.body}</p>
                    </div>
                </div>
                `;

        $("writecomment").value = "";

    })
    .catch(function (error) {

        console.log(error.response.data);

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

function goBack() {
    let postId = new URLSearchParams(window.location.search).get("id");

    window.location.href = `index.html#post-${postId}`;
}