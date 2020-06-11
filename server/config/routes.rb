Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/', to: redirect('/reports')

  resources :snapshots
  resources :reports

  resources :login

  namespace :api do
    resources :snapshots, :reports, :machines, only: [:create]
  end
end
