/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   render.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/28 15:58:16 by mbaron            #+#    #+#             */
/*   Updated: 2018/03/02 22:13:11 by mbaron           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "fdf.h"

static t_img	*init_img(t_conf *conf, int w, int h)
{
	t_img	*img;

	img = (t_img *)init_pointer(conf, sizeof(t_img), "init_img");
	if (!img->img && !(img->img = mlx_new_image(conf->mlx, w, h)))
		set_error(conf, "Echec in MLX new image (map)", 1);
	img->ptr = mlx_get_data_addr(img->img, &(img->bpp),
		&(img->sl), &(img->end));
	img->bpp /= 8;
	img->w = w;
	img->h = h;
	img->maxy = NULL;
	img->tmp_maxy = NULL;
	return (img);
}

static void		init_img_map(t_conf *conf, t_img *img)
{
	int		i;

	if (!img->maxy)
		img->maxy = (int *)init_pointer(conf, img->w * sizeof(int),
			"ErrM (maxy)");
	if (!img->tmp_maxy)
		img->tmp_maxy = (int *)init_pointer(conf, img->w * sizeof(int),
			"ErrM (tmp_maxy)");
	i = -1;
	while (++i < img->w)
	{
		img->maxy[i] = INT_MAX;
		img->tmp_maxy[i] = INT_MAX;
	}
}

static void		render_init(t_conf *conf)
{
	ft_putendl("Init MLX");
	if (!(conf->mlx = mlx_init()))
		set_error(conf, "Echec in MLX init", 1);
	if (!conf->win && !(conf->win = mlx_new_window(conf->mlx,
		conf->win_w, conf->win_h, "My Map")))
		set_error(conf, "Echec in MLX new window", 1);
	conf->i_control = (t_img *)init_pointer(conf, sizeof(t_img),
		"ErrM (i_control)");
	conf->i_map = (t_img *)init_pointer(conf, sizeof(t_img),
		"ErrM (i_map)");
	conf->i_value = (t_img *)init_pointer(conf, sizeof(t_img),
		"ErrM (i_value)");
	conf->i_btn = (t_img *)init_pointer(conf, sizeof(t_img),
		"ErrM (i_btn)");
	conf->i_map = init_img(conf, FDF_MAP_W, FDF_MAP_H);
	conf->i_control = init_img(conf, FDF_CL_W, FDF_CL_HT);
	conf->i_value = init_img(conf, (FDF_CL_C_W) * 2, FDF_CL_HT);
	conf->i_btn = init_img(conf, FDF_CL_C_W, FDF_CL_C_H);
	conf->keypressed = 0;
	conf->mouse = (t_mouse *)init_pointer(conf, sizeof(t_mouse),
		"ErrM (mouse)");
	mouse_init(conf->mouse);
}

static void		clear_screen(t_conf *conf)
{
	t_rect *rect;

	rect = get_rect(0, 0, conf->i_value->w, conf->i_value->h);
	rect->c_bg = FDF_CL_BG_COLOR;
	fill_rect(conf->i_value, rect);
	mlx_put_image_to_window(conf->mlx, conf->win, conf->i_value->img,
		FDF_CL_V_X, FDF_CL_X + FDF_CL_H);
	ft_memdel((void **)rect);
	rect = get_rect(0, 0, conf->i_map->w, conf->i_map->h);
	rect->c_bg = FDF_CL_BG_COLOR;
	fill_rect(conf->i_map, rect);
	ft_memdel((void **)rect);
	init_img_map(conf, conf->i_map);
}

void			render(t_conf *conf)
{
	if (!conf->mlx)
	{
		render_init(conf);
		put_control_init(conf);
		destroy_img(conf, conf->i_control);
	}
	clear_screen(conf);
	put_control_values(conf);
	put_map(conf);
	mlx_put_image_to_window(conf->mlx, conf->win, conf->i_map->img,
		FDF_MAP_X, FDF_MAP_Y);
}
