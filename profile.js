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

        $("profileImage").src =
            user.profile_image;

    } else {

        $("profileImage").src =
            "https://via.placeholder.com/150";

    }

}


function goHome() {

    window.location.href = "index.html";

}