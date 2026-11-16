
NAME					:= Asus laptop

DOCKER_COMPOSE_PARAM	:= -f ./srcs/docker-compose.yaml --env-file ./.env
DOCKER_COMPOSE			:= docker compose $(DOCKER_COMPOSE_PARAM)

up:
	@mkdir -p ~/infra_data
	@$(DOCKER_COMPOSE) up -d --build
	@printf "\e[32m[+] $(NAME) infrastructure is up\e[0m\n"


down:
	@$(DOCKER_COMPOSE) down
	@printf "\e[32m[+] $(NAME) infrastructure is down\e[0m\n"

ps:
	@$(DOCKER_COMPOSE) ps

logs:
	@$(DOCKER_COMPOSE) logs

re: down up

.PHONY: up down re ps logs
