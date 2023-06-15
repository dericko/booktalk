require "test_helper"

class Api::V1::AskControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_ask_index_url
    assert_response :success
  end
end
