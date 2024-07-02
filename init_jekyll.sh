rbenv init
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc
#rbenv install 3.1.0
rbenv global 3.1.0
#ruby -v
#which ruby
#bundle show minima
bundle exec jekyll serve --draft
