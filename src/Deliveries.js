import React, { Component } from 'react';
import {Card, CardTitle, CardText, CardActions, DataTable, TableHeader, Button} from 'react-mdl';
import {database} from './App';
import './Deliveries.css';

class Delivery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveryData: []
        }
    }

    getDelivery(deliveryId) {
        database.ref(`finishedOrders/${deliveryId}`).on('value', data => {
                let deliveryData = [];
                data.child('cart').forEach(item => {
                    database.ref('menu/' + data.child('stall').val() + '/' + item.key).once('value')
                        .then(itemData => {
                            deliveryData.push({
                               item: itemData.child('name').val(),
                               quantity: item.val()
                            });
                            this.setState({
                                deliveryData: deliveryData
                            });
                        });
                });
            });
    }

    componentWillMount() {
        this.getDelivery(this.props.deliveryId)
    }

    render() {
        console.log(this.state.deliveryData);
        return (
            <div className="Delivery">
            <Card shadow={0} style={{width: '100%'}}>
                <CardText>
                        <DataTable
                            rows={this.state.deliveryData}
                            style={{width: '100%'}}
                        >
                            <TableHeader name="item">Item</TableHeader>
                            <TableHeader numeric name="quantity">Num</TableHeader>
                        </DataTable>
                </CardText>
            </Card>
            </div>
        );
    }
}

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
            });
            self.setState({
                deliveries: deliveries
            })
        })
    }

    render() {
        let deliveries = [];
        this.state.deliveries.forEach(id => {
            deliveries.push(<Delivery key={id} deliveryId={id}/>)
        });
        return (
            <div className="Deliveries">
                <h2>Deliveries</h2>
                {deliveries}
            </div>
        )
    }
}
