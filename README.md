# README

Based on [askmybook.com](https://askmybook.com/). Rebuilding with react/rails.

## Dependencies
See `Gemfile` and `package.json` for dependencies. Install them with:
```sh
bundle install
yarn install
```
- postgres
- pg-vector

## Setup
Run the script `bin/generate_embeddings` with `book.pdf` in root
```sh
rails runner bin/generate_embeddings --pdf book.pdf
```
This will generate two csv files: `book.pdf.pages.csv` and `book.pdf.embeddings.csv`

## Run locally
```sh
bin/dev
```

## Info
* Ruby version
`ruby-3.0.0`

* View available routes
`rails routes`

* Database creation
`rails db:create`

* Database initialization
`rails db:migrate`

* How to run the test suite
`bin/dev test`

* Deployment instructions

## TODO:
- [x] setup react `react react-dom`
- [x] setup esbuild `build.js`
- [x] basic App.jsx and view/controller setup
- [x] ruby script to create csvs
- [x] api routing `/ask`
    - [x] `/ask` controller for api integrations
- [x] db etc
    - [x] setup Questions model
    - [x] store/lookup questions
    - [x] allow looking up times called?
- [x] tidy up
- [x] frontend design
- [x] tweaks
    - [x] seed some questions
- [x] tests
    - [x] cover the major pieces, priority: ask_helper, ask_controller, openai_service
- [ ] improvements
    - [ ] storage/lookup
        - store embeddings in pg (use pgvector)
    - [ ] pre-processing script
        - [ ] experiment with other chunks beside pages (chapter headings, for example)
        - [ ] batch calls to embeddings endpoint (right now it's one per page)
    - [ ] context
        - [ ] store previous Q+A
        - [ ] add more metadata (loc in book)
