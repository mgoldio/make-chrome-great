require 'sinatra'

get '/' do
  send_file "test.html"
end
