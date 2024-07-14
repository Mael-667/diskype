//utiliser e.target (check google si besoin)

var last = null;

var userid = localStorage.getItem("userid")
console.log(userid)

if(userid == null)
    {
        document.location.href = "accueil.html";
    }

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

var usrpp = new XMLHttpRequest();
usrpp.open("POST",  "http://localhost:3000/user/info");
usrpp.setRequestHeader("Content-Type", "application/json");
usrpp.send(`{"id" : ${JSON.stringify(userid)}}`);
usrpp.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        let avtr = document.querySelectorAll(".avatarent")
        avtr.forEach(function(src) {
            src.src = response.avatar
        })
        document.querySelector(".pseudoent").textContent = response.pseudo
        document.querySelector("#pseud").placeholder = response.pseudo
    }
}

var loademote = new XMLHttpRequest();
loademote.open("POST",  "http://localhost:3000/emotent");
loademote.send('bruh')
loademote.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let emotes = JSON.parse(this.responseText)
        console.log(emotes[1])
        let conteneur = document.querySelector(".nosemotes")
        for(let i = 0; i < emotes.length; i++) {
            let emotent = document.createElement("span")
            emotent.innerHTML = `<img src="emote/${emotes[i].nom}" alt="" class="emote">`
            emotent.addEventListener("click", function(e){
                console.log(e.target)
                document.querySelector("#test").innerHTML += `<img src="${e.target.src}" alt="${emotes[i].nom.slice(0, -4)}" class="prevemote">`
            })
            conteneur.appendChild(emotent)
        }

    }
}

let icn = document.querySelector('.icn')
icn.addEventListener('click', function(e) {
    document.querySelector('.poped').style.display = "block"
})

let poped = document.querySelector('.poped')
poped.addEventListener('click', function(e) {
    document.querySelector('.poped').style.display = "none"
})

let edt = document.querySelector('.edit')
edt.addEventListener('click', function(e) {
    e.stopPropagation();
})


function change(form) {
    console.log(URL.createObjectURL(form.files[0]))
    document.querySelector("#editedaya").src = `${URL.createObjectURL(form.files[0])}`

}

function edit(form) {
    var requete = new XMLHttpRequest();
    let fd = new FormData();
    fd.append("edit", "edit")
    fd.append("id", localStorage.getItem("userid"))
    fd.append("pseudo", form.pseud.value)
    fd.append("avatar", form.avatar.files[0])
    console.log(fd)
        requete.open("POST",  "http://localhost:3000/user/edit");
        requete.send(fd)
        requete.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                location.reload()
            }
        }
    return false
}

function deconnection(bruh) {
    localStorage.clear()
}

let edtt = document.querySelector('.imag')
edtt.addEventListener('click', function(e) {
    e.stopImmediatePropagation()
})

let popd = document.querySelector('#uplodfil')
popd.addEventListener('click', function(e) {
    document.querySelector('#uplodfil').style.display = "none"
    let aview = document.querySelector("#uploade")
    switch(document.getElementById("imagee").files[0].type.substring(0,5)) {
        case "image":
            aview.src = ``
        break;
        case "video":
            let previewer = document.getElementById("previewer")
            previewer.innerHTML =   `` 
        break;
        case "audio":
            let previewerr = document.getElementById("previewer")
            previewerr.innerHTML =   `` 
        break;
    }
})

function preview(form) {
    let aview = document.querySelector("#uploade")
    console.log(aview.innerHTML)
    switch(form.files[0].type.substring(0,5)) {
        case "image":
            aview.src = `${URL.createObjectURL(form.files[0])}`
        break;
        case "video":
            let previewer = document.getElementById("previewer")
            previewer.innerHTML =   `<video class="upload" id="upload" controls>
                                    <source src="${URL.createObjectURL(form.files[0])}">
                                    </video>` 
        break;
        case "audio":
            let previewerr = document.getElementById("previewer")
            previewerr.innerHTML =   `<audio class="upload" id="upload" controls>
                                    <source src="${URL.createObjectURL(form.files[0])}">
                                    </audio>` 
        break;
    }
    //document.querySelector(".pp").style.backgroundImage = `url('${URL.createObjectURL(form.files[0])}')`
    //document.querySelector(".solotetsouslo").style.color = "white"
    //document.querySelector(".solotetsouslo").style.backgroundColor = "#0000005c"
}



