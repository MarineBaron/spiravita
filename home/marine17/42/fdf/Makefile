# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2018/01/08 14:19:31 by mbaron            #+#    #+#              #
#    Updated: 2018/03/02 21:48:03 by mbaron           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME			=		fdf

DIR				=		.

DIR_SRCS		=		$(DIR)/srcs

DIR_HEADERS		=		$(DIR)/includes

DIR_LIB			=		$(DIR)/libft

DIR_LIB_HEADERS	=		$(DIR_LIB)/includes

DIR_MLX			=		$(DIR)/minilibx_macos

DIR_MLX_HEADERS	=		$(DIR_MLX)

INC				=		/usr/local/include

INCLIB			=		$(INC)/../lib

LIB				=		-L$(DIR_LIB) -lft

MLX				=		-L$(INCLIB) -lmlx -framework OpenGL -framework AppKit

HEADERS			=		-I$(DIR_HEADERS)			\
						-I$(DIR_LIB_HEADERS)		\
						-I$(DIR_MLX_HEADERS)		\
						-I$(INC)

SRCS			=		$(DIR_SRCS)/main.c					\
						$(DIR_SRCS)/config.c				\
						$(DIR_SRCS)/config_default.c		\
						$(DIR_SRCS)/config_file.c			\
						$(DIR_SRCS)/config_map.c			\
						$(DIR_SRCS)/config_map_create.c		\
						$(DIR_SRCS)/render.c				\
						$(DIR_SRCS)/put_control_init.c		\
						$(DIR_SRCS)/put_control_params.c	\
						$(DIR_SRCS)/put_map.c				\
						$(DIR_SRCS)/polygone.c				\
						$(DIR_SRCS)/put_lines.c				\
						$(DIR_SRCS)/put_line.c				\
						$(DIR_SRCS)/colors.c				\
						$(DIR_SRCS)/model2proj.c			\
						$(DIR_SRCS)/hooks_keyboard.c		\
						$(DIR_SRCS)/hooks_mouse.c			\
						$(DIR_SRCS)/actions.c			\
						$(DIR_SRCS)/matrix.c				\
						$(DIR_SRCS)/destroy.c				\
						$(DIR_SRCS)/helper.c				\
						$(DIR_SRCS)/helper_geom.c

OBJS			=		$(SRCS:.c=.o)

CC				=		gcc

CFLAGS			=		-Wall -Wextra -g -fsanitize=address

RM				=		rm -f

all				:		$(NAME)

$(NAME)			:		$(OBJS)
						$(MAKE) -C $(DIR_LIB)
						$(CC) -o $(NAME) $(OBJS) $(CFLAGS) $(HEADERS) \
						$(LIB) $(MLX)

%.o				:		%.c
						$(CC) -o $@ -c $< $(CFLAGS) $(HEADERS)

clean			:
						$(MAKE) -C $(DIR_LIB) clean
						$(RM) $(OBJS)

fclean			:		clean
						$(MAKE) -C $(DIR_LIB) fclean
						$(RM) $(NAME)

re				:		fclean all

.PHONY			: 		all clean fclean re libft
