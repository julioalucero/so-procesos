require 'rubygems'
require 'sinatra/base'

module Procesos
  class Website < Sinatra::Base
    set :root, File.expand_path("../../../", __FILE__)

    get '/' do
      redirect :index
    end
  end
end