var dmrg = new XMLHttpRequest();
dmrg.open("GET",  "http://localhost:3000/ent");
dmrg.send();
dmrg.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        let last = response[0]
        response = response.reverse()
        let i = 0
        response.forEach(function(bruh, index) {
            var newmsg = document.createElement("div");
            let pseudo = undefined
            let avatar = undefined
            try {
                pseudo = response[i].info[0].pseudo;
                avatar = response[i].info[0].avatar
            } catch {
                pseudo = "jsscon"
                avatar =  "placeholder.jpg"
            }
            let texte = undefined
            let fichier = undefined
            try {
                response[i].texte = JSON.parse(response[i].texte)
                texte = response[i].texte.message;
                fichier = response[i].texte.image
            } catch (e) {
                texte = response[i].texte
            }
            let idid = response[i].userid;
            let msgs = document.querySelector("#messages")
            if(last.userid != response[i].userid || index == 0) {
                var date = new Date(parseInt(response[i].time))
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                date =  capitalizeFirstLetter(date.toLocaleTimeString(undefined, options))
                if(i == 3) {
                    newmsg.classList.add("ajtmsg")
                }
                newmsg.classList.add("msg")
                newmsg.innerHTML = "<img src='"+avatar+"' alt='pp' class='image'> <div class='dupli'><div class='pseudo'>"+pseudo+"  <span class='date'>"+date+"</span></div><div class='txt'></div></div>";
                newmsg = msgs.insertBefore(newmsg, msgs.firstChild)
                newmsg.querySelector(".txt").dataset.userid = idid
                newmsg.querySelector(".txt").id = response[i].rowid
                let emote = texte.split(" ")
                for(let i = 0; i < emote.length; i++){
                    if(emote[i].charAt(0) == ":") {
                        emote[i] = emote[i].replace(/:/g, "")
                        let bruh = new Image()
                        bruh.src = `emote/${emote[i]}.png`
                        bruh.className = "prevemote"
                        emote[i] = bruh
                    }else {
                        emote[i] = emote[i] + " "
                        emote[i] = new Text(emote[i])
                    }
                    newmsg.querySelector(".txt").appendChild(emote[i])
                }
                newmsg.querySelector(".txt").normalize()
                if(fichier != undefined) {
                    newmsg.querySelector(".txt").innerHTML += `<div>${fichier}</div>`
                }
                if(idid == userid) {
                    newmsg.querySelector(".txt").setAttribute("oncontextmenu", "editMoi(this.id, event)")
                    newmsg.querySelector(".txt").dataset.oui = "editmsg"
                }
                last = response[i]
            } else {
                if(i == 3) {
                    newmsg.classList.add("ajtmsg")
                }
                newmsg.classList.add('txt')
                newmsg.dataset.userid = idid
                newmsg.id = response[i].rowid
                let emote = texte.split(" ")
                for(let i = 0; i < emote.length; i++){
                    if(emote[i].charAt(0) == ":") {
                        emote[i] = emote[i].replace(/:/g, "")
                        let bruh = new Image()
                        bruh.src = `emote/${emote[i]}.png`
                        bruh.className = "prevemote"
                        emote[i] = bruh
                    }else {
                        emote[i] = emote[i] + " "
                        emote[i] = new Text(emote[i])
                    }
                    newmsg.appendChild(emote[i])
                }
                newmsg.normalize()
                console.log(emote)
                if(fichier != undefined) {
                    newmsg.innerHTML += `<div>${fichier}</div>`
                }
                if(idid == userid) {                   
                    newmsg.setAttribute("oncontextmenu", "editMoi(this.id, event)")
                    newmsg.dataset.oui = "editmsg"
                }
                document.querySelector(".dupli").appendChild(newmsg)
            }
            i++
        })
        pitier()
    };
}


