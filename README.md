# Web-based image uploader for OpenDroneMap

Based on the tutorial at [coligo](http://coligo.io/building-ajax-file-uploader-with-node/)

Now triggers an ODM run on each set of uploaded images. 

Currently requires environment variables to be set up before starting:
```shell
export PYTHONPATH=$PYTHONPATH:path-to-ODM/SuperBuild/install/lib/python2.7/dist-packages:path-to-ODM/SuperBuild/src/opensfm
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:path-to-ODM/SuperBuild/install/lib
```
This requirement will be fixed in the next update.
