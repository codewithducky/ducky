class ApplicationController < ActionController::Base
  http_basic_authenticate_with  :name => (Rails.application.credentials[:admin_username] or "admin"), :password => (Rails.application.credentials[:admin_password] or "admin")
end
