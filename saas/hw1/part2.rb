puts "\nHomework 1 - Part 2"


class WrongNumberOfPlayersError < StandardError ; end
class NoSuchStrategyError < StandardError ; end


puts "\n(a)"


def rps_game_winner(game)
  raise WrongNumberOfPlayersError unless game.length == 2

  strategies = ["R", "S", "P"]
  s1 = game[0][1].upcase
  s2 = game[1][1].upcase

  raise NoSuchStrategyError unless strategies.include?(s1) || strategies.include?(s2)

  delta = strategies.index(s1) - strategies.index(s2)
  if delta == 0 || delta == -1 || delta == 2
    winner_idx = 0
  elsif delta == 1 || delta == -2
    winner_idx = 1
  end

  game[winner_idx]
end


winner = rps_game_winner([ ["Armando", "P"], ["Dave", "S"] ])
puts %[#{winner} wins]


puts "\n(b)"


def rps_tournament_winner(tournament)
  rps_game_winner([
    rps_game_winner([ rps_game_winner(tournament[0][0]), rps_game_winner(tournament[0][1]) ]), 
    rps_game_winner([ rps_game_winner(tournament[1][0]), rps_game_winner(tournament[1][1]) ])
  ])
end


winner = rps_tournament_winner(
  [
    [
      [ ["Armando", "P"], ["Dave", "S"] ],
      [ ["Richard", "R"],  ["Michael", "S"] ],
    ],
    [ 
      [ ["Allen", "S"], ["Omer", "P"] ],
      [ ["David E.", "R"], ["Richard X.", "P"] ]
    ]
  ]
)
puts %[#{winner} wins]
