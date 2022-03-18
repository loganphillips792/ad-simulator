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
	"github.com/rs/cors"
)

var db *sql.DB

type WebsiteInfo struct {
	Id           int            `json:"id"`
	BrandName    sql.NullString `json:"brand_name"`
	WebsiteUrl   sql.NullString `json:"website_url"`
	InstagramUrl sql.NullString `json:"instagram_url"`
	AdsLibrayUrl sql.NullString `json:"ads_library_url"`
	TiktokUrl    sql.NullString `json:"tiktok_url"`
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

	r.HandleFunc("/websiteinfo/", CreateWebsiteHandler).Methods("POST")
	r.HandleFunc("/hello", GetAllWebsitesHandler).Methods("GET")
	r.HandleFunc("/websiteinfo/{id}", UpdateWebsiteInfo).Methods("PUT")
	r.HandleFunc("/websiteinfo/{id}", DeleteWebsiteInfo).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
	})

	handler := c.Handler(r)

	log.Fatal(http.ListenAndServe(":8000", handler))
}

func CreateWebsiteHandler(w http.ResponseWriter, r *http.Request) {
	updateWebsiteInfoSQL := "INSERT INTO websites (brand_name, website_url, instagram_url, ads_library_url, tiktok_url) VALUES (?, ?, ?, ?, ?)"

	statement, err := db.Prepare(updateWebsiteInfoSQL)

	if err != nil {
		log.Fatal(err.Error())
	}
	_, err = statement.Exec(sql.NullString{}, sql.NullString{}, sql.NullString{}, sql.NullString{}, sql.NullString{})

	w.Header().Set("Content-Type", "application/json")
}

func GetAllWebsitesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT * FROM websites")

	defer rows.Close()

	if err != nil {
		log.Fatal(err)
	}

	var websites []WebsiteInfo
	for rows.Next() {
		var website WebsiteInfo

		err := rows.Scan(&website.Id, &website.BrandName, &website.WebsiteUrl, &website.InstagramUrl, &website.AdsLibrayUrl, &website.TiktokUrl)

		if err != nil {
			log.Fatal(err)
		}
		websites = append(websites, website)
	}

	err = json.NewEncoder(w).Encode(websites)
	w.Header().Set("Content-Type", "application/json")

	if err != nil {
		log.Fatal(err)
	}
}

func UpdateWebsiteInfo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	var website WebsiteInfo

	err := json.NewDecoder(r.Body).Decode(&website)

	if err != nil {
		log.Fatal(err.Error())
	}

	updateWebsiteInfoSQL := "UPDATE websites SET brand_name = ? WHERE id = ?"

	statement, err := db.Prepare(updateWebsiteInfoSQL)

	if err != nil {
		log.Fatal(err.Error())
	}
	_, err = statement.Exec(website.BrandName, vars["id"])

	w.Header().Set("Content-Type", "application/json")
}

func DeleteWebsiteInfo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	updateWebsiteInfoSQL := "DELETE FROM websites WHERE id = ?"

	statement, err := db.Prepare(updateWebsiteInfoSQL)

	if err != nil {
		log.Fatal(err.Error())
	}
	_, err = statement.Exec(vars["id"])

	w.Header().Set("Content-Type", "application/json")
}
