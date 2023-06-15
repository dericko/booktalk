require 'json'
require 'openai'
require 'polars'

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
    question = params[:question]

    question += '?' unless question.end_with?('?')

    # TODO: lookup previous questions
    prompt = generate_prompt(question)
    puts prompt
    answer = get_completion(prompt)

    # TODO: cache answer

    render json: { question: question, answer: answer }
  end

  private

  # TODO: move this to a helper
  def generate_prompt(question)
    # TODO: get get embeddings for question
    question_vector = get_embedding(question)
    pages_df = Polars.read_csv('book.pdf.pages.csv')
    embeddings_df = Polars.read_csv('book.pdf.embeddings.csv')

    puts pages_df.head(5)
    puts embeddings_df.head(5)

    # get the answer:

    # put the following in a block comment
    ###
    # 1. turn question into embeddings [1,2,3,...n]
    # 2. get similarity between question_embedding and list from doc_embeddings_df
    # 3. look up the page content from pages_df (this does not need to be a dataframe...) using top similar embeddings's page number
    # construct prompt using template, page content, and question

    preface = 'Flights is a 2007 fragmentary novel by the Polish author Olga Tokarczuk, who won the 2018 Nobel Prize in Literature. These questions and answers are based on someone who has read the book.\n\n'
    directions = 'Please keep your answers to three sentences maximum, and speak in complete sentences. Stop speaking once your point is made.\n\nContext that may be useful, pulled from Flights:\n'
    content = 'TODO'

    preface + directions + "Here is some context: #{content}\n" + question
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
