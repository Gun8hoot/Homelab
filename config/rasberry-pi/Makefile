
NAME													:= Rasberry Pi

DOCKER_COMPOSE								:= docker compose
DOCKER_COMPOSE_CONFIG_PATH		:= ./srcs/docker_compose.yaml
DOCKER_COMPOSE_PARAM					:= -f $(DOCKER_COMPOSE_CONFIG_PATH)

all: $(NAME)

re: down up

up:
	@printf "\e[0;32m[+] Launching $(NAME) services.\n\e[0m"
	@$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_PARAM) up

down:
	@printf "\e[0;32m[+] Shutting down every $(NAME) services.\n\e[0m"
	@$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_PARAM) down

ps:
	@printf "\e[0;32m[+] Listing every $(NAME) launched services.\n\e[0m"
	@$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_PARAM) ps 

exec:
	@if [ "$(CONTAINER)" != "" ] && [ "$(COMMAND)" != "" ]; then \
		printf "\e[0;32m[+] Executing $(COMMAND) on $(CONTAINER) container.\n\e[0m"; \
		$(DOCKER_COMPOSE) $(DOCKER_COMPOSE_PARAM) exec $(CONTAINER) $(COMMAND); \
	elif [ "$(CONTAINER)" == "" ]; then \
		printf "\e[0;31m[+] Missing CONTAINER parameter\n\e[0;33mUsage : $(DOCKER_COMPOSE) $(DOCKER_COMPOSE_PARAM) CONTAINER=\"container_name\" COMMAND=\"command_path\".\n\e[0m"; \
	elif [ "$(COMMAND)" == "" ]; then \
		printf "\e[0;31m[+] Missing COMMAND parameter\n\e[0;33mUsage : $(DOCKER_COMPOSE) $(DOCKER_COMPOSE_PARAM) CONTAINER=\"container_name\" COMMAND=\"command_path\".\n\e[0m"; \
	fi

.PHONY: all re up down ps exec
