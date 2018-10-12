Experiment with web bloat score on a page with JPEGs.

See https://github.com/GoogleChrome/lighthouse/issues/6231

Images from https://www.pexels.com/search/nature/

PNGs made with imagemagick:
```
mogrify -format png imgs/*.jpg
```

Run:
```
./run.shj
```

Output:
```
network_size_jpg: 25660384
image_size_jpg: 8826814
(total bytes of the webpage) / (bytes of a screenshot of that webpage) = 2.90709


network_size_png: 155655820
image_size_png: 8796947
(total bytes of the webpage) / (bytes of a screenshot of that webpage) = 17.69430
```
