binary-ring-buffer
==================

Most of the implementations of ring/circular buffers on NPM utilized
an Array to back them. This uses a Buffer and as such is better suited
to being used for binary data.
