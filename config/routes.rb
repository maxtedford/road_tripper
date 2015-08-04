Rails.application.routes.draw do
  
  get '/dashboard', as: :dashboard, to: 'dashboard#show'
  
  root 'welcome#index'
end