function ajtmsg() {
    var dmrg = new XMLHttpRequest();
    dmrg.open("POST",  "http://localhost:3000/entt");
    dmrg.setRequestHeader("Content-Type", "application/json");
    let id = document.getElementById("messages").lastElementChild
    id = id.querySelector(".dupli").firstElementChild.nextElementSibling.id
    dmrg.send(`{"id" : ${id}}`);
    dmrg.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let ajtermsg = document.querySelector(".ajtmsg")
            ajtermsg.classList.remove("ajtmsg")
            var response = JSON.parse(this.responseText);
            let last = id
            let i = 0
            response.forEach(function(bruh, index) {
                var newmsg = document.createElement("div");
                let pseudo = undefined
                let avatar = undefined
                try {
                    pseudo = response[i].info[0].pseudo;
                    avatar = response[i].info[0].avatar
                } catch {
                    pseudo = "jsscon"
                    avatar =  "placeholder.jpg"
                }
                let texte = undefined
                let fichier = undefined
                try {
                    response[i].texte = JSON.parse(response[i].texte)
                    texte = response[i].texte.message;
                    fichier = response[i].texte.image
                } catch (e) {
                    texte = response[i].texte
                }
                let idid = response[i].userid;
                let msgs = document.querySelector("#messages")
                if(last != response[i].userid) {
                    var date = new Date(parseInt(response[i].time))
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    date =  capitalizeFirstLetter(date.toLocaleTimeString(undefined, options))
                    if(i == 3) {
                        newmsg.classList.add("ajtmsg")
                    }
                    newmsg.classList.add("msg")
                    newmsg.innerHTML = "<img src='"+avatar+"' alt='pp' class='image'> <div class='dupli'><div class='pseudo'>"+pseudo+"  <span class='date'>"+date+"</span></div><div class='txt'></div></div>";
                    newmsg = msgs.appendChild(newmsg)
                    newmsg.querySelector(".txt").dataset.userid = idid
                    newmsg.querySelector(".txt").id = response[i].rowid
                    newmsg.querySelector(".txt").textContent = texte
                    let emote = newmsg.querySelector(".txt").textContent.split(" ")
                    for(let i = 0; i < emote.length; i++){
                        if(emote[i].charAt(0) == ":") {
                            emote[i] = emote[i].replace(/:/g, "")
                            emote[i] = `<img src="emote/${emote[i]}.png" alt="" class="prevemote">`
                        }
                    }
                    newmsg.querySelector(".txt").innerHTML = emote.join(" ")
                    if(fichier != undefined) {
                        newmsg.querySelector(".txt").innerHTML += `<div>${fichier}</div>`
                    }
                    if(idid == userid) {
                        newmsg.querySelector(".txt").setAttribute("oncontextmenu", "editMoi(this.id, event)")
                        newmsg.querySelector(".txt").dataset.oui = "editmsg"
                    }
                    last = response[i].userid
                } else {
                    if(i == 3) {
                        newmsg.classList.add("ajtmsg")
                    }
                    newmsg.classList.add('txt')
                    newmsg.dataset.userid = idid
                    newmsg.textContent = texte
                    let emote = newmsg.textContent.split(" ")
                        for(let i = 0; i < emote.length; i++){
                            if(emote[i].charAt(0) == ":") {
                                emote[i] = emote[i].replace(/:/g, "")
                                emote[i] = `<img src="emote/${emote[i]}.png" alt="" class="prevemote">`
                            }
                        }
                        newmsg.innerHTML = emote.join(" ")
                    if(fichier != undefined) {
                        newmsg.innerHTML += `<div>${fichier}</div>`
                    }
                    newmsg.id = response[i].rowid
                    if(idid  == userid) {                   
                        newmsg.setAttribute("oncontextmenu", "editMoi(this.id, event)")
                        newmsg.dataset.oui = "editmsg"
                    }
                        msgs.lastChild.querySelector(".dupli").appendChild(newmsg)
                    }
                i++
            })
        };
    return false;
    }
}

