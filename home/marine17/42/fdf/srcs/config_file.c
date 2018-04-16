/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   config_file.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/01 15:37:12 by mbaron            #+#    #+#             */
/*   Updated: 2018/03/02 22:12:19 by mbaron           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "fdf.h"
#include "config.h"

static void		config_file_line_set_param(t_conf *conf, char **params)
{
	if (params[0][0] == 'w')
		conf->win_w = ft_atoi(params[1]);
	else if (params[0][0] == 'h')
			conf->win_h = ft_atoi(params[1]);
	else if (params[0][0] == 'x')
		conf->control->v->x = ft_atoi(params[1]);
	else if (params[0][0] == 'y')
		conf->control->v->y = ft_atoi(params[1]);
	else if (params[0][0] == 'z')
		conf->control->v->z = ft_atoi(params[1]);
	else if (params[0][0] == 'r')
		conf->control->v->rot = ft_atoi(params[1]);
	else if (params[0][0] == 'o')
		conf->control->v->zoom = ft_atoi(params[1]);
	else if (params[0][0] == 'p')
		conf->control->v->proj = ft_atoi(params[1]);
	else if (params[0][0] == 'g')
		conf->control->v->col = ft_atoi(params[1]);
	else if (params[0][0] == 'f')
		conf->control->v->floor = ft_atoi_hex(params[1]);
	else if (params[0][0] == 'c')
		conf->control->v->ceil = ft_atoi_hex(params[1]);
	else if (params[0][0] == 'b')
		conf->control->v->blind = ft_atoi(params[1]);
}

static void		config_file_line(t_conf *conf, char *line)
{
	char	**params;

	if (!(params = ft_strsplit(line, ' ')))
		set_error(conf, "ErrM (config_file_line)", 1);
	if (2 == ft_strsplitnb(params) && params[0][0] && params[0][0] != '#')
		config_file_line_set_param(conf, params);
	ft_strsplitdel(params);
}

void			config_file(t_conf *conf, int argc, char *argv[])
{
	int		fd;
	char	*line;
	int		gnl;
	char	stre[256];
	int		is_config;

	is_config = is_param("-f", argc, argv);
	stre[0] = '\0';
	ft_strclr(stre);
	if (0 > (fd = open(is_config ? argv[is_config] :
		CONFIG_FILE_DEFAULT, O_RDONLY)))
		set_error(conf, ft_strcat(ft_strncpy(stre, is_config
			? argv[is_config]
			: CONFIG_FILE_DEFAULT, 252), " : "), 1);
	if (!(line = ft_strnew(0)))
		set_error(conf, "ErrM (line)", 1);
	while ((gnl = get_next_line(fd, &line)))
	{
		if (-1 == gnl)
			set_error(conf, "Error in GNL", 1);
		config_file_line(conf, line);
	}
	ft_strdel(&line);
}
