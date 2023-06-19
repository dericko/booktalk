# README

Rebuilding askmybook.com with react/rails.

## Dependencies
See `Gemfile` and `package.json` for dependencies. Install them with:
```sh
bundle install
yarn install
```

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
- [ ] do the text-to-speech
    - [ ] see why Resemble /clips is disabled for my acct
    - [ ] add it to response
- [x] frontend
    - [x] make it nice
    - [x] book image + title
    - [x] link to book
    - [x] author info + disclaimer that it's not me
- [x] tweaks
    - [x] seed some questions
- [x] tests
    - [x] cover the major pieces, priority: ask_helper, ask_controller, openai_service
- [ ] improvements
    - [ ] see what's the bottleneck in /ask
        - [ ] if its reading the csvs, use redis or something in-memory instead of reading every req
        - [ ] if its openai/completions idk...would need to look into how to speed that up
    - [ ] pre-processing script
        - [ ] experiment with other chunks beside pages (chapter headings, for example)
        - [ ] batch calls to embeddings endpoint (right now its one per page)
        - [ ] can consolidate the two csvs into one (would it affect performance writing or reading?)
    - [ ] more context
        - [ ] look into: does /completions store any previous questions for my api token?
        - [ ] if so, just let them do it
        - [ ] if not, append 1 or more previous question to make it more like a chat (perhaps appending every new question up to whatever the limit is)