function pitier() {
    let hteurfntr = document.getElementById("messages")
    let ajtermsg = document.querySelector(".ajtmsg")
    let scrolled = false
    hteurfntr.addEventListener("scroll", function() {
        scrolled = true
    }, {
        passive: true
    })
    setInterval(function() {
        let id = document.getElementById("messages").lastElementChild
        id = id.querySelector(".dupli").lastElementChild.id
        if(id != 1) {
            if(scrolled) {
                scrolled = false
                if(ajtermsg.getBoundingClientRect().y > 0) {
                    ajtmsg()
                }
            }
        } else {
        }
    }, 5000);
} 


const connexion = new WebSocket("ws://localhost:8080")

connexion.onopen = () => {
    console.log("bruh")
}

connexion.onerror = error => {
    console.log(`WebSocket error: ${error}`)
}

connexion.onmessage = e => {
    const response = JSON.parse(e.data)
    switch(response.type) {
        case "msg":
            let newmsg = document.createElement("div");
            let pseudo = response.pseudo;
            let avatar = response.avatar;
            let texte = undefined
            let fichier = undefined
            try {
                response.message = JSON.parse(response.message)
                texte = response.message.message;
                fichier = response.message.image
            } catch {
                texte = response.message
            }
            let msgs = document.querySelector("#messages")
            let idid = response.id;
            if(document.querySelector(".txt") == null || response.userid != document.querySelector(".txt").getAttribute('data-userid')) {
                last = response;
                var date = new Date(parseInt(response.time))
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                date =  capitalizeFirstLetter(date.toLocaleTimeString(undefined, options))
                newmsg.classList.add("msg")
                newmsg.innerHTML = "<img src='"+avatar+"' alt='pp' class='image'> <div class='dupli'><div class='pseudo'>"+pseudo+"  <span class='date'>"+date+"</span></div><div class='txt'></div></div>";
                newmsg = msgs.insertBefore(newmsg, msgs.firstChild)
                newmsg.querySelector(".txt").dataset.userid = userid
                newmsg.querySelector(".txt").textContent = texte
                newmsg.querySelector(".txt").id = response.id
                newmsg.querySelector(".txt").textContent = texte
                let emote = newmsg.querySelector(".txt").textContent.split(" ")
                for(let i = 0; i < emote.length; i++){
                    if(emote[i].charAt(0) == ":") {
                        emote[i] = emote[i].replace(/:/g, "")
                        emote[i] = `<img src="emote/${emote[i]}.png" alt="" class="prevemote">`
                    }
                }
                newmsg.querySelector(".txt").innerHTML = emote.join(" ")
                    if(fichier != undefined) {
                        newmsg.querySelector(".txt").innerHTML += `<div>${fichier}</div>`
                    }
                    if(response.userid == userid) {
                        newmsg.querySelector(".txt").setAttribute("oncontextmenu", "editMoi(this.id, event)")
                        newmsg.querySelector(".txt").dataset.oui = "editmsg"
                    }
            } else { 
                newmsg.classList.add('txt')
                newmsg.dataset.userid = idid
                newmsg.textContent = texte
                let emote = newmsg.textContent.split(" ")
                for(let i = 0; i < emote.length; i++){
                    if(emote[i].charAt(0) == ":") {
                        emote[i] = emote[i].replace(/:/g, "")
                        emote[i] = `<img src="emote/${emote[i]}.png" alt="" class="prevemote">`
                    }
                }
                newmsg.innerHTML = emote.join(" ")
                if(fichier != undefined) {
                    newmsg.innerHTML += `<div>${fichier}</div>`
                }
                newmsg.id = response.id
                if(response.userid == userid) {                   
                    newmsg.setAttribute("oncontextmenu", "editMoi(this.id, event)")
                    newmsg.dataset.oui = "editmsg"
                }
                document.querySelector(".dupli").appendChild(newmsg)
            }
        break;
        case "del":
            document.getElementById(response.del).remove();
        break;
        case "modif":
            document.getElementById(response.id).textContent = response.modif
        break;
        case "emote":
            let conteneur = document.querySelector(".nosemotes")
            let emotent = document.createElement("span")
            emotent.innerHTML = `<img src="emote/${response.nom}" alt="" class="emote">`
            emotent.addEventListener("click", function(e){
                document.querySelector("#test").innerHTML += e.target
            })
            conteneur.appendChild(emotent)
        break;
        }
}

