# Book-talk
This is an experiment using LLM (large language model) completions to help me remember the details of books and other text I've read. In this case, our AI assistant has "read" the contents of Flights by Olga Tokarczuk and can look up excerpts from the book before answering questions.

![screen record](https://github.com/dericko/react-rails-askmybook/assets/5404230/cbfdc50b-de21-4538-8fd8-cb63c3614354)


This happens in a few steps:
 1) Pre-process source text(s) by generating embeddings (vector representations of chunks of text text) and writing these to file.
 2) Seed a database with the text + embeddings for easy lookup (in this case, use postgres + pgvector to store the embeddings).
 3) Spin up a web server. The frontend is a simple form that takes text `question` and displays text `answer`. The API handles this with `POST /ask`.
 4) The backend it does the following: fetches a vector embedding for the `question`, and then uses it to look up most relevant chunk(s) of text ([pgvector]([url]https://github.com/pgvector/pgvector) uses some version of approximate nearest neighbor search to calculate the vector's cosine similarity).
 5) Construct a text `query` using the `context` and `question` and run it through the LLM. In this case, OpenAI's `/completions` API.
 6) Save questions/answers in another table (allows us to skip step 5 if question was already asked)

The above is built using Ruby on Rails / React. It uses OpenAI for the embeddings/completions, but they could be swapped with a different LLM, especially if we want to do more fine tuning down the line.

Initial version based on [askmybook.com](https://askmybook.com/). Also, thanks to [these](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-v7-project-with-a-react-frontend-on-ubuntu-20-04) [resources](https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb).

## Structure
This is a pretty standard RoR setup. The main concerns/files are:
1) pre-processing script [bin/generate_embeddings](https://github.com/dericko/react-rails-askmybook/blob/main/bin/generate_embeddings)
   - this reads a pdf page-by-page, fetches openai embeddings for each page, and saves them along with page data to csv
2) database
    - [db/seeds](https://github.com/dericko/react-rails-askmybook/blob/main/db/seeds.rb) seeds db with csv data `rake db:seed`
    - [db/schema](https://github.com/dericko/react-rails-askmybook/blob/main/db/schema.rb) for db schema
      - Document (stores pre-processed context/pages)
      - Question (stores questions asked in app)
4) api
    - [config/routes.rb](https://github.com/dericko/react-rails-askmybook/blob/main/config/routes.rb)
    - [app/controllers/api/v1/ask_controller.rb](https://github.com/dericko/react-rails-askmybook/blob/main/app/controllers/api/v1/ask_controller.rb)
    - [app/helpers/ask_helper.rb](https://github.com/dericko/react-rails-askmybook/blob/main/app/helpers/ask_helper.rb)
    - [app/services/openai_service.rb](https://github.com/dericko/react-rails-askmybook/blob/main/app/services/openai_service.rb)
5) frontend
    - it's a react app, bundled with esbuild ([package.json](https://github.com/dericko/react-rails-askmybook/blob/main/package.json) and served by the home/index route
   (the main layout imports the bundle: [app/views/layouts/application.html.erb](https://github.com/dericko/react-rails-askmybook/blob/main/app/views/layouts/application.html.erb) -- the route to [views/home/index.html.erb](https://github.com/dericko/react-rails-askmybook/blob/main/app/views/home/index.html.erb) is just a blank page)
    - the react that gets bundled/loaded [app/javascript](https://github.com/dericko/react-rails-askmybook/tree/main/app/javascript)
        - note: frontend uses react-router for some browser-side history manipulation, `{index_path}/questions/:id` etc)

---

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
    - [x] storage/lookup
        - [x] store doc embeddings in pg (use pgvector)
        - [ ] store question embeddings in pg
    - [ ] pre-processing script
        - [ ] experiment with other chunks beside pages (chapter headings, for example)
        - [ ] batch calls to embeddings endpoint (right now it's one per page)
    - [ ] context
        - [ ] store previous Q+A
        - [ ] add more metadata (loc in book)
