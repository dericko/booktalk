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

TODO:
- [x] setup react `react react-dom`
- [x] setup esbuild `build.js`
- [x] basic App.jsx and view/controller setup
- [x] ruby script to create csvs
- [x] api routing `/ask`
    - [x] `/ask` controller for api integrations
- [ ] db etc
    - [x] setup Questions model
    - [x] store/lookup questions
    - [ ] allow looking up times called?
- [ ] tidy up

* Ruby version
ruby-3.0.0

* Database creation
`rails db:create`

* Database initialization
`rails db:migrate`

* How to run the test suite
TODO: it's not working!

* Deployment instructions
