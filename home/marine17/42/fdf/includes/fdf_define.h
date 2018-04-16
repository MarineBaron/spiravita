/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fdf_define.h                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/01 09:23:07 by mbaron            #+#    #+#             */
/*   Updated: 2018/03/02 22:16:41 by mbaron           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FDF_DEFINE_H
# define FDF_DEFINE_H
# define FDF_WIN_W 1000
# define FDF_WIN_H 800
# define FDF_MARGE 10
# define FDF_CL_W 400
# define FDF_CL_X FDF_MARGE
# define FDF_CL_Y FDF_MARGE
# define FDF_MAP_W FDF_WIN_W - FDF_CL_W - 3 * FDF_MARGE
# define FDF_MAP_H FDF_WIN_H - 2 * FDF_MARGE
# define FDF_MAP_X FDF_CL_W + 2 * FDF_MARGE
# define FDF_MAP_Y FDF_MARGE
# define FDF_CL_MARGE 2
# define FDF_CL_H 30
# define FDF_CL_HT 400
# define FDF_CL_C_H FDF_CL_H - 2 * FDF_CL_MARGE
# define FDF_CL_C_W FDF_CL_C_H
# define FDF_CL_P_X FDF_MARGE + 2 * FDF_CL_MARGE
# define FDF_CL_C2_X FDF_MARGE + FDF_CL_W - FDF_CL_C_W - FDF_CL_MARGE
# define FDF_CL_C1_X FDF_CL_C2_X - FDF_CL_MARGE - FDF_CL_C_W
# define FDF_CL_V_X FDF_CL_C1_X - FDF_CL_MARGE - 2 * FDF_CL_C_W
# define FDF_CL_C_DEC 7
# define FDF_WIN_BG_COLOR 0x000000
# define FDF_MAP_BG_COLOR 0x202020
# define FDF_MAP_BD_COLOR 0x202020
# define FDF_CL_BG_COLOR 0x202020
# define FDF_CL_BD_COLOR 0x303030
# define FDF_CL_BTN1_COLOR 0x404040
# define FDF_CL_BTN2_COLOR 0x505050
# define FDF_CL_TXT1_COLOR 0xA0A0A0
# define FDF_CL_TXT2_COLOR 0xC0C0C0
# define FDF_P_NB 10
# define FDF_T_X "X center position"
# define FDF_T_Y "Y center position"
# define FDF_T_Z "Z/Y ratio"
# define FDF_T_R "Rotation (deg)"
# define FDF_T_O "Zoom"
# define FDF_T_P "Projection (0/1)"
# define FDF_T_B "Blind faces (0/1)"
# define FDF_T_G "Color Gradient (0/1)"
# define FDF_T_F "Floor's color"
# define FDF_T_C "Ceil's color"
# define FDF_P_X 0
# define FDF_P_Y 0
# define FDF_P_Z 1
# define FDF_P_O 1
# define FDF_P_R 0
# define FDF_P_P 0
# define FDF_P_B 0
# define FDF_P_G 1
# define FDF_P_F 0xFF0000
# define FDF_P_C 0x00FF00
# define FDF_KUP_X KEY_RIGHT
# define FDF_KDN_X KEY_LEFT
# define FDF_KUP_Y KEY_UP
# define FDF_KDN_Y KEY_DOWN
# define FDF_KUP_Z KEY_PAGE_UP
# define FDF_KDN_Z KEY_PAGE_DOWN
# define FDF_KUP_O KEY_PAD_ADD
# define FDF_KDN_O KEY_PAD_SUB
# define FDF_KUP_R KEY_DOT
# define FDF_KDN_R KEY_COMMA
# define FDF_KUP_P KEY_1
# define FDF_KDN_P KEY_2
# define FDF_KUP_G KEY_3
# define FDF_KDN_G KEY_4
# define FDF_KUP_F KEY_C
# define FDF_KDN_F KEY_V
# define FDF_KUP_C KEY_F
# define FDF_KDN_C KEY_G
# define FDF_KUP_B KEY_5
# define FDF_KDN_B KEY_6
#endif
