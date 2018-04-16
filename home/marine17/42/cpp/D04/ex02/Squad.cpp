#include "Squad.h"


/*********************************************************************
* Constructor Default
*********************************************************************/
Squad::Squad(void)
{
	std::cout << "Squad constructed." << std::endl;
	this->_units_count = 0;
	this->_units_max = 16;
}
/*********************************************************************
* Destructor
*********************************************************************/
Squad::~Squad(void)
{
	std::cout << "Squad destructed." << std::endl;
	int				i = -1;
	while (++i < this->_unit_count)
	{
		delete *this->getUnit(i);
	}
}
/*********************************************************************
* Constructor (Copy)
*********************************************************************/
Squad::Squad(Squad const & src)
{
	std::cout << "Squad constructed (Copy)." << std::endl;
	*this = src;
}
/*********************************************************************
* Constructor (Copy)
*********************************************************************/
Squad::Squad(Squad const & src)
{
	std::cout << "Squad constructed (Copy)." << std::endl;
	*this = src;
}
/*********************************************************************
* Getter _units_count
*********************************************************************/
int Squad::getCount(void) const
{
	return (this->_units_count);
}
/*********************************************************************
* Getter _units[i]
*********************************************************************/
ISpaceMarine	* Squad::getUnit(int index)
{
	if (index < 0 || index > this->_units_count -1)
		return (nullptr);
	return (this->_units[index]);
}
/*********************************************************************
* push unit
*********************************************************************/
int Squad::push(ISpaceMarine *unit)
{
	if (unit == nullptr || this->_units_count == this->_units_max)
		return (this->_units_count);
	int	i = -1;
	while (++i < this->_units_count)
	{
		if (unit == this->_units[i])
			return (this->_units_count);
	}
	this->_units[i] = unit;
}
