package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	webSocketUpgarder = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

type Manager struct {
	clients ClientList
	sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		clients: make(ClientList),
	}
}
func (m *Manager) serverWS(w http.ResponseWriter, r *http.Request) {
	log.Println("new connection")

	// upgrade regular http connection into websocket
	conn, err := webSocketUpgarder.Upgrade(w, r, nil)
	Error(err)
	// defer conn.Close()
	client := NewClient(conn, m)
	m.addClient(client)

	// Start client process
	go client.readMessages()
	go client.writeMessages()
}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	m.clients[client] = true
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	if _, ok := m.clients[client]; ok {
		client.connection.Close()
		delete(m.clients, client)
	}
}
