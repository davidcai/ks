puts "\nHomework 1 - Part 5"


class Class
  def attr_accessor_with_history(attr_name)
    attr_name = attr_name.to_s   # make sure it's a string
    attr_history_name = attr_name + "_history"

    attr_reader attr_name        # create the attribute's getter
    attr_reader attr_history_name  # create bar_history getter

    class_eval %{
      define_method(attr_name + "=") do |new_attr_val|
        self.instance_variable_set("@" + attr_name, new_attr_val)
        attr_history_val = self.instance_variable_get("@" + attr_history_name)
        self.instance_variable_set("@" + attr_history_name, (attr_history_val || [nil]) << new_attr_val)
      end
    }
  end
end


class Foo
  attr_accessor_with_history :bar
  attr_accessor_with_history :foo
end


puts "\n"
f = Foo.new
f.bar = 1
f.bar = 2
puts f.bar_history.to_s # => if your code works, should be [nil,1,2]
f2 = Foo.new
f2.bar = "bar"
f2.bar = "bar2"
f2.foo = 1
f2.foo = "foo"
puts f2.bar_history.to_s
puts f2.foo_history.to_s 


puts "\n(a)"


class Numeric
  @@currencies = {"dollar" => 1, "yen" => 0.013, "euro" => 1.292, "rupee" => 0.019}

  def method_missing(method_id)
    singular_currency = method_id.to_s.gsub(/s$/, "")
    if @@currencies.has_key?(singular_currency)
      self * @@currencies[singular_currency]
    else
      super
    end
  end

  def in(currency_id)
    singular_currency = currency_id.to_s.gsub(/s$/, "")
    if @@currencies.has_key?(singular_currency)
      self / @@currencies[singular_currency]
    else
      self
    end
  end
end


puts 5.dollars.in(:euros)
puts 10.euros.in(:rupees)
puts 1.dollar.in(:rupees)
puts 10.rupees.in(:euro)
