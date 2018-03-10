package main
// luke waz here

import (
    "fmt"
    "net/http"
	"log"
	"encoding/json"

	"io/ioutil"
	"os"
	"github.com/googollee/go-socket.io"
)

// has an entry for each user
var users = make(map[string]*json.RawMessage)

// adds user to "users" and their name if it isn't in "usernames"
// called by processUserData
func addUser(userName string, userData *json.RawMessage){
	users[userName] = userData
	f, _ := json.Marshal(users)
	ioutil.WriteFile("users.json", f, 0x644)
	log.Println("users:", users)
}

//process user data
func processUserData(userJSON string) { // the data recieved from server
	// new users is a username -> RawJson map, 
	// but usually only has one key
	var objmap map[string]*json.RawMessage
	err := json.Unmarshal([]byte(userJSON), &objmap)
	if err != nil {
		fmt.Println("json unmarshal err:", err)
	} else {
		// if unmarshalling went fine, update their data
		for k, v := range objmap{
			addUser(k, v)
		}
	}
}

// load users and usernames from "users.json"
func loadUsers() {
	jsonString, _ := ioutil.ReadFile("users.json");
	log.Println(jsonString)
	processUserData(string(jsonString))
}

func main() {

	// load users from file
	loadUsers()
	log.Println("users: ", users)

	// allow multiple handlers
	mux := http.NewServeMux()

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.On("some:event", func(msg string) string {
		log.Println("got an event!!")
		return "yesss"//Sending ack with data in msg back to client, using "return statement"
	})
/*
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		so.Join("game")
		so.On("game message", func(msg string) {
			log.Println("emit:", so.Emit("game message", msg))
			so.BroadcastTo("game", "game message", msg)
		})
		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})
*/
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	server.BroadcastTo("game", "message", "you good the bar", func (so socketio.Socket, data string) {
		log.Println("Client ACK with data: ", data)
	})





	mux.Handle("/socket.io/", server)

    fs := http.FileServer(http.Dir("./"))
    mux.Handle("/", http.StripPrefix("/", fs))

	// check is server cert is found, otherwise 
	// use local dummy certs
	serverKeyfile := "/etc/letsencrypt/keys/0000_key-certbot.pem"
	var certfile, keyfile string
	if _, err := os.Stat(serverKeyfile); os.IsNotExist(err) {
		keyfile = "dummykey.pem"
		certfile = "dummycert.pem"
	} else {
		keyfile = serverKeyfile
		certfile = "/etc/letsencrypt/live/cubelasers.com/fullchain.pem"
	}

	// s-s-s-serve it up
	serverr := http.ListenAndServeTLS(":443", certfile, keyfile, mux)
	log.Println("serving")

    if serverr != nil {
        log.Fatal("ListenAndServe: ", serverr)
    }
}
