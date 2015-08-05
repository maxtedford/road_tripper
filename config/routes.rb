Rails.application.routes.draw do
  force_ssl :only => :callback
  
  get '/dashboard', as: :dashboard, to: 'dashboard#show'
  get '/auth/google_oauth2', as: :login
  get '/auth/google_oauth2/callback', to: 'sessions#create', as: :callback
  get '/logout', as: :logout, to: 'sessions#destroy'
  
  root 'welcome#index'
end
