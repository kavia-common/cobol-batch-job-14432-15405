#!/bin/bash
cd /home/kavia/workspace/code-generation/cobol-batch-job-14432-15405/UIService
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

