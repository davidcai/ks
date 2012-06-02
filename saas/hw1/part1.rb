puts 'Homework 1 - Part 1'


puts '(a)'


def palindrome?(string)
 s = string.gsub(/\W/, '').downcase
 s == s.reverse
end


[ "A man, a plan, a canal -- Panama", 
  "Madam, I'm Adam!", 
  "Abracadabra"
].each do |s|
  puts %["#{s}" => #{palindrome?(s)}]
end


puts '(b)'


def count_words(string)
  counts = {}

  string.downcase.split(/\b/).each do |w|
    if (w =~ /\w/) 
      counts[w] = (counts[w].nil?) ? 1 : counts[w] + 1
    end
  end

  counts
end


[ "A man, a plan, a canal -- Panama", 
  "Doo bee doo bee doo" 
].each do |s|
  puts %["#{s}" => #{count_words(s)}]
end
