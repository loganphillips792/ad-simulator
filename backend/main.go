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
	"go.uber.org/zap"
)

type WebsiteInfo struct {
	Id           int            `json:"id"`
	BrandName    NullString     `json:"brand_name"`
	WebsiteUrl   sql.NullString `json:"website_url"`
	InstagramUrl sql.NullString `json:"instagram_url"`
	AdsLibrayUrl sql.NullString `json:"ads_library_url"`
	TiktokUrl    sql.NullString `json:"tiktok_url"`
}

type NullString struct {
	sql.NullString
}

type Handler struct {
	logger *zap.SugaredLogger
	dbConn *sql.DB
}

func (v *NullString) UnmarshalJSON(data []byte) error {
	// Unmarshalling into a pointer will let us detect null
	var x *string
	if err := json.Unmarshal(data, &x); err != nil {
		return err
	}
	if x != nil {
		v.Valid = true
		v.String = *x
	} else {
		v.Valid = false
	}
	return nil
}

func initializeDatabase() *sql.DB {
	file, err := os.Create("data.db")

	if err != nil {
		log.Fatal(err.Error())
	}
	file.Close()

	db, err := sql.Open("sqlite3", "./data.db")

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

	return db
}

func main() {
	db := initializeDatabase()
	defer db.Close()

	logger, _ := zap.NewProduction()
	defer logger.Sync() // flushes buffer, if any
	sugar := logger.Sugar()

	r := mux.NewRouter()

	envHandler := &Handler{logger: sugar, dbConn: db}

	r.HandleFunc("/websiteinfo/", envHandler.CreateWebsiteHandler).Methods("POST")
	r.HandleFunc("/websiteinfo", envHandler.GetAllWebsitesHandler).Methods("GET")
	r.HandleFunc("/websiteinfo/{id}", envHandler.UpdateWebsiteHandler).Methods("PUT")
	r.HandleFunc("/websiteinfo/{id}", envHandler.DeleteWebsiteHandler).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
	})

	handler := c.Handler(r)

	log.Fatal(http.ListenAndServe(":8000", handler))
}

func (handler *Handler) CreateWebsiteHandler(w http.ResponseWriter, r *http.Request) {
	query := "INSERT INTO websites (brand_name, website_url, instagram_url, ads_library_url, tiktok_url) VALUES (?, ?, ?, ?, ?)"

	var websiteToCreate WebsiteInfo

	err := json.NewDecoder(r.Body).Decode(&websiteToCreate)

	if err != nil {
		log.Fatal(err.Error())
	}

	handler.logger.Infow("Running SQL statement",
		"website", websiteToCreate,
		"SQL", query,
	)

	_, err = handler.dbConn.Exec(query, sql.NullString{}, sql.NullString{}, sql.NullString{}, sql.NullString{}, sql.NullString{})

	if err != nil {
		log.Fatal(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")

}

func (handler *Handler) GetAllWebsitesHandler(w http.ResponseWriter, r *http.Request) {

	handler.logger.Infow("GETTING ALL WEBSITES")

	rows, err := handler.dbConn.Query("SELECT * FROM websites")

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

func (handler *Handler) UpdateWebsiteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	var website WebsiteInfo

	err := json.NewDecoder(r.Body).Decode(&website)

	if err != nil {
		log.Fatal(err.Error())
	}

	updateWebsiteInfoSQL := "UPDATE websites SET brand_name = ? WHERE id = ?"

	statement, err := handler.dbConn.Prepare(updateWebsiteInfoSQL)

	if err != nil {
		log.Fatal(err.Error())
	}
	_, err = statement.Exec(website.BrandName, vars["id"])

	w.Header().Set("Content-Type", "application/json")
}

func (handler *Handler) DeleteWebsiteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	updateWebsiteInfoSQL := "DELETE FROM websites WHERE id = ?"

	statement, err := handler.dbConn.Prepare(updateWebsiteInfoSQL)

	if err != nil {
		log.Fatal(err.Error())
	}
	_, err = statement.Exec(vars["id"])

	w.Header().Set("Content-Type", "application/json")
}
