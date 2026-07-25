# Book-talk

Ask questions about a book and get answers grounded in its actual text — a small retrieval-augmented Q&A app built over *Flights* by Olga Tokarczuk.

![demo](https://github.com/dericko/react-rails-askmybook/assets/5404230/cbfdc50b-de21-4538-8fd8-cb63c3614354)

## Why

I read a lot and remember the gist, not the details. This started as a way to test whether "the book itself, searchable by meaning" could stand in for my memory of it — ask a question, get an answer backed by the actual passage rather than an LLM's guess at what the book probably said.

## How it works

1. A pre-processing script reads the book PDF page by page and generates an embedding for each page (OpenAI).
2. Pages + embeddings are seeded into Postgres with pgvector.
3. A question comes in through a simple React form → `POST /ask`.
4. The backend embeds the question, does a cosine-similarity lookup against the page embeddings, and pulls the closest matching passage(s).
5. Question + retrieved context get combined into a prompt and sent to the LLM for the actual answer.
6. Question/answer pairs are cached, so a repeat question skips the LLM call entirely.

Built on Rails + React, using OpenAI for embeddings and completions — swappable for another provider since the retrieval logic doesn't care which model produced the vectors.

## Stack

Ruby on Rails · React (esbuild bundle) · Postgres + pgvector · OpenAI embeddings/completions API

## Setup

```bash
bundle install && yarn install

# with book.pdf in the project root:
rails runner bin/generate_embeddings --pdf book.pdf   # writes pages + embeddings to csv
rails db:create && rails db:migrate
rails db:seed                                          # loads the csvs into pg

bin/dev
```

## Status

Working end to end for a single book. The natural next steps — storing question embeddings in pg instead of a flat table, carrying prior Q&A as context, batching the embeddings calls — are tracked as open TODOs rather than done.
