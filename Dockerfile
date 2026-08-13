FROM node:20-alpine

WORKDIR /app

COPY package.json build.js ./
COPY dist ./dist

RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/boot.js", "--host", "0.0.0.0", "--port", "3000"]
