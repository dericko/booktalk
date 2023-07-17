# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

require 'csv'

PAGES_CSV_PATH = ENV.fetch('PAGES_CSV_PATH')
CSV.foreach(PAGES_CSV_PATH, headers: true) do |row|
  title = row['title']
  content = row['content']
  tokens = row['tokens']
  Document.create(title: title, content: content, tokens: tokens)
end

EMBEDDINGS_CSV_PATH = ENV.fetch('EMBEDDINGS_CSV_PATH')
CSV.foreach(EMBEDDINGS_CSV_PATH, headers: true) do |row|
  title = row['title']
  embeddings = row[2...row.length]
  Document.find_by(title: title).update(embeddings: embeddings)
end
