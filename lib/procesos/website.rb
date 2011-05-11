require 'rubygems'
require 'sinatra/base'

module Procesos
  class Website < Sinatra::Base
    set :root, File.expand_path("../../../", __FILE__)

    get '/' do
      redirect :index
    end

    get '/hola' do
      'hola mundo cruel'
    end
  end
end
