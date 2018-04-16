#ifndef FIXED_HPP
# define FIXED_HPP
# include <iostream>
# include <cmath>
# include <string>
# include <sstream>

class Fixed
{
	public:
		Fixed(void);
		Fixed(Fixed const & src);
		Fixed(int const raw);
		Fixed(float const raw);
		~Fixed(void);

		Fixed &					operator=(Fixed const & rhs);
		int						getRawBits(void) const;
		void					setRawBits(int const raw);
		int						toInt(void) const;
		float					toFloat(void) const;
		bool					operator<(Fixed const & rhs) const;
		bool					operator<=(Fixed const & rhs) const;
		bool					operator>(Fixed const & rhs) const;
		bool					operator>=(Fixed const & rhs) const;
		bool					operator==(Fixed const & rhs) const;
		bool					operator!=(Fixed const & rhs) const;
		Fixed 					operator+(Fixed const & rhs) const;
		Fixed 					operator-(Fixed const & rhs) const;
		Fixed 					operator*(Fixed const & rhs) const;
		Fixed 					operator/(Fixed const & rhs) const;
		void 						operator+=(Fixed const & rhs);
		void 						operator-=(Fixed const & rhs);
		void 						operator*=(Fixed const & rhs);
		void 						operator/=(Fixed const & rhs);
		Fixed &					operator++(void);
		Fixed					operator++(int);
		Fixed &					operator--(void);
		Fixed					operator--(int);
		static Fixed &			min(Fixed & f1, Fixed & f2);
		static Fixed &			max(Fixed & f1, Fixed & f2);
		static Fixed const &	min(Fixed const & f1, Fixed const & f2);
		static Fixed const &	max(Fixed const & f1, Fixed const & f2);
	private:
		int					_raw;
		static int const	_nFixed = 8;
};

std::ostream & 				operator<<(std::ostream & os, Fixed const & rhs);
#endif
