
def parse_vertices str
  str.split.map { |point| point.sub ',', ' ' }
end

def make_polygon_with_step vertices, step
  sides = vertices.size

  (0...sides * step).step(step).map do |i|
    vertices[i % sides]
  end
end

def make_star_polygon vertices
  make_polygon_with_step vertices, sides / 2
end

def to_svg_path vertices
  "M#{vertices.first} #{vertices[1..-1].map { |v| "L#{v}"}.join ' '} Z"
end

def string_to_svg_path_star_polygon str
  to_svg_path make_star_polygon(parse_vertices str)
end


# --------------------------------------------------


class Coordinate
  attr_accessor :x, :y

  def initialize x, y
    @x = x
    @y = y
  end

  def translate x, y
    Coordinate.new @x + x, @y + y
  end
end

class Square
  attr_accessor :size
  attr_reader :vertices

  def initialize origin_or_vertices, size, rotate = 0

    if origin_or_vertices.instance_of? Array
      @vertices = origin_or_vertices
    else
      @vertices = [
        origin_or_vertices.dup,
        origin_or_vertices.translate(size, 0),
        origin_or_vertices.translate(size, size),
        origin_or_vertices.translate(0, size)
      ]
    end

    @vertices.rotate! rotate
    @size = size
  end

  def rotate degrees
    delta_x = Math.cos(degrees * Math::PI / 180) * @size
    delta_y = Math.sin(degrees * Math::PI / 180) * @size

    Square.new [
      @vertices[0],
      @vertices[1].translate(@size - delta_x, -delta_y),
      @vertices[2].translate(@size - delta_x + delta_y, @size - delta_x - delta_y),
      @vertices[3].translate(delta_y, @size - delta_x)
    ], @size
  end

  def to_vertices
    @vertices.map { |c| "#{c.x} #{c.y}" }
  end
end

def square_flower square, rotation

  squares = [square]

  to_svg_path (0...360).step(rotation).map { |angle| square.rotate angle }.flat_map(&:to_vertices)
end
