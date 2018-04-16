/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fdf.h                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/01 09:23:07 by mbaron            #+#    #+#             */
/*   Updated: 2018/03/02 22:10:12 by mbaron           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FDF_H
# define FDF_H
# include <stdio.h>
# include <stdlib.h>
# include <errno.h>
# include <limits.h>
# include <math.h>
# include <float.h>
# include "mlx.h"
# include "mlx_key_macos.h"
# include "libft.h"
# include "fdf_define.h"

typedef unsigned int	t_col;
typedef	struct			s_vtx
{
	double	x;
	double	y;
	double	z;
	double	visible;
	t_col	c;
}						t_vtx;
typedef	struct			s_vtxi
{
	int		x;
	int		y;
	t_col	c;
}						t_vtxi;
typedef struct			s_vector
{
	t_vtxi	*o;
	t_vtxi	*d;
}						t_vector;
typedef struct			s_mapi
{
	int			h;
	int			w;
	double		hmin;
	double		hmax;
	t_vtx		***vtx;
}						t_mapi;
typedef	struct			s_colc
{
	t_col	floor;
	t_col	ceil;
}						t_colc;
typedef struct			s_rect
{
	int		x;
	int		y;
	int		w;
	int		h;
	t_col	c_bg;
	t_col	c_bd;
}						t_rect;
typedef struct			s_values
{
	double		x;
	double		y;
	int			z;
	int			rot;
	int			zoom;
	double		scale;
	int			proj;
	int			blind;
	int			col;
	int			floor;
	int			ceil;
}						t_values;
typedef struct			s_param
{
	char		*name;
	int			min;
	int			max;
	int			kdn;
	int			kup;
	t_rect		*pos_v;
	t_rect		**buttons;
}						t_param;
typedef struct			s_control
{
	char		*title;
	int			nb;
	t_values	*v;
	t_values	*n;
	t_param		**p;
}						t_control;
typedef struct			s_map
{
	t_rect		*rect;
	double		scale;
	t_vtx		***vtx;
}						t_map;
typedef struct			s_img
{
	void	*img;
	char	*ptr;
	int		bpp;
	int		sl;
	int		end;
	int		w;
	int		h;
	int		*maxy;
	int		*tmp_maxy;
}						t_img;
typedef struct			s_mouse
{
	int			button;
	int			x;
	int			y;
}						t_mouse;
typedef struct			s_poly
{
	t_vtx			*vtx[4];
	int				i;
	int				j;
	double			minx;
	double			miny;
	int				minsx;
	int				maxsx;
	struct s_poly	*next;
}						t_poly;
typedef struct			s_conf
{
	int				win_w;
	int				win_h;
	t_control	*control;
	t_mapi		*mapi;
	t_map		*mapt;
	t_map		*maps;
	t_poly		*pls;
	double		**matrix;
	void		*mlx;
	void		*win;
	t_img		*i_map;
	t_img		*i_control;
	t_img		*i_value;
	t_img		*i_btn;
	int			keypressed;
	t_mouse		*mouse;
}						t_conf;
/*
**	File config.c
*/
t_conf					*config_init(int argc, char *argv[]);
/*
**	File render.c
*/
void					render(t_conf *conf);
/*
**	File put_control_init.c
*/
void					put_control_init(t_conf *conf);
/*
**	File put_control_params.c
*/
void					put_control_values(t_conf *conf);
/*
**	File put_map.c
*/
void					put_map(t_conf *conf);
/*
**	File polygone.c
*/
void					polygone_insert(t_conf *conf, int i, int j);
/*
**	File put_lines.c
*/
void					put_polygones(t_conf *conf);
void					put_vectors(t_conf *conf);
/*
**	File put_line.c
*/
void					put_line(t_conf *conf, t_vtx *v1, t_vtx *v2);
/*
**	File colors.c
*/
void					set_colors(t_conf *conf);
int						get_grad_col(int co, int cd, double p);
/*
**	File model2proj.c
*/
void					view2proj(t_conf *conf);
void					model2view(t_conf *conf);
/*
**	File hooks_keyboard.c
*/
int						hook_keydown(int key, t_conf *conf);
int						hook_keyup(int key, t_conf *conf);
int						hook_close(t_conf *conf);
/*
**	File hooks_mouse.c
*/
void					mouse_init(t_mouse *mouse);
void					mouse_set(t_mouse *mouse, int button, int x, int y);
int						hook_mousedown(int button, int x, int y, t_conf *conf);
int						hook_mouseup(int button, int x, int y, t_conf *conf);
int						hook_mousemove(int x, int y, t_conf *conf);
/*
**	File actions.c
*/
int						value_add(t_conf *conf, int i);
int						value_sub(t_conf *conf, int i);
void					mouse_change_rot(t_conf *conf, int xm, int ym);
/*
**	File matrix.c
*/
double					**matrix_init(t_conf *conf, t_values *v);
void					matrix_change_orig(t_conf *conf, int hor, int add);
void					matrix_change_xy(t_conf *conf, int xm, int ym);
void					matrix_change_rot(t_conf *conf, int add);
/*
**	File destroy.c
*/
void					destroy(t_conf *conf);
void					destroy_img(t_conf *conf, t_img *img);
/*
**	File helper.c
*/
int						is_correct_arg(char *str);
unsigned int			ft_atoi_hex(char *str);
void					*init_pointer(t_conf *conf, size_t size,
	char *str_error);
int						set_error(t_conf *conf, char *str, int exit);
void					copy_control(t_conf *conf);
/*
**	File helper_geom.c
*/
double					deg2rad(int deg);
t_rect					*get_rect(int x, int y, int w, int h);
void					fill_rect(t_img *img, t_rect *rect);
t_vector				*set_vector(t_vtx *v1, t_vtx *v2);
#endif
