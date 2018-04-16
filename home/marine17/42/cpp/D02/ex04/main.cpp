/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbaron <mbaron@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/07 10:37:55 by mbaron            #+#    #+#             */
/*   Updated: 2018/03/08 08:39:35 by mbaron           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Fixed.hpp"
int	parse_number(std::string & expr, Fixed & result);
int	parse_factors(std::string & expr, Fixed & result);
int parse_sum(std::string & expr, Fixed & result);
int parse_expr(std::string & expr, Fixed & result);

int	parse_number(std::string & expr, Fixed & result)
{
	float 	f = 0;
	Fixed	n1;

	while (expr[0] == ' ')
		expr.erase(0,1);
	if (expr[0] == '(')
	{
		expr.erase(0,1);
		parse_sum(expr, n1);
		if (expr[0] == ')')
			expr.erase(0,1);
		result = n1;
		return (1);
	}
	std::stringstream ss(expr);
	ss >> f;
	result = f;
	if (expr[0] == '-')
		expr.erase(0,1);
	while (expr[0] > 47 && expr[0] < 58)
		expr.erase(0,1);
	if (expr[0] == '.')
		expr.erase(0,1);
	while (expr[0] > 47 && expr[0] < 58)
		expr.erase(0,1);
	return (1);
}

int	parse_factors(std::string & expr, Fixed & result)
{
	Fixed	n1;
	Fixed	n2;
	char	op;

	if (!parse_number(expr, n1))
		return (0);
	while (expr.length())
	{
		while (expr[0] == ' ')
			expr.erase(0,1);
		if (!expr.length())
		{
			result = n1;
			return (1);
		}
		op = expr[0];
		if (op != '*' && op != '/')
		{
			result = n1;
			return (1);
		}
		expr.erase(0,1);
		if (!parse_number(expr, n2))
			return (0);
		if (op == '*')
			n1 *= n2;
		else if (n2 != 0)
			n1 /= n2;
		else
			return (0);
	}
	result = n1;
	return (1);
}

int 	parse_sum(std::string & expr, Fixed & result)
{
	Fixed	n1;
	Fixed	n2;
	char	op;

	if (!parse_factors(expr, n1))
		return (0);
	while (expr.length())
	{
		while (expr[0] == ' ')
			expr.erase(0,1);
		if (!expr.length())
		{
			return (1);
		}
		op = expr[0];
		if (op != '+' && op != '-')
		{
			result = n1;
			return (1);
		}
		expr.erase(0,1);
		if (!parse_factors(expr, n2))
			return (0);
		if (op == '+')
			n1 += n2;
		else
			n1 -= n2;
	}
	result = n1;
	return (1);
}

int		parse_expr(std::string & expr, Fixed & result)
{
	size_t			l;
	Fixed				n1;

	while(expr.length())
	{
		while(expr[0] == ' ')
			expr.erase(0,1);
		if (expr[0] == '(' && (l = expr.find(')')) == std::string::npos)
				return (0);
		if (!parse_sum(expr, result))
			return (0);
	}
	return (1);
}

int		main(int argc, char **argv)
{
	Fixed 			result;
	std::string	expr;

	if (argc != 2)
	{
		std::cout << "usage: " << argv[0] << " <expr_to_eval>" << std::endl;
		return (1);
	}
	expr = argv[1];
	if (!parse_expr(expr, result))
	{
		std::cout << "Error in expression to eval" << std::endl;
		return (1);
	}
	std::cout << argv[1] << " = " << result << std::endl;
	return (0);
}
