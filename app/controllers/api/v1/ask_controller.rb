require_relative '../../../services/openai_service'

class Api::V1::AskController < ApplicationController
  include AskHelper

  # Retrieves a list of all asked questions.
  #
  # Returns an array of question objects.
  def index
    if params[:secret] != ENV.fetch('PUBLIC_API_SECRET')
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end
    questions = Question.all.order(created_at: :desc)
    render json: questions
  end

  # Asks a question.
  #
  # Returns json response with the question and answer.
  def ask
    question_text = question_text()

    prev_q = Question.find_by(question: question_text)
    if prev_q
      prev_q.update(ask_count: prev_q.ask_count + 1)
      render json: { question: prev_q.question, answer: prev_q.answer }
      return
    end

    openai = OpenAIService.new
    question_embeddings = openai.get_embedding(question_text)
    context = generate_context(question_embeddings)
    prompt = generate_prompt(context, question_text)
    answer = openai.get_completion(prompt)

    question = Question.create(
      question: question_text,
      context: context,
      answer: answer,
      ask_count: 1
    )

    print "\n\n## Prompt ##\n #{prompt}\n\n"

    render json: { question: question.question, answer: question.answer }
  end

  private

  def question_text
    params.require(:question)
    question_text = params[:question]
    question_text += '?' unless question_text.end_with?('?')
    question_text
  end
end
