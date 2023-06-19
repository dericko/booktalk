Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'ask', to: 'ask#index', as: :ask_index
      post 'ask', to: 'ask#ask', as: :ask_create
      get 'ask/:id', to: 'ask#show', as: :ask_show
    end
  end
  root 'home#index'
  get '/*path', to: 'home#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
