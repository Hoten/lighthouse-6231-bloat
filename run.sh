#!/bin/bash -e

yarn install
echo "_______"

python -m SimpleHTTPServer 8000 &> /dev/null &
pid=$!

network_size_jpg=$(node run.js http://localhost:8000/index-jpg.html snapshot-jpg.png)
image_size_jpg=$(stat -f%z snapshot-jpg.png)
bloat_jpg=$(echo "scale=5; $network_size_jpg / $image_size_jpg" | bc)

network_size_png=$(node run.js http://localhost:8000/index-png.html snapshot-png.png)
image_size_png=$(stat -f%z snapshot-png.png)
bloat_png=$(echo "scale=5; $network_size_png / $image_size_png" | bc)

kill "${pid}"

echo "network_size_jpg: $network_size_jpg"
echo "image_size_jpg: $image_size_jpg"
echo "(total bytes of the webpage) / (bytes of a screenshot of that webpage) = $bloat_jpg"

echo -e "\n"

echo "network_size_png: $network_size_png"
echo "image_size_png: $image_size_png"
echo "(total bytes of the webpage) / (bytes of a screenshot of that webpage) = $bloat_png"
