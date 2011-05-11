namespace :db do
  task :environment do
    require 'active_record'
    ActiveRecord::Base.establish_connection(
      :adapter  => 'sqlite3',
      :database => 'sinatra_application.sqlite3.db'
    )
  end
end

