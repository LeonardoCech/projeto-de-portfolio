import PropTypes from 'prop-types';

import './List.css';


const List = (props) => {

    switch (props.variation) {
        default:
    }
};


List.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    deleteExchangeConnection: PropTypes.func,
    exchanges: PropTypes.array,
    hideSmallPositions: PropTypes.bool,
    hideValues: PropTypes.bool,
    id: PropTypes.string,
    items: PropTypes.array,
    lang: PropTypes.string,
    selectedCurrency: PropTypes.string,
    selectedTimeframe: PropTypes.string,
    onChange: PropTypes.func,
    onItemClick: PropTypes.func,
    variation: PropTypes.string
};


export default List;
