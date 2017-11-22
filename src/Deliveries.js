import React, { Component } from 'react';
import {Card, CardTitle, CardActions, Button} from 'react-mdl';
import {database} from './App';
import './Deliveries.css';

export default class Deliveries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveries: []
        };
    }

    componentDidMount() {
        const self = this;
        database.ref('finishedOrders').on('value', data => {
            let deliveries = [];
            data.forEach(delivery => {
                deliveries.push(delivery.key);
            })
            self.setState({
                deliveries: deliveries
            })
        })
    }

    render() {
        let deliveries = [];
        this.state.deliveries.forEach(id => {
            deliveries.push(<p>{id}</p>)
        });
        return (
            <div className="Deliveries">
                <h2>Deliveries</h2>
                {deliveries}
            </div>
        )
    }
}
