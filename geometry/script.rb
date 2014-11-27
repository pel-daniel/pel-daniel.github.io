
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
