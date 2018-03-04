package main
// luke waz here

import (
    "fmt"
    "net/http"
	"log"
	"encoding/json"

	"io/ioutil"
	"os"
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
	processUserData(string(jsonString))
}

// PostHandler converts post request body to string
func PostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body",
				http.StatusInternalServerError)
		}

		processUserData(string(body))
		fmt.Fprint(w, "POST done")
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

// send "users" to user
func OutgoingHandler(w http.ResponseWriter, r *http.Request) {
	dataString, _ := json.Marshal(users)
	w.Write(dataString)
}

func main() {
	// load users from file
	loadUsers()

	// allow multiple handlers
	mux := http.NewServeMux()

	// take posts on /datasend
    mux.HandleFunc("/datasend", PostHandler)

	// take posts on /datasend
    mux.HandleFunc("/datareceive", OutgoingHandler)

    fs := http.FileServer(http.Dir("./"))
    mux.Handle("/", http.StripPrefix("/", fs))

	// check is server cert is found, otherwise 
	// use local dummy certs
	serverCertfile := "/etc/letsencrypt/keys/0000_key-certbot.pem"
	var certfile, keyfile string
	if _, err := os.Stat(serverCertfile); os.IsNotExist(err) {
		keyfile = "dummykey.pem"
		certfile = "dummycert.pem"
	} else {
		keyfile = "/etc/letsencrypt/live/cubelasers.com/fullchain.pem"
		certfile = serverCertfile
	}

	// s-s-s-serve it up
	err := http.ListenAndServeTLS(":443", certfile, keyfile, mux)
	log.Println("serving")

    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
