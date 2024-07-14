const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const WebSocket = require('ws')

const fs = require('fs')

var path = require('path')

const wss = new WebSocket.Server({
    port: 8080,
  });

const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'pp');
    },
    filename: (req, file, callback) => {
      if(req.body.edit == "edit" && req.file != undefined) {
            fs.unlink(`pp/${req.body.id}.${MIME_TYPES}`)
      }
      const name = req.body.id;
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + '.' + extension);
    }
});

var upload = multer({ storage: storage })

const storagent = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img');
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + path.extname(file.originalname));
    }
});
var uploadimg = multer({ storage: storagent })

const emotent = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'emote');
    },
    filename: (req, file, callback) => {
      callback(null, req.body.nom + ".png");
    }
});
var uploademote = multer({ storage: emotent })
  

let db = new sqlite3.Database('./msg/message.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('get databased');
  });

db.run(`CREATE TABLE IF NOT EXISTS message(rowid INTEGER PRIMARY KEY, userid, texte VARCHAR(255), time TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS user(rowid INTEGER PRIMARY KEY, email type UNIQUE, password, avatar, pseudo)`)
db.run(`CREATE TABLE IF NOT EXISTS emote(rowid INTEGER PRIMARY KEY, nom)`)

app.use(express.urlencoded({ extended:true, limit:'50mb', parameterLimit: 1000000 }))
app.use(express.json({limit:'50mb'})); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/user/info', (req, res, next) => {
    db.get(`SELECT pseudo, avatar FROM user WHERE rowid = ${req.body.id}`, (err, data) => {
        res.status(200).json(data)
    })
})

app.post('/user/register', (req, res, next) => {
        let resultat = req.body
        let email = resultat.email
        let password = resultat.password
        bcrypt.hash(password, 10, (err, hash) => {
            console.log("bruh")
            db.run('INSERT INTO user(email, password) VALUES(?, ?)', email, hash)
            db.get("SELECT rowid FROM user WHERE email = '"+email+"'", (err, data) => {
                if(err)
                  res.status(401).json({message : "E-Mail déjà utilisée"})
            res.status(200).send(`${data.rowid},
                                ${jwt.sign(
                                { userId: data.rowid },
                                'assaed',
                                {expiresIn: '69h' })
                                }`)
            })
            console.log(db.get("SELECT * FROM user"))
        });
    }
)

app.post('/user/register/finish', upload.single('avatar'), (req, res, next) => {
        let resultat = req.body
        let pseudo = resultat.pseudo
        let userid = resultat.id
        if(req.file == ''){
            avatar = "placeholder.jpg"
        } else {
            avatar = req.file.path
        }
        db.run(`UPDATE user SET avatar = "${avatar}", pseudo = "${pseudo}" WHERE rowid = "${userid}"`)
        res.status(200).send("bruh")
    })

app.post('/user/login', (req, res, next) => {
    db.get(`SELECT rowid, email, password, avatar, pseudo FROM user WHERE email = "${req.body.email}"`, (err, data) => {
        console.log(data)
        if(typeof data == "undefined"){
            console.log("nn")
            res.status(401).json({error: "t'existes pas irl"});
        } else {
            bcrypt.compare(req.body.password, data.password)
                .then(valid => {
                    if(!valid) {
                        res.status(401).json({error: "mdp incorrect"})
                    }
                    res.status(200).json({
                        userid : data.rowid,
                        pseudo : data.pseudo,
                        token: jwt.sign(
                            { userId: data.rowid },
                            'assaed',
                            { expiresIn: '69h' })
                    });
                }) .catch(error => res.status(500).json({ error }));
            }}
        )
})

app.post('/user/edit', upload.single('avatar'), (req, res, next) => {
    let resultat = req.body
    console.log(req.body)
    if(resultat.pseudo != "") {
        db.run(`UPDATE user SET pseudo = "${resultat.pseudo}" WHERE rowid = "${resultat.id}"`)
    }
    if(req.file != undefined) {
        db.run(`UPDATE user SET avatar = "${req.file.path}" WHERE rowid = "${resultat.id}"`)
    }
    res.status(200).json()
})


