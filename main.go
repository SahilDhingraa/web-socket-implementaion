package main

import (
	"context"
	"log"
	"net/http"
)

func main() {
	setupAPI()
	log.Fatal(http.ListenAndServeTLS(":3000", "certificate.crt", "private.key", nil))
}
func setupAPI() {
	ctx := context.Background()
	manager := NewManager(ctx)

	http.Handle("/", http.FileServer(http.Dir("./frontend")))
	http.HandleFunc("/socket", manager.serverWS)
	http.HandleFunc("/login", manager.loginHandler)

}
func Error(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
