FROM node:20

RUN apt-get update && apt-get install -y \
  tesseract-ocr \
  tesseract-ocr-ara \
  && apt-get clean

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# COPY ./ocr/ .

EXPOSE 8000
CMD ["node", "run.js"]