wss.on("connection", function connection(ws) {
    ws.on('message', function incoming(data) {
        console.log(JSON.parse(data))
        let resultat = JSON.parse(data)
            switch(resultat.type) {
                case "msg":
                    db.run('INSERT INTO message(userid, texte, time) VALUES(?, ?, ?)', resultat.userid, resultat.message, resultat.time) 
                    db.get(`SELECT rowid FROM message WHERE time = ${resultat.time}`, (err, dataa) => {
                        db.get(`SELECT pseudo, avatar FROM user WHERE rowid = ${resultat.userid}`, (err, dataed) => {
                            resultat.type = "msg"
                            resultat.pseudo = dataed.pseudo
                            resultat.avatar = dataed.avatar
                            resultat.id = dataa.rowid
                            console.log(resultat)
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify(resultat));
                                }
                      });
                })
            })
                break;
                case "del":
                    db.get(`SELECT userid FROM message WHERE rowid = ${resultat.suppr}`, (err, data) => {
                        console.log(data.userid, resultat.userid)
                        if(data.userid == resultat.userid) {
                            db.run(`DELETE FROM message WHERE rowid = ${resultat.suppr}`)
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({"type" : "del", "del" : resultat.suppr}));
                                }
                            })
                        }
                    })
                break;
                case "modif":
                    db.get(`SELECT userid FROM message WHERE rowid = ${resultat.id}`, (err, data) => {
                        if(data.userid == resultat.userid) {
                            db.run(`UPDATE message SET texte = "${resultat.modif}" WHERE rowid = "${resultat.id}"`)
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({"type" : "modif", "modif" : resultat.modif, "id" : resultat.id}));
                                }
                            })
                        }
                    })
                break;
        }
    })
})

/*app.use('/msg', (req, res, next) => {
    db.get('SELECT userid, texte, time FROM message ORDER BY ROWID DESC LIMIT 1;', (err, data) => {
        if(err)
            throw err
        res.status(200).send(data.texte)
    });
})*/

app.use('/ent', (req, res, next) => {
    db.all('SELECT rowid, userid, texte, time FROM message ORDER BY ROWID DESC LIMIT 30', (err, data) => {
        if(err)
            throw err
        let i = 0
        for(let element of data) {
            db.all(`SELECT pseudo, avatar FROM user WHERE rowid = "${element.userid}"`, (err, info) => {
                if(err){
                    throw err};
                element.info = info
                i++
                if(i - 1 == data.length - 1) {
                    res.status(200).json(data)
                }
                //si je mets le i++ ici ça bug
            });
            //si je mets le i++ ici ça bug
        }
    })
})

app.post('/entt', (req, res, next) => {
    let resultat = req.body.id
    console.log(resultat - 30)
    db.all(`SELECT rowid, userid, texte, time FROM message WHERE rowid BETWEEN "${resultat - 30}" and "${resultat}"`, (err, data) => {
        if(err)
            throw err
        let i = 0
        for(let element of data) {
            db.all(`SELECT pseudo, avatar FROM user WHERE rowid = "${element.userid}"`, (err, info) => {
                if(err){
                    throw err};
                element.info = info
                i++
                if(i - 1 == data.length - 1) {
                    res.status(200).json(data)
                }
                //si je mets le i++ ici ça bug
            });
            //si je mets le i++ ici ça bug
        }
    })
})

app.post('/image', uploadimg.single('image'), (req, res, next) => {
    let resultat = req.body
    console.log(resultat, req.file)
    res.status(200).json()
    let fichi = undefined
    switch(req.file.mimetype.substring(0,5)) {
        case "image":
            fichi = `<img src="${req.file.path}" alt="" class="imagge"/>`
        break;
        case "video":
            fichi = `<video class="videoe" controls>
                    <source src="${req.file.path}">
                    </video>` 
        break;
        case "audio":
            fichi = `<audio class="audioe controls>
                    <source src="${req.file.path}">
                    </audio>` 
        break;
    }
    let message = {"message" : resultat.message, "image" : fichi}
    message = JSON.stringify(message)
    db.run('INSERT INTO message(userid, texte, time) VALUES(?, ?, ?)', resultat.id, message, resultat.time)
    db.get(`SELECT rowid, texte FROM message WHERE time = ${resultat.time}`, (err, dataa) => {
        db.get(`SELECT pseudo, avatar FROM user WHERE rowid = ${resultat.id}`, (err, dataed) => {
            resultat.type = "msg"
            resultat.message = dataa.texte
            resultat.pseudo = dataed.pseudo
            resultat.avatar = dataed.avatar
            resultat.userid = resultat.id
            resultat.id = dataa.rowid
            console.log(resultat)
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(resultat));
                }
            }); 
        })
    })
})

app.post('/emote', uploademote.single('emote'), (req, res, next) => {
    let resultat = req.body
    console.log(resultat, req.file)
    db.run('INSERT INTO emote(nom) VALUES(?)', req.file.filename)
    res.status(200).json()
    let asend = {}
    asend.type = "emote"
    asend.nom = req.file.filename
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(asend));
        }
    }); 
})

app.use('/emotent', (req, res, next) => {
    db.all(`SELECT nom FROM emote`, (err, data) => {
        if(err)
            throw err
        res.status(200).json(data)
    })
})

/*
try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    db.get(``SELECT rowid FROM user WHERE rowid = '${decodedToken}'
    
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
*/

module.exports = app;
