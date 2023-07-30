package main

import (
	"log"
	"net/http"
)

func main() {
	setupAPI()
	log.Fatal(http.ListenAndServe(":3000", nil))
}
func setupAPI() {
	manager := NewManager()
	http.Handle("/", http.FileServer(http.Dir("./frontend")))
	http.HandleFunc("/socket", manager.serverWS)

}
func Error(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
