puts "\nHomework 1 - Part 4"


class Dessert
  def initialize(name, calories)
    @name = name
    @calories = calories
  end
  
  def healthy?
    @calories < 200
  end
  
  def delicious?
    true
  end

  attr_accessor :name, :calories
end


class JellyBean < Dessert
  def initialize(name, calories, flavor)
    super(name, calories)
    @flavor = flavor
  end
  
  def delicious?
    if @flavor == "black licorice"
      false
    else
      super
    end
  end

  attr_accessor :flavor
end


puts "\n(a) Ladyfinger"
ladyfinger = Dessert.new("Ladyfinger", 210)
puts %[Healthy? #{ladyfinger.healthy?}]
puts %[Delicious? #{ladyfinger.delicious?}]


puts "\n(b) Jelly bean"
jellyBean = JellyBean.new("Jelly bean", 100, "black licorice")
puts %[Healthy? #{jellyBean.healthy?}]
puts %[Delicious? #{jellyBean.delicious?}]

