# syntax=docker/dockerfile:1

FROM node:18-alpine
# ENV NODE_ENV=production

ENV DB_HOST=db.gtjtxwpcbbbrloremgtq.supabase.co
# ENV ANOTHER_VARIABLE=another_value

WORKDIR /techstore/backend

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --legacy-peer-deps
RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]