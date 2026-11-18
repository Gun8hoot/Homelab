
NAME						:= Homelab

ENV_LOCATION				:= ./config/.env
DOCKER_COMPOSE_LOCATION		:= ./config/docker-compose.yaml
DOCKER_COMPOSE				:= docker compose --env-file $(ENV_LOCATION) --file $(DOCKER_COMPOSE_LOCATION)

all: up

$(NAME): up

# --- DOCKER RULES ---
up:
	@$(DOCKER_COMPOSE) up --build -d
	@printf "\e[32m[+] Every services have successfully started!\e[0m\n"

down:
	@$(DOCKER_COMPOSE) down
	@printf "\e[32m[+] Every services have successfully stopped!\e[0m\n"

logs:
	@printf "\e[32m[+] Showing every services logs\e[0m\n"
	@$(DOCKER_COMPOSE) logs
	@printf "\e[32m--- END OF LOGS ---\e[0m\n"

ps:
	@printf "\e[32m[+] Showing every $(NAME) launched services\e[0m\n"
	@$(DOCKER_COMPOSE) ps
	@printf "\e[32m--- END OF LAUNCHED SERVICES LIST ---\e[0m\n"

re: down up
# --------------------

# --- OTHER RULES ---
cert:
	# https://www.ibm.com/docs/en/ibm-mq/7.5.0?topic=certificates-distinguished-names
	@openssl req -x509 -nodes -days 365 -newkey rsa:4096 -subj "/C=FR/ST=<REDACTED>/L=<REDACTED>/O=Homelaberzzz/OU=Admin/CN=homelab" -keyout ./secrets/privkey.pem -out ./secrets/fullchain.pem > /dev/null
	@printf "\e[32m[+] New certificated have been created for 1 years\n\e[0m"
# --------------------

.PHONY: up down re ps logs
