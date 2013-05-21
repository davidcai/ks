puts "\nHomework 1 - Part 6"


class CartesianProduct
  include Enumerable

  def initialize(seq1, seq2)
    @product = seq1.each_with_object([]) do |v1, prod|
      seq2.each_with_object(prod) do |v2, prod|
        prod << [v1, v2]
      end
    end
  end

  def each(&block)
    @product.each &block
  end
end


#Examples of use
c = CartesianProduct.new([:a,:b], [4,5])
c.each { |elt| puts elt.inspect }
# [:a, 4]
# [:a, 5]
# [:b, 4]
# [:b, 5]
c = CartesianProduct.new([:a,:b], [])
c.each { |elt| puts elt.inspect }
# (nothing printed since Cartesian product
# of anything with an empty collection is empty)



