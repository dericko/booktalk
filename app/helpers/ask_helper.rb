require 'polars'
require 'matrix'

module AskHelper
  # Looks up most relevant context for the question being asked.
  #
  # Params:
  # - question_embeddings (Array[float]): a list of floats representing the question
  #
  # Returns a string of top matching page context for the question.
  def generate_context(question_embeddings)
    question_embeddings = Vector.elements(question_embeddings)
    embeddings_df = Polars.read_csv('book.pdf.embeddings.csv')

    # Find the most similar page title to the question
    similarity_scores = []
    embeddings_df.iter_rows do |row|
      page_embeddings = Vector.elements(row[1..row.length])
      score = question_embeddings.dot(page_embeddings) # both are vectors of embeddings
      similarity_scores << score
    end
    embeddings_df.hstack([Polars::Series.new('scores', similarity_scores)], in_place: true)
    embeddings_df.sort!('scores', reverse: true)

    best_matching_title = embeddings_df.head(1)['title'][0]

    # Look up the content for that page
    pages_df = Polars.read_csv('book.pdf.pages.csv')
    pages_df.filter(Polars.col('title') == best_matching_title).head['content'][0]
  end

  # Assembles a prompt to send to OpenAI.
  #
  # Params:
  # - context (string): the page context.
  # - question_text (string): the question.
  #
  # Returns a string.
  def generate_prompt(context, question_text)
    preface = 'Flights is a 2007 fragmentary novel by the Polish author Olga Tokarczuk, who won the 2018 Nobel Prize in Literature. These questions and answers are based on someone who has read the book.'
    directions = "Please keep your answers to three sentences maximum, and speak in complete sentences. Stop speaking once your point is made.\n"

    preface + directions + "Context that may be useful, pulled from Flights:\n\"#{context}\"\nWith that in mind, #{question_text}"
  end
end
