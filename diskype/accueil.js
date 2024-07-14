function valide(form) {
    var requete = new XMLHttpRequest();
        requete.open("POST",  "http://localhost:3000/user/register");
        requete.setRequestHeader("Content-Type", "application/json");
        let bruh = `{"email" : ${JSON.stringify(form.email.value)}, "password" : ${JSON.stringify(form.password.value)}}`
        requete.send(bruh)
        requete.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                let bruh = this.responseText.split(",")
                localStorage.setItem("userid", bruh[0].replace(/\s/g, ''))
                document.getElementById("form").style.animationName = "transition";
                setTimeout(function(){
                document.getElementById("form").style.display = "none";
                }, 250)
                document.getElementById("formu").style.display = "block";
                console.log(bruh[0].replace(/\s/g, ''))
            }
        }
    return false
}

function change(form) {
    console.log(URL.createObjectURL(form.files[0]))
    document.querySelector(".pp").style.backgroundImage = `url('${URL.createObjectURL(form.files[0])}')`
    document.querySelector(".solotetsouslo").style.color = "white"
    document.querySelector(".solotetsouslo").style.backgroundColor = "#0000005c"
}

function finish(form) {
    var requete = new XMLHttpRequest();
    let fd = new FormData();
    chngimg = document.querySelector(".pp")
    avtr = document.querySelector("#avatar")
    fd.append("id", localStorage.getItem("userid"))
    fd.append("pseudo", form.pseudo.value)
    fd.append("avatar", form.avatar.files[0])
        requete.open("POST",  "http://localhost:3000/user/register/finish");
        requete.send(fd)
        requete.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                document.location.href = "index.html";
            }
        }
    return false
}


function connect(form) {
    var requete = new XMLHttpRequest();
        requete.open("POST",  "http://localhost:3000/user/login");
        requete.setRequestHeader("Content-Type", "application/json");
        let bruh = `{"email" : ${JSON.stringify(form.email.value)}, "password" : ${JSON.stringify(form.password.value)}}`
        requete.send(bruh)
        requete.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                bruh = JSON.parse(this.responseText)
                localStorage.setItem("pseudo", bruh.pseudo)
                localStorage.setItem("userid", bruh.userid)
                document.location.href = "index.html";
            }
            if (this.readyState == XMLHttpRequest.DONE && this.status == 401) {
                var response = JSON.parse(this.responseText)
                //animation css pr montrer l'erreur
            }
        }
        return false
}
