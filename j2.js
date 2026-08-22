console.log("JS FILE LOADED");

let postId = new URLSearchParams(window.location.search).get("id");

console.log("POST ID:", postId);

function $(id) {
    return document.getElementById(id);
}


 function addComment() {

    $("send").onclick = null;

    $("send").onclick =function(){

    let comment = $("writecomment").value;

    let token = localStorage.getItem("token");

    axios.post(
        `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
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

}
 };


function goBack() {

    let postId = new URLSearchParams(window.location.search).get("id");

    window.location.href = `index.html#post-${postId}`;
    
}



console.log("CALLING FILLPOST");

fillpost(postId);

function fillpost(postId) {
    

   axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)

        .then((response) => {

            const post = response.data.data;
            console.log(post.comments);
console.log(post.comments_count);
            console.log("POST:", post);
console.log("COMMENTS:", post.comments);
            

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

                
                $("postcontainer2").innerHTML += ` 
 
                        <div class="post-card2"> 
                    
                            <div class="post-header2"> 
                    
                                ${profilehtml} 
                    
                                <strong> 
                                    ${post.author.name} 
                                </strong> 
                    
                            </div> 
                    
                            ${imghtml} 
                    
                            <div class="post-content2"> 
                    
                                <div class="time2"> 
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
                    
                            <div class="comments2"> 
                    
                                <span>✎</span> 
                    
                                <span> 
                                    (${post.comments_count}) Comments 
                                </span> 
                    
                            </div> 






                            <div class="comments-list2" id="commentbody2">
                                
                            </div>

                            <div class="add-comment2">

                                <input id="writecomment" type="text" placeholder="Add your comment...">

                                <button id="send">send</button>

                            </div>

                            </div>
                            
                    `;
                    fillapioldcomments(post.comments);
                    addComment();
        });
}



function fillapioldcomments(allcomments) {
    
    for (let comment of allcomments) {

        let profilehtml = "";

        if (typeof comment.author.profile_image === "string") {

            profilehtml = `
                <div class="comment-avatar2">
                    <img src="${comment.author.profile_image}">
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

                <div class="comment-body2">
                    <strong>${comment.author.name}</strong>
                    <p>${comment.body}</p>
                </div>

            </div>
        `;
    }
}