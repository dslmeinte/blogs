#!/bin/bash

DRAWIO=/Applications/draw.io.app/Contents/MacOS/draw.io

function export() {
  $DRAWIO --export --format svg --border 2 $1
}

export "program-execution.drawio"
export "expression-evaluation.drawio"