function editMoi(bruh, event) {
    let modif = document.getElementById(bruh)
    let bruhh = document.querySelector(".popedit")
    let afaire = true
    if(afaire == true) {
    document.querySelector("body").addEventListener("mouseup", function() {
        document.getElementById(bruh).classList.remove("txtactif")
        try {
            modif.classList.remove("onmodif")
            modif.setAttribute('contenteditable', "false")
        } catch {}
        bruhh.style.display = "none"
        afaire = false
    })
    console.log(bruh)
    event.preventDefault()
    document.getElementById(bruh).classList.add("txtactif")
    var x = event.clientX;
    var y = event.clientY;
    bruhh.style.display = "flex"
    bruhh.style.top = y + "px"
    bruhh.style.left = x + "px"
    document.getElementById("del").addEventListener("click", function() {
        connexion.send(`{"type" : "del", "suppr" : ${bruh}, "userid" : ${userid}}`)
        afaire = false
    })
    document.getElementById("modif").addEventListener("click", function() {
        try {
            let uwu = modif.innerHTML
            modif.setAttribute('contenteditable', "true")
            modif.classList.add('onmodif')
            modif.focus()
            modif.addEventListener('keydown', function(event){
                event.preventDefault()
                switch (event.key) {
                    case "Enter":
                        let msgedit = modif.textContent
                        connexion.send(`{"type" : "modif", "modif" : "${msgedit}", "id" : ${bruh}, "userid" : ${userid}}`)
                        modif.classList.remove("onmodif")
                        modif.setAttribute('contenteditable', "false")
                        afaire = false
                    break;
                    case "Escape":
                        modif.setAttribute('contenteditable', "false")
                        modif.classList.remove("onmodif")
                        modif.innerHTML = uwu
                }
            })
        } catch {}
    })
    document.querySelector("body").addEventListener("click", function() {
        afaire = false
        console.log(afaire)
    })
    document.querySelector("body").addEventListener("contextmenu", function() {
        afaire = false
        console.log(afaire)
    })
}
}





/*setInterval(function(){
    var boucled = new XMLHttpRequest();
    boucled.open("GET",  "http://localhost:3000/msg");
    boucled.send();
    boucled.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            if(last != this.responseText) {
                last = this.responseText;
                var response = this.responseText;
                let newmsg = document.createElement("p");
                let msgs = document.querySelector("#messages")
                newmsg.textContent = response;
                newmsg.classList.add("msg");
                newmsg = msgs.appendChild(newmsg);
            }
        }
    }
}, 5000);*/




