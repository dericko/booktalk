require 'test_helper'
require_relative '../../../../app/services/openai_service'
require 'polars'

class Api::V1::AskControllerTest < ActionDispatch::IntegrationTest
  EMBEDDING_LENGTH = 1536

  setup do
    @question = questions(:one) # Assuming you have a fixture for the Question model
    @service_mock = Minitest::Mock.new
  end

  teardown do
    Rails.cache.clear
  end

  test 'should get index' do
    get api_v1_ask_index_url(secret: ENV.fetch('PUBLIC_API_SECRET'))
    assert_response :success
  end

  test 'should return unauthorized for index without secret' do
    get api_v1_ask_index_url
    assert_response :unauthorized
  end

  test 'should show question' do
    get api_v1_ask_show_url(@question)
    expected_data = { question: @question.question, answer: @question.answer, questionId: @question.id }
    assert_equal expected_data.to_json, response.body
    assert_response :success
  end

  test 'should create new question with correct formatting' do
    question_text = 'Some new question'
    formatted_question_text = 'Some new question?'
    completion_text = 'Some completion'
    @service_mock.expect :get_embedding, Array.new(EMBEDDING_LENGTH, 0), [formatted_question_text]
    @service_mock.expect :get_completion, completion_text, [String]
    OpenaiService.stub(:new, @service_mock) do
      assert_difference('Question.count', 1) do
        post api_v1_ask_create_url, params: { question: question_text }
        assert_equal(
          { question: formatted_question_text, answer: completion_text,
            questionId: Question.last.id }.to_json, response.body
        )
        assert_response :success
      end
    end
    @service_mock.verify
  end

  test 'should look up and incr existing question' do
    Question.stub(:find_by, @question) do
      post api_v1_ask_create_url, params: { question: @question.question }
      expected_data = { question: @question.question, answer: @question.answer, questionId: @question.id }
      assert_equal expected_data.to_json, response.body
      assert_equal @question.ask_count, 2
      assert_response :success
    end
  end
end
