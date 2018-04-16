#include "Fixed.hpp"

/*********************************************************************
* Constructor : Default
*********************************************************************/
Fixed::Fixed(void)
{
	std::cout << "Fixed Constructor (Default) called." << std::endl;

	this->_raw = 0;
}
/*********************************************************************
* Constructor : Copy
*********************************************************************/
Fixed::Fixed(Fixed const & src)
{
	std::cout << "Fixed Constructor (copy) called." << std::endl;
	std::cout << src.getRawBits() << " is copied." << std::endl;

	this->_raw = src.getRawBits();
}
/*********************************************************************
* Constructor : From int
*********************************************************************/
Fixed::Fixed(int const raw)
{
	std::cout << "Fixed Constructor (from int) called." << std::endl;
	std::cout << raw << " is copied." << std::endl;

	this->_raw = raw << Fixed::_nFixed;
}
/*********************************************************************
* Constructor : From float
*********************************************************************/
Fixed::Fixed(float const raw)
{
	std::cout << "Fixed Constructor (from float) called." << std::endl;
	std::cout << raw << " is copied." << std::endl;

	this->_raw = (int)roundf(raw * (1 << Fixed::_nFixed));
}
/*********************************************************************
* Destructor
*********************************************************************/
Fixed::~Fixed(void)
{
	std::cout << "Fixed Destructor called." << std::endl;
}
/*********************************************************************
* Assignation operator
*********************************************************************/
Fixed & Fixed::operator=(Fixed const & rhs)
{
	std::cout << "Fixed assignation called." << std::endl;
	std::cout << rhs.getRawBits()  << " is assigned to " ;
	std::cout << this->_raw  << "." << std::endl;

	this->_raw = rhs.getRawBits();
	return (*this);
}
/*********************************************************************
* Setter
*********************************************************************/
void Fixed::setRawBits(int const raw)
{
	this->_raw = raw;
}
/*********************************************************************
* Getter
*********************************************************************/
int Fixed::getRawBits(void) const
{
	return (this->_raw);
}
/*********************************************************************
* toInt
*********************************************************************/
int Fixed::toInt(void) const
{
	return (this->_raw >> Fixed::_nFixed);
}
/*********************************************************************
* tofloat
*********************************************************************/
float Fixed::toFloat(void) const
{
	return ((float)this->_raw / (1 << Fixed::_nFixed));
}
/*********************************************************************
* overload <
*********************************************************************/
bool Fixed::operator<(Fixed const & rhs) const
{
	return (this->_raw < rhs.getRawBits());
}
/*********************************************************************
* overload <=
*********************************************************************/
bool Fixed::operator<=(Fixed const & rhs) const
{
	return (this->_raw <= rhs.getRawBits());
}
/*********************************************************************
* overload >
*********************************************************************/
bool Fixed::operator>(Fixed const & rhs) const
{
	return (this->_raw > rhs.getRawBits());
}
/*********************************************************************
* overload >=
*********************************************************************/
bool Fixed::operator>=(Fixed const & rhs) const
{
	return (this->_raw >= rhs.getRawBits());
}
/*********************************************************************
* overload ==
*********************************************************************/
bool Fixed::operator==(Fixed const & rhs) const
{
	return (this->_raw == rhs.getRawBits());
}
/*********************************************************************
* overload !=
*********************************************************************/
bool Fixed::operator!=(Fixed const & rhs) const
{
	return (this->_raw != rhs.getRawBits());
}
/*********************************************************************
* overload +
*********************************************************************/
Fixed Fixed::operator+(Fixed const & rhs) const
{
	Fixed res;

	res._raw = this->_raw + rhs.getRawBits();
	return (res);
}
/*********************************************************************
* overload -
*********************************************************************/
Fixed Fixed::operator-(Fixed const & rhs) const
{
	Fixed res;

	res._raw = this->_raw - rhs.getRawBits();
	return (res);
}
/*********************************************************************
* overload *
*********************************************************************/
Fixed Fixed::operator*(Fixed const & rhs) const
{
	Fixed res(this->toFloat() * rhs.toFloat());

	return (res);
}
/*********************************************************************
* overload /
*********************************************************************/
Fixed Fixed::operator/(Fixed const & rhs) const
{
	if (!rhs.getRawBits())
		std::cout << "Divison by 0 !!!";
	Fixed res(this->toFloat() / rhs.toFloat());

	return (res);
}
/*********************************************************************
* overload +=
*********************************************************************/
void Fixed::operator+=(Fixed const & rhs)
{
	this->_raw += rhs.getRawBits();
}
/*********************************************************************
* overload -=
*********************************************************************/
void Fixed::operator-=(Fixed const & rhs)
{
	this->_raw -= rhs.getRawBits();
}
/*********************************************************************
* overload *
*********************************************************************/
void Fixed::operator*=(Fixed const & rhs)
{
	this->_raw = (int)roundf(this->toFloat() * rhs.toFloat() * (1 << Fixed::_nFixed));
}
/*********************************************************************
* overload /=
*********************************************************************/
void Fixed::operator/=(Fixed const & rhs)
{
	if (!rhs.getRawBits())
		std::cout << "Divison by 0 !!!";
	this->_raw = (int)roundf(this->toFloat() / rhs.toFloat() * (1 << Fixed::_nFixed));;
}
/*********************************************************************
* overload ++.
*********************************************************************/
Fixed &				Fixed::operator++(void)
{
	this->_raw++;
	return (*this);
}
/*********************************************************************
* overload .++
*********************************************************************/
Fixed				Fixed::operator++(int)
{
	Fixed tmp = *this;

	this->operator++();
	return (tmp);
}
/*********************************************************************
* overload --.
*********************************************************************/
Fixed &				Fixed::operator--(void)
{
	this->_raw--;
	return (*this);
}
/*********************************************************************
* overload .--
*********************************************************************/
Fixed				Fixed::operator--(int)
{
	Fixed tmp = *this;

	this->operator--();
	return (tmp);
}
/*********************************************************************
* min
*********************************************************************/
Fixed &			Fixed::min(Fixed & f1, Fixed & f2)
{
	return (f1.getRawBits() > f2.getRawBits() ? f2 : f1);
}
/*********************************************************************
* min
*********************************************************************/
Fixed const &	Fixed::min(Fixed const & f1, Fixed const & f2)
{
	return (f1.getRawBits() > f2.getRawBits() ? f2 : f1);
}
/*********************************************************************
* max
*********************************************************************/
Fixed &			Fixed::max(Fixed & f1, Fixed & f2)
{
	return (f1.getRawBits() < f2.getRawBits() ? f2 : f1);
}
/*********************************************************************
* max
*********************************************************************/
Fixed const &	Fixed::max(Fixed const & f1, Fixed const & f2)
{
	return (f1.getRawBits() < f2.getRawBits() ? f2 : f1);
}
/*********************************************************************
* overload <<
*********************************************************************/
std::ostream & operator<<(std::ostream & os, Fixed const & rhs)
{
	os << rhs.toFloat();
	return (os);
}
