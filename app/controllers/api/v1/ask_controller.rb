require 'json'
require 'openai'
require 'polars'
require 'matrix'

OPENAI_API_KEY = ENV.fetch('OPENAI_API_KEY')
EMBEDDINGS_MODEL = 'text-embedding-ada-002'.freeze
COMPLETIONS_MODEL = 'text-davinci-003'.freeze
COMPLETIONS_API_PARAMS = {
  'temperature' => 0,
  'max_tokens' => 150,
  'model' => COMPLETIONS_MODEL
}

class Api::V1::AskController < ApplicationController
  def index
    params.require(:question)
    question_text = params[:question]
    question_text += '?' unless question_text.end_with?('?')

    prev_q = Question.find_by(question: question_text)
    if prev_q
      prev_q.update(ask_count: prev_q.ask_count + 1)
      render json: { question: prev_q.question, answer: prev_q.answer }
      return
    end

    context = generate_context(question_text)
    prompt = generate_prompt(context, question_text)
    puts "Prompt:\n\n #{prompt}\n\n"
    answer = get_completion(prompt)

    question = Question.create(
      question: question_text,
      context: context,
      answer: answer,
      ask_count: 1
    )

    render json: { question: question.question, answer: question.answer }
  end

  private

  # TODO: move this to a helper
  def generate_context(question_text)
    # Get embeddings
    question_embeddings = Vector.elements(get_embedding(question_text))
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

    puts "adding context: #{best_matching_title}"

    # Look up the content for that page
    pages_df = Polars.read_csv('book.pdf.pages.csv')
    pages_df.filter(Polars.col('title') == best_matching_title).head['content'][0]
  end

  # TODO: move this to a helper
  def generate_prompt(context, question_text)
    preface = 'Flights is a 2007 fragmentary novel by the Polish author Olga Tokarczuk, who won the 2018 Nobel Prize in Literature. These questions and answers are based on someone who has read the book.\n\n'
    directions = 'Please keep your answers to three sentences maximum, and speak in complete sentences. Stop speaking once your point is made.\n\nContext that may be useful, pulled from Flights:\n'

    preface + directions + "Here is some context: #{context}\n" + question_text
  end

  def get_embedding(text)
    return '' if text.nil?

    openai = OpenAI::Client.new(access_token: OPENAI_API_KEY)

    res = openai.embeddings(
      parameters: {
        model: EMBEDDINGS_MODEL,
        input: text
      }
    )
    res['data'][0]['embedding']
  end

  def get_completion(prompt)
    return '' if prompt.nil?

    puts "fetch completions with params: #{params}"
    params = COMPLETIONS_API_PARAMS
    params['prompt'] = prompt
    response = RestClient.post(
      'https://api.openai.com/v1/completions',
      params.to_json,
      {
        content_type: :json,
        'Authorization': "Bearer #{OPENAI_API_KEY}"
      }
    )
    res = JSON.parse(response.body)
    # res = openai.completions(
    #   parameters: {
    #     model: COMPLETIONS_MODEL,
    #     prompt: prompt,
    #     temperature: 0,
    #     max_tokens: 150
    #   }
    # )
    puts res
    res['choices'][0]['text']
  end
end
