package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

type Website struct {
	Id  int    `json:"id"`
	Url string `json:"url"`
}

func initializeDatabase() {
	file, err := os.Create("data.db")

	if err != nil {
		log.Fatal(err.Error())
	}
	file.Close()

	db, err = sql.Open("sqlite3", "./data.db")

	if err != nil {
		log.Fatal(err.Error())
	}

	// run sql files
	c, err := ioutil.ReadFile("./script.sql")

	if err != nil {
		log.Fatal(err.Error())
	}

	sql := string(c)

	_, err = db.Exec(sql)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func main() {
	initializeDatabase()
	defer db.Close()

	r := mux.NewRouter()

	r.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT * FROM websites")

		defer rows.Close()

		if err != nil {
			log.Fatal(err)
		}

		var websites []Website

		for rows.Next() {
			var website Website

			err := rows.Scan(&website.Id, &website.Url)

			if err != nil {
				log.Fatal(err)
			}
			websites = append(websites, website)
		}

		//err = json.NewEncoder(w).Encode(websites)
		response, _ := json.Marshal(websites)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		w.Write(response)

		if err != nil {
			log.Fatal(err)
		}
	}).Methods("GET")

	log.Fatal(http.ListenAndServe(":8000", r))
}
