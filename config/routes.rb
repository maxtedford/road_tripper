Rails.application.routes.draw do
  
  get '/login', as: :login, to: 'sessions#new'
  
  root 'welcome#index'
end
