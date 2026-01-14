#!/bin/bash
cd /home/kavia/workspace/code-generation/frontend-notes-app-199075-199084/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

