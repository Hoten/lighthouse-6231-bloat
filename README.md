Experiment with web bloat score on a page with JPEGs.

See https://github.com/GoogleChrome/lighthouse/issues/6231

Images from https://www.pexels.com/search/nature/

PNGs made with imagemagick:
```
mogrify -format png imgs/*.jpg
```

Run:
```
./run.sh
```

Output:
```
network_size_jpg: 4607501
image_size_jpg: 128757
(total bytes of the webpage) / (bytes of a screenshot of that webpage) = 35.78446


network_size_png: 27872140
image_size_png: 129379
(total bytes of the webpage) / (bytes of a screenshot of that webpage) = 215.43017
```
