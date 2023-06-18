require 'polars'
require 'matrix'

module AskHelper
  MAX_TOKEN_LENGTH = 800
  TOP_TITLES_COUNT = 5
  # Looks up most relevant context for the question being asked.
  #
  # Params:
  # - question_embeddings (Array[float]): a list of floats representing the question
  #
  # Returns a list of strings representing top matching pages for the question.
  def generate_context(question_embeddings)
    question_embeddings = Vector.elements(question_embeddings)
    embeddings_df = Polars.read_csv('book.pdf.embeddings.csv')

    # Find the most similar page title to the question
    similarity_scores = []
    embeddings_df.iter_rows do |row|
      page_embeddings = Vector.elements(row[2..row.length])
      score = question_embeddings.dot(page_embeddings) # both are vectors of embeddings
      similarity_scores << score
    end
    embeddings_df.hstack([Polars::Series.new('scores', similarity_scores)], in_place: true)
    embeddings_df.sort!('scores', reverse: true)

    top_titles = embeddings_df.head(TOP_TITLES_COUNT)['title']
    top_token_counts = embeddings_df.head(TOP_TITLES_COUNT)['tokens']

    titles_for_context = []
    token_len = 0
    top_titles.each.with_index do |title, i|
      break unless top_token_counts[i] + token_len < MAX_TOKEN_LENGTH

      titles_for_context << title
      token_len += top_token_counts[i]
    end

    pages_df = Polars.read_csv('book.pdf.pages.csv')
    pages = pages_df.filter(Polars.col('title').is_in(titles_for_context)).head['content']
    pages.to_a
  end

  # Assembles a prompt to send to OpenAI.
  #
  # Params:
  # - context (Array[string]): array of pages.
  # - question_text (string): the question.
  #
  # Returns a string.
  def generate_prompt(context, question_text)
    header = "Flights is a 2007 fragmentary novel by the Polish author Olga Tokarczuk. These questions and answers are based on someone who has read the book and is excited to talk about it. Please keep your answers to three sentences maximum, and speak in complete sentences. Stop speaking once your point is made.\n\nContext that may be useful, pulled from Flights:\n"

    # Generated w/ ChatGPT prompt: "Can you give me 5 good questions and answers about the book Flights by Olga Tokarczuk? "good" meaning interesting and concise to someone who has not read the book but has heard of it before. Please keep questions to one sentence and answers to two sentences." (and then asking to format as below)

    question1 = "\n\n\nQ: What is the central theme of 'Flights' by Olga Tokarczuk?\n\nA: The book explores the concept of travel and its impact on human experience and identity."
    question2 = "\n\n\nQ: Does 'Flights' follow a linear narrative structure?\n\nA: No, it is a fragmented novel composed of interconnected vignettes and stories that span different times and places."
    question3 = "\n\n\nQ: Who is the author, Olga Tokarczuk, and why is she significant?\n\nA: Olga Tokarczuk is a renowned Polish writer who received the Nobel Prize in Literature in 2018 for her innovative and imaginative storytelling."
    question4 = "\n\n\nQ: Are there recurring motifs or symbols in 'Flights'?\n\nA: Yes, the book frequently explores the themes of movement, exploration, and the human body."
    question5 = "\n\n\nQ: Does 'Flights' touch upon philosophical concepts?\n\nA: Absolutely, the novel delves into philosophical ideas regarding existence, human nature, and the transient nature of life."

    seed_questions = "#{question1}#{question2}#{question3}#{question4}#{question5}"

    context = context.join("\n")

    "#{header}#{context}#{seed_questions}\n\n\nQ: #{question_text}\n\nA:"
  end
end
