FROM python

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

RUN apt update && apt install -y curl \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" \
    && nvm install 18 \
    && nvm use 18 \
    && npm install -g svgo

COPY . .

CMD ["bash", "-c", "source $HOME/.nvm/nvm.sh && svgo -rf ./static/main/images -o ./static/main/images"]