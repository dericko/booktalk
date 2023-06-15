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
    # 1. turn question into embeddings [1,2,3,...n]
    # 2. get similarity with q_emb and
    # 1. question context embeddings
    # construct prompt to openai.completion API

    "I'm asking a question but don't yet have the context for you. Here's the question: #{question}}"
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
