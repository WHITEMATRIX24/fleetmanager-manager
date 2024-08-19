import React from 'react';
import axios from 'axios';

class LocationInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: '', suggestions: [], loading: false };
    }

    handleChange = async (address) => {
        this.setState({ address, loading: true });

        if (address.length > 2) {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1&limit=5`, {
                headers: {
                    'Accept-Language': 'en'
                }
            });

            const suggestions = response.data.filter(suggestion => this.isEnglish(suggestion.display_name));
            this.setState({ suggestions, loading: false });
        } else {
            this.setState({ suggestions: [], loading: false });
        }
    };

    isEnglish = (text) => {
        return /^[\x00-\x7F]*$/.test(text);
    };

    handleSelect = (suggestion) => {
        this.setState({ address: suggestion.display_name, suggestions: [] });

        const { lat, lon } = suggestion;
        const latLng = { lat: parseFloat(lat), lng: parseFloat(lon) };

        console.log('Success', latLng);
        this.props.onSelectAddress(suggestion.display_name, latLng);
    };

    render() {
        return (
            <div>
                <input
                    type="text"
                    value={this.state.address}
                    onChange={(e) => this.handleChange(e.target.value)}
                    placeholder="Search Places ..."
                    className="c-input-field"
                />
                <div className="autocomplete-dropdown-container">
                    {this.state.loading && <div>Loading...</div>}
                    {this.state.suggestions.map((suggestion, index) => {
                        const className = 'suggestion-item';
                        const style = { backgroundColor: '#ffffff', cursor: 'pointer' };

                        return (
                            <div
                                key={index}
                                className={className}
                                style={style}
                                onClick={() => this.handleSelect(suggestion)}
                            >
                                <span>{suggestion.display_name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default LocationInput;
