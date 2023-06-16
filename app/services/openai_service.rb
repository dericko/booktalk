require 'json'
require 'openai'

class OpenAIService
  EMBEDDINGS_MODEL = 'text-embedding-ada-002'
  COMPLETIONS_MODEL = 'text-davinci-003'

  def initialize
    @client = OpenAI::Client.new(access_token: ENV.fetch('OPENAI_API_KEY'))
  end

  # Requests OpenAI /embeddings to get embeddings for a string.
  #
  # Params:
  # - text (string)
  #
  # Returns the embedding (array of floats).
  def get_embedding(text)
    return '' if text.nil?

    res = @client.embeddings(
      parameters: {
        model: EMBEDDINGS_MODEL,
        input: text
      }
    )
    res['data'][0]['embedding']
  end

  # Makes an API request to OpenAI /completions to get an answer to a question.
  #
  # Params:
  # - prompt (string): a text prompt for OpenAI.
  #
  # Note: currently using RestClient because ruby client was giving me issues for @client.completions
  #
  # Returns the answer (string).
  def get_completion(prompt)
    return '' if prompt.nil?

    res = @client.completions(
      parameters: {
        model: COMPLETIONS_MODEL,
        prompt: prompt,
        temperature: 0,
        max_tokens: 150
      }
    )
    res['choices'][0]['text']
  end
end
