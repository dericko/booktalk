class Api::V1::AskController < ApplicationController
  def index
    params.require(:question)
    render json: { message: "Hello Ask! #{params[:question]}" }

  end

end
