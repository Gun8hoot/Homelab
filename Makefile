
NAME						:= Homelab

DOCKER						:= docker

RASBERRYPI_MAKE_LOCATION	:= ./config/rasberry-pi
DELL_MAKE_LOCATION			:= ./config/dell-laptop
ASUS_MAKE_LOCATION			:= ./config/asus-laptop

all:
	@printf "Usage:\n\t- rasberry : Launched every services who run on my rasberry pi\n\t- dell : Launched every services who run on my dell laptop\n"

up: rasberry-up dell-up asus-up

down: rasberry-down dell-down asus-down

# --- UP RULES ---
rasberry-up:
	@make -C $(RASBERRYPI_MAKE_LOCATION) up

dell-up:
	@make -C $(DELL_MAKE_LOCATION) up

asus-up:
	@make -C $(ASUS_MAKE_LOCATION) up
# ---------------

# --- DOWN RULES ---
rasberry-down:
	@make -C $(RASBERRYPI_MAKE_LOCATION) down

dell-down:
	@make -C $(DELL_MAKE_LOCATION) down

asus-down:
	@make -C $(ASUS_MAKE_LOCATION) down
# ---------------

ps:
	@$(DOCKER) ps

re: down up

.PHONY: up down re ps logs
