/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hooks_keyboard.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/06 16:19:14 by mbaron            #+#    #+#             */
/*   Updated: 2018/03/02 22:30:20 by mbaron           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "fdf.h"

int		hook_close(t_conf *conf)
{
	(void)conf;
	destroy(conf);
	exit(EXIT_SUCCESS);
	return (0);
}

int		hook_keydown(int key, t_conf *conf)
{
	conf->keypressed = key;
	printf("key : %d\n", conf->keypressed);
	return (0);
}

int		hook_keyup(int key, t_conf *conf)
{
	int		i;

	printf("key : %d\n", key);
	//(void)key;
	if (conf->keypressed == KEY_ESCAPE)
	{
		destroy(conf);
		exit(EXIT_SUCCESS);
	}

	i = -1;
	while (++i < conf->control->nb)
	{
		if (conf->keypressed == conf->control->p[i]->kup
			|| conf->keypressed == conf->control->p[i]->kdn)
		{
			copy_control(conf);
			if (conf->keypressed == conf->control->p[i]->kup)
				value_add(conf, i);
			else
				value_sub(conf, i);
			conf->keypressed = 0;
			return (0);
		}
	}
	conf->keypressed = 0;
	return (0);
}
