import React, { Component } from 'react';
import {Card, CardTitle, CardActions, Button} from 'react-mdl';
import {database} from './App';
import './Deliveries.css';

export default class Stalls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveries: []
        };
    }

    componentDidMount() {
        const self = this;
        // database.ref('stalls').on('value', (data) => {
        //     let stalls = [];
        //     Object.keys(data.val()).forEach((key, index) => {
        //         stalls.push(key);
        //     });
        //     self.setState({
        //         stalls: stalls
        //     })
        // })
    }

    render() {
        let deliveries = [];
        this.state.stalls.forEach(id => {
            deliveries.push(<p>{id}</p>)
        });
        return (
            <div className = "Stalls" >
                <h2>Deliveries</h2>
                {display}
            </div>
        )
    }
}