let input = document.querySelector("#test")
input.addEventListener('keydown', function(event){
        switch (event.key) {
            case "Enter":
                event.preventDefault()
                let nput = document.querySelector("#test")
                var value = nput.innerHTML;
                if(value != '') {
                    nput.childNodes.forEach(function(currentValue, currentIndex) {
                        if(currentValue == "[object HTMLImageElement]") {
                            currentValue = currentValue.replaceWith(`:${currentValue.alt}:`)
                        }
                    })
                    value = nput.textContent;
                    value = value.replace(/\xa0/g, " ")
                    value = `{"type" : "msg", "userid" : ${userid}, "message" : "${value}", "time" : ${Date.now()}}`
                    nput.innerHTML = '';
                    console.log(value)
                    connexion.send(value)
                    /*var requete = new XMLHttpRequest();
                    requete.open("POST",  "http://localhost:3000/msg");
                    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    value = [userid, value, Date.now()]
                    requete.send(value);
                    last = value;
                    input.value = '';
                    requete.onreadystatechange = function() {
                        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                            var response = JSON.parse(this.responseText);
                            let newmsg = document.createElement("div");
                            let pseudo = response.message[0].pseudo;
                            let avatar = response.message[0].avatar;
                            let texte = response.message[1];
                            var date = new Date(parseInt(response.message[2]))
                            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                            let msgs = document.querySelector("#messages")
                            newmsg.classList.add("msg")
                            newmsg.id = response.id
                            newmsg.innerHTML = "<img src='"+avatar+"' alt='pp' class='image'><div class='pseudo'>"+pseudo+"  <span class='date'>"+capitalizeFirstLetter(date.toLocaleDateString(undefined, options))+"</span></div><div id='txt'></div>";
                            newmsg = msgs.insertBefore(newmsg, msgs.firstChild)
                            document.querySelector("#txt").textContent = texte
                            if(msgs.scrollTop > -300){
                                msgs.scrollTop = 0;
                            };
                            console.log(this.responseText)
                        };
                    };*/
                };
                break;
            case ":":
                /*let devine = document.createElement('span')
                devine.setAttribute('contenteditable', "true")
                devine.id = "devine"
                input.appendChild(devine)
                devine.focus()
                let bruh = input.innerHTML.split(":")
                console.log(bruh, bruh[bruh.lenght])
                bruh[bruh.length] = `<span contenteditable="true" type="text" name="prevemote" id="devine">${bruh[bruh.length]}</span>`
                bruh = bruh.join(":")
                input.innerHTML = bruh*/
                break;
            default:
                return;
        }
}); 


document.getElementById("emote").addEventListener("click", function() {
    document.querySelector(".conteneuremote").classList.toggle("contiens")
})

document.getElementById("pload").addEventListener("click", function() {
    document.getElementById("uplodfil").style.display = "flex"
})

function imager(form) {
    let fichier = undefined
    if(form.message.files == null){
        fichier = document.getElementById("imagee").files[0]
    } else {
        fichier = form.message.files[0]
    }
    var requete = new XMLHttpRequest();
    let fd = new FormData();
    chngimg = document.querySelector(".pp")
    avtr = document.querySelector("#avatar")
    fd.append("time", Date.now())
    fd.append("id", localStorage.getItem("userid"))
    fd.append("message", form.message.value)
    fd.append("image", fichier)
        requete.open("POST",  "http://localhost:3000/image");
        requete.send(fd)
        requete.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                document.querySelector('#uplodfil').style.display = "none"
                let aview = document.querySelector("#uploade")
                switch(fichier.type.substring(0,5)) {
                    case "image":
                        aview.src = ``
                    break;
                    case "video":
                        let previewer = document.getElementById("previewer")
                        previewer.innerHTML =   `` 
                    break;
                    case "audio":
                        let previewerr = document.getElementById("previewer")
                        previewerr.innerHTML =   `` 
                    break;
                }
            }
        }
    return false
}

function emote(form) {
    let addemote = document.querySelector(".nosemotes")
    let ajtemote = document.createElement("div")
    let emote = `${URL.createObjectURL(form.files[0])}`
    ajtemote.innerHTML=`<form method="POST" id="formul" class="modifemote" enctype="multipart/form-data" onsubmit="return send(this);">
                        <label class="previewemote"><img src="${emote}" alt="" class="emotent" id="emotedaya"/><input type="file" name="em" id="em" accept="image/png, image/jpeg" class="input" onchange="return previewemote(this);"/></label>
                        <input type="text" name="nomemote" id="emot" class="inputem" placeholder="" maxlength="16">
                        <br>
                        <input type="submit" value="Créer" id="inptemote">
                        </form>`
    addemote.appendChild(ajtemote)
}

function previewemote(form) {
    document.querySelector("#emotedaya").src = `${URL.createObjectURL(form.files[0])}`
}

function send(form) {
    let emote = document.getElementById("emoted").files[0]
    let fd = new FormData();
    fd.append("nom", form.nomemote.value)
    fd.append("emote", emote)
    var requete = new XMLHttpRequest();
    requete.open("POST",  "http://localhost:3000/emote");
        requete.send(fd)
        requete.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                document.getElementById("formul").remove()
            }
        }
    return false;
}